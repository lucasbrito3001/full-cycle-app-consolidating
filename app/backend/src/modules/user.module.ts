import { Module } from '@nestjs/common';
import { UserController } from 'src/adapters/controllers/user/user.controller';
import { UserRepository } from 'src/adapters/repositories/user/user.repository';
import { RegisterUser } from 'src/application/usecases/register-user/register-user.usecase';
import { UtilsModule } from './utils.module';
import { UserFactory } from 'src/domain/factory/user';

@Module({
  providers: [RegisterUser, UserRepository, UserFactory],
  controllers: [UserController],
  imports: [UtilsModule],
})
export class UserModule {}
