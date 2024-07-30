import { Test } from '@nestjs/testing';
import { RegisterUser } from './register-user.usecase';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/adapters/repositories/user/user.repository';
import {
  InternalErrorException,
  UniqueKeyConstraintViolationException,
} from 'src/shared/exceptions';
import { RegisterUserOutput } from 'src/adapters/dto/register-user.dto';
import {
  mockUserEntity,
  mockUserRepository,
  spyFindByEmail,
  spySave,
} from 'src/constants/mock';
import { UtilsModule } from 'src/modules/utils.module';
import { UserFactory } from 'src/domain/factory/user';

describe('[use-case] register-user', () => {
  let registerUser: RegisterUser;
  let spySign = jest.fn();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UtilsModule, JwtModule],
      providers: [
        RegisterUser,
        UserFactory,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: JwtService, useValue: { sign: spySign } },
      ],
    }).compile();

    registerUser = moduleRef.get(RegisterUser);
    jest.clearAllMocks();
  });

  it('should return unique key violation when already have an user registered with the same email', async () => {
    spyFindByEmail.mockResolvedValueOnce({});

    await expect(
      registerUser.execute({
        email: 'test@example.com',
        password: 'testpassword',
        familyIncome: 1000,
        name: 'John Doe',
      }),
    ).rejects.toThrow(UniqueKeyConstraintViolationException);
  });

  it('should throw exception when have a rejection to persist the user', async () => {
    spyFindByEmail.mockResolvedValueOnce(null);
    spySave.mockRejectedValueOnce('');

    await expect(
      registerUser.execute({
        email: 'test@example.com',
        password: 'testpassword',
        familyIncome: 1000,
        name: 'John Doe',
      }),
    ).rejects.toThrow(InternalErrorException);
  });

  it('should register the user successfully', async () => {
    const mockToken = 'sometoken';
    spyFindByEmail.mockResolvedValueOnce(null);
    spySave.mockResolvedValueOnce(mockUserEntity);
    spySign.mockReturnValueOnce(mockToken);

    const result = await registerUser.execute({
      email: 'test@example.com',
      password: 'testpassword',
      familyIncome: 1000,
      name: 'John Doe',
    });

    expect(result).toBeInstanceOf(RegisterUserOutput);
    expect(result.token).toBe(mockToken);
  });
});
