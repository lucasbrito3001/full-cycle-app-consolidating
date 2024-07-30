import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  RegisterUserInput,
  RegisterUserOutput,
} from 'src/adapters/dto/register-user.dto';
import { UserRepository } from 'src/adapters/repositories/user/user.repository';
import { TUser, UserFactory } from 'src/domain/factory/user';
import {
  InternalErrorException,
  UniqueKeyConstraintViolationException,
} from 'src/shared/exceptions';

@Injectable()
export class RegisterUser {
  private readonly logger = new Logger('RegisterUser');

  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private userFactory: UserFactory,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    let userFoundByEmail: TUser | null;

    try {
      this.logger.log('Start searching user by email to check duplicated user');

      userFoundByEmail = await this.userRepository.findByEmail(input.email);
    } catch (error) {
      throw new InternalErrorException(error);
    }

    this.logger.log('Checking user duplication');

    if (userFoundByEmail !== null)
      throw new UniqueKeyConstraintViolationException(['email']);

    this.logger.log('Start user domain creation');

    const user = await this.userFactory.create(input);

    this.logger.log('User domain created');

    this.logger.log('Start persisting new user');

    let savedUser: TUser;

    try {
      savedUser = await this.userRepository.save(user);
    } catch (error) {
      throw new InternalErrorException(error);
    }

    this.logger.log('User persisted');

    this.logger.log('Start jwt creation');

    const token = this.jwtService.sign({ id: savedUser.id, uuid: user.uuid });

    this.logger.log('Token created');

    return new RegisterUserOutput(savedUser.id, user.uuid, token);
  }
}
