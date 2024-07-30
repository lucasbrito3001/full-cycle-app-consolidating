import { Test } from '@nestjs/testing';
import { AddOutcome } from './add-outcome.usecase';
import { UserRepository } from 'src/adapters/repositories/user/user.repository';
import {
  mockOutcomeRepository,
  mockUser,
  mockUserRepository,
  spyFindByUUID,
  spySave,
} from 'src/constants/mock';
import { EntityNotFoundException } from 'src/shared/exceptions';
import { Categories } from 'src/constants/enums';
import { randomUUID } from 'crypto';
import { AddOutcomeOutput } from 'src/adapters/dto/add-outcome.dto';
import { OutcomeRepository } from 'src/adapters/repositories/outcome/outcome.repository';
import { UserFactory } from 'src/domain/factory/user';

describe('[use-case] add-outcome', () => {
  let addOutcome: AddOutcome;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [
        AddOutcome,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: OutcomeRepository, useValue: mockOutcomeRepository },
      ],
    }).compile();

    addOutcome = moduleRef.get(AddOutcome);
    jest.clearAllMocks();
  });

  it('should throw EntityNotFoundException when the user is not found', () => {
    spyFindByUUID.mockResolvedValueOnce(null);

    expect(() =>
      addOutcome.execute(randomUUID(), {
        category: Categories.Essential,
        description: 'House rent',
        value: 450,
      }),
    ).rejects.toThrow(EntityNotFoundException);
  });

  it('should add an outcome successfully', async () => {
    spyFindByUUID.mockResolvedValueOnce(mockUser);
    spySave.mockResolvedValueOnce({ id: 1 });

    const result = await addOutcome.execute(randomUUID(), {
      category: Categories.Essential,
      description: 'House rent',
      value: 450,
    });

    expect(result).toBeInstanceOf(AddOutcomeOutput);
  });
});
