import { AddOutcomeInput } from 'src/adapters/dto/add-outcome.dto';
import { User } from './user.domain';
import { randomUUID } from 'crypto';
import { RegisterUserInput } from 'src/adapters/dto/register-user.dto';

describe('user', () => {
  it('should create an user successfully', () => {
    const input: RegisterUserInput = {
      email: 'email@example.com',
      familyIncome: 1000,
      name: 'John Doe',
      password: 'password',
    };

    const user = User.create(input);

    expect(user.email).toBeDefined();
    expect(user.familyIncome).toBeDefined();
    expect(user.name).toBeDefined();
    expect(user.passwordHash).toBeDefined();
    expect(user.uuid).toBeDefined();
    expect(user.id).toBeNull();
  });

  it('should convert entity to domain', () => {
    const uuid = randomUUID();
    const input = {
      email: 'email@example.com',
      familyIncome: 1000,
      name: 'John Doe',
      password: 'password',
      id: 1,
      uuid,
    };

    const user = User.create(input);

    expect(user.email).toBeDefined();
    expect(user.familyIncome).toBeDefined();
    expect(user.name).toBeDefined();
    expect(user.passwordHash).toBeDefined();
    expect(user.uuid).toBeDefined();
    expect(user.id).toBeDefined();
  });
});
