import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { RegisterUser } from 'src/application/usecases/register-user/register-user.usecase';
import { UtilsModule } from 'src/modules/utils.module';
import { JwtModule } from '@nestjs/jwt';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: RegisterUser, useValue: { execute: jest.fn() } }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
