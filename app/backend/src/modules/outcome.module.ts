import { Module } from '@nestjs/common';
import { UserRepository } from 'src/adapters/repositories/user/user.repository';
import { AddOutcome } from 'src/application/usecases/add-outcome/add-outcome.usecase';
import { OutcomeRepository } from 'src/adapters/repositories/outcome/outcome.repository';
import { OutcomeController } from 'src/adapters/controllers/outcome/outcome.controller';
import { UserFactory } from 'src/domain/factory/user';
import { UtilsModule } from './utils.module';

@Module({
  providers: [AddOutcome, UserRepository, OutcomeRepository, UserFactory],
  controllers: [OutcomeController],
  imports: [UtilsModule],
})
export class OutcomeModule {}
