import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RegisterUserInput } from 'src/adapters/dto/register-user.dto';
import { UserEntity } from 'src/database/entities/user.entity';
import { DomainBase } from 'src/domain/base.domain';
import { HashService } from 'src/shared/utils/hash.service';

export type TUser = {
  name: string;
  email: string;
  familyIncome: number;
  passwordHash?: string;
  uuid?: string;
  id?: number;
};

class User extends DomainBase {
  constructor(
    public name: string,
    public email: string,
    public familyIncome: number,
    private _passwordHash?: string,
    uuid?: string,
    id?: number,
  ) {
    super(id, uuid);
  }

  get passwordHash(): string {
    return this._passwordHash;
  }
}

@Injectable()
export class UserFactory {
  constructor(private readonly hashService: HashService) {}

  async create(registerUserInput: RegisterUserInput): Promise<User> {
    const uuid = randomUUID();
    const passwordHash = await this.hashService.hashText(
      registerUserInput.password,
    );

    return new User(
      registerUserInput.name,
      registerUserInput.email,
      registerUserInput.familyIncome,
      passwordHash,
      uuid,
      null,
    );
  }

  fromEntity(entity: UserEntity): User {
    return new User(
      entity.name,
      entity.email,
      entity.familyIncome,
      entity.passwordHash,
      entity.uuid,
      entity.id,
    );
  }
}
