import { SignIn } from './sign-in.usecase';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/adapters/repositories/user/user.repository';
import {
  mockUserRepository,
  spyCompareHash,
  spyFindByEmail,
  spyHash,
} from 'src/constants/mock';
import { Test } from '@nestjs/testing';
import { InvalidCredentialsException } from 'src/shared/exceptions';
import { HashService } from 'src/shared/utils/hash.service';
import { UtilsModule } from 'src/modules/utils.module';
import { UserFactory } from 'src/domain/factory/user';

describe('[use-case] sign-in', () => {
  let signIn: SignIn;
  let spySign = jest.fn();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UtilsModule, JwtModule],
      providers: [
        SignIn,
        UserFactory,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: JwtService, useValue: { sign: spySign } },
        {
          provide: HashService,
          useValue: { hashText: spyHash, compareHash: spyCompareHash },
        },
      ],
    }).compile();

    signIn = moduleRef.get(SignIn);
    jest.clearAllMocks();
  });

  it('should throw invalid credentials exception when the email not exists in the database', async () => {
    spyFindByEmail.mockResolvedValueOnce(null);

    expect(() => signIn.execute('mock@email.com', 'mockpass')).rejects.toThrow(
      InvalidCredentialsException,
    );
  });

  it('should throw invalid credentials exception when the password is incorrect', async () => {
    spyFindByEmail.mockResolvedValueOnce({ password: 'mockpass1' });
    spyCompareHash.mockResolvedValueOnce(false);

    expect(() => signIn.execute('mock@email.com', 'mockpass2')).rejects.toThrow(
      InvalidCredentialsException,
    );
  });

  it('should return the token as the output when the sign in succeeds', async () => {
    spyFindByEmail.mockResolvedValueOnce({ password: 'mockpass1' });
    spyCompareHash.mockResolvedValueOnce(true);
    spySign.mockReturnValueOnce('mocktoken');

    const result = await signIn.execute('mock@email.com', 'mockpass2');

    expect(result).toHaveProperty('access_token');
    expect(result.access_token).toBe('mocktoken');
  });
});
