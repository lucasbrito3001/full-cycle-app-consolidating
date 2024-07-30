import { Injectable, Logger } from '@nestjs/common';
import {
  AddOutcomeInput,
  AddOutcomeOutput,
} from 'src/adapters/dto/add-outcome.dto';
import { OutcomeRepository } from 'src/adapters/repositories/outcome/outcome.repository';
import { UserRepository } from 'src/adapters/repositories/user/user.repository';
import { Outcome } from 'src/domain/outcome/outcome.domain';
import { EntityNotFoundException } from 'src/shared/exceptions';

@Injectable()
export class AddOutcome {
  private logger = new Logger('AddOutcome');

  constructor(
    private readonly userRepository: UserRepository,
    private readonly outcomeRepository: OutcomeRepository,
  ) {}

  async execute(userUUID: string, input: AddOutcomeInput): Promise<AddOutcomeOutput> {
    this.logger.log('Start searching user by UUID');
    const user = await this.userRepository.findByUUID(userUUID);

    if (!user) throw new EntityNotFoundException();

    this.logger.log('Converting outcome input to domain');
    const outcome = Outcome.create(input);

    this.logger.log('Persisting new outcome in database');
    const savedOutcome = await this.outcomeRepository.save(outcome, user);

    this.logger.log('Converting saving result to output and returning');
    return new AddOutcomeOutput(savedOutcome.id);
  }
}
