import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OutcomeEntity } from './outcome.entity';
import { TUser } from 'src/domain/factory/user';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  uuid: string;

  @Column()
  name: string;

  @Column()
  passwordHash: string;

  @Column({ unique: true })
  email: string;

  @Column()
  familyIncome: number;

  @OneToMany(() => OutcomeEntity, (outcome) => outcome.user)
  outcomes: OutcomeEntity[];

  constructor(
    id?: number,
    uuid?: string,
    name?: string,
    passwordHash?: string,
    email?: string,
    familyIncome?: number,
  ) {
    this.id = id;
    this.uuid = uuid;
    this.name = name;
    this.passwordHash = passwordHash;
    this.email = email;
    this.familyIncome = familyIncome;
  }

  static fromDomain(user: TUser): UserEntity {
    return new UserEntity(
      user.id,
      user.uuid,
      user.name,
      user.passwordHash,
      user.email,
      user.familyIncome,
    );
  }
}
