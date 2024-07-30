import { Module } from '@nestjs/common';
import { AuthController } from 'src/adapters/controllers/auth/auth.controller';
import { UserRepository } from 'src/adapters/repositories/user/user.repository';
import { SignIn } from 'src/application/usecases/sign-in/sign-in.usecase';
import { UtilsModule } from './utils.module';
import { UserFactory } from 'src/domain/factory/user';

@Module({
  providers: [SignIn, UserRepository, UserFactory],
  controllers: [AuthController],
  imports: [UtilsModule],
})
export class AuthModule {}
