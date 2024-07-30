import { AddOutcomeInput } from 'src/adapters/dto/add-outcome.dto';
import { Outcome } from './outcome.domain';
import { randomUUID } from 'crypto';
import { Categories } from 'src/constants/enums';

describe('outcome', () => {
  it('should create an outcome successfully', () => {
    const input: AddOutcomeInput = {
      category: Categories.NonEssential,
      description: 'mock',
      value: 100,
    };

    const outcome = Outcome.create(input);

    expect(new Date(outcome.date)).not.toBeNaN();
    expect(outcome.category).toBeDefined();
    expect(outcome.description).toBeDefined();
    expect(outcome.value).toBeDefined();
    expect(outcome.id).toBeNull();
  });

  it('should convert entity to domain', () => {
    const entity = {
      category: 'NON_ESSENTIAL',
      description: 'mock',
      value: 100,
      date: '2024-01-01',
      id: 1,
    };

    const outcome = Outcome.fromEntity(entity);

    expect(outcome.date).toBeDefined();
    expect(outcome.category).toBeDefined();
    expect(outcome.description).toBeDefined();
    expect(outcome.value).toBeDefined();
    expect(outcome.id).toBeDefined();
  });
});
