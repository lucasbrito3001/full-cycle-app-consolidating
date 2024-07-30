import { Test } from '@nestjs/testing';
import {
  mockDataSource,
  mockUser,
  mockUserEntity,
  spyConnect,
  spyFromEntity,
  spyRelease,
  spySave,
} from 'src/constants/mock';
import { UserRepository } from './user.repository';
import { InternalErrorException } from 'src/shared/exceptions';
import { UserFactory } from 'src/domain/factory/user';

describe('[repository] user', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: 'pgsqlDataSource', useValue: { ...mockDataSource } },
        { provide: UserFactory, useValue: { fromEntity: spyFromEntity } },
        UserRepository,
      ],
    }).compile();

    userRepository = moduleRef.get(UserRepository);
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should throw exception when have a rejection to persist the user', async () => {
      spySave.mockRejectedValueOnce('');

      await expect(userRepository.save(mockUser)).rejects.toThrow(
        InternalErrorException,
      );
    });

    it('should call the connect and release methods and return an User instance', async () => {
      spySave.mockResolvedValueOnce(mockUserEntity);
      spyFromEntity.mockReturnValueOnce('');

      const result = await userRepository.save(mockUser);

      expect(spySave).toHaveBeenCalledTimes(1);
      expect(spyConnect).toHaveBeenCalledTimes(1);
      expect(spyRelease).toHaveBeenCalledTimes(1);

      expect(result).toBe('');
    });
  });
});
