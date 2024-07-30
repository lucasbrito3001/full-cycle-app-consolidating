import { Test, TestingModule } from '@nestjs/testing';
import { OutcomeController } from './outcome.controller';
import { JwtService } from '@nestjs/jwt';
import { AddOutcome } from 'src/application/usecases/add-outcome/add-outcome.usecase';

describe('OutcomeController', () => {
  let controller: OutcomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OutcomeController],
      providers: [JwtService, { provide: AddOutcome, useValue: jest.fn() }],
    }).compile();

    controller = module.get<OutcomeController>(OutcomeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
