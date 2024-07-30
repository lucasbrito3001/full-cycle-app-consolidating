import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInOutput } from 'src/adapters/dto/sign-in.dto';
import { UserRepository } from 'src/adapters/repositories/user/user.repository';
import { TUser } from 'src/domain/factory/user';
import { InvalidCredentialsException } from 'src/shared/exceptions';
import { HashService } from 'src/shared/utils/hash.service';

@Injectable()
export class SignIn {
  private readonly logger = new Logger('SignIn');

  constructor(
    private hashService: HashService,
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async execute(email: string, password: string): Promise<SignInOutput> {
    this.logger.log('Start searching user by email to check credentials');

    const userFoundByEmail: TUser | null =
      await this.userRepository.findByEmail(email);

    if (userFoundByEmail === null) throw new InvalidCredentialsException();

    this.logger.log(
      'Comparing found user password hash with the received password',
    );

    const compareResult = await this.hashService.compareHash(
      password,
      userFoundByEmail.passwordHash,
    );

    if (!compareResult) throw new InvalidCredentialsException();

    this.logger.log('Generating JWT to return to the client');

    const token = this.jwtService.sign({
      uuid: userFoundByEmail.uuid,
      id: userFoundByEmail.id,
    });

    return new SignInOutput(token);
  }
}
