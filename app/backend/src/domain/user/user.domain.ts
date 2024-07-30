import { RegisterUserInput } from 'src/adapters/dto/register-user.dto';
import { DomainBase } from '../base.domain';
import { UserEntity } from 'src/database/entities/user.entity';
import { hash } from 'bcrypt';

export class User extends DomainBase {
  private constructor(
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

  static create(registerUserDto: RegisterUserInput): User {
    const uuid = this.createUUID();

    return new User(
      registerUserDto.name,
      registerUserDto.email,
      registerUserDto.familyIncome,
      registerUserDto.password,
      uuid,
      null,
    );
  }

  static fromEntity(userEntity: UserEntity): User {
    return new User(
      userEntity.name,
      userEntity.email,
      userEntity.familyIncome,
      userEntity.passwordHash,
      userEntity.uuid,
      userEntity.id,
    );
  }
}
