import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { SignIn } from 'src/application/usecases/sign-in/sign-in.usecase';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: SignIn, useValue: { execute: jest.fn() } }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
