import { Test } from '@nestjs/testing';
import {
  mockDataSource,
  mockOutcome,
  mockUser,
  mockUserEntity,
  spyConnect,
  spyRelease,
  spySave,
} from 'src/constants/mock';
import { User } from 'src/domain/user/user.domain';
import { InternalErrorException } from 'src/shared/exceptions';
import { OutcomeRepository } from './outcome.repository';
import { Outcome } from 'src/domain/outcome/outcome.domain';

describe('[repository] outcome', () => {
  let outcomeRepository: OutcomeRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: 'pgsqlDataSource', useValue: { ...mockDataSource } },
        OutcomeRepository,
      ],
    }).compile();

    outcomeRepository = moduleRef.get(OutcomeRepository);
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should throw exception when have a rejection to persist the outcome', async () => {
      spySave.mockRejectedValueOnce('');

      await expect(
        outcomeRepository.save(mockOutcome, mockUser),
      ).rejects.toThrow(InternalErrorException);
    });

    it('should call the connect and release methods and return an Outcome instance', async () => {
      spySave.mockResolvedValueOnce(mockOutcome);

      const outcome = await outcomeRepository.save(mockOutcome, mockUser);

      expect(spySave).toHaveBeenCalledTimes(1);
      expect(spyConnect).toHaveBeenCalledTimes(1);
      expect(spyRelease).toHaveBeenCalledTimes(1);
      expect(outcome).toBeInstanceOf(Outcome);
    });
  });
});
