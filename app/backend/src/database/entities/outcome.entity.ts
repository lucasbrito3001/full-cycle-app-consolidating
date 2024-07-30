import { Categories } from 'src/constants/enums';
import { Outcome } from 'src/domain/outcome/outcome.domain';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'outcome' })
export class OutcomeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Categories })
  category: Categories;

  @Column()
  description: string;

  @Column()
  value: number;

  @Column({ type: 'date' })
  date: string;

  @ManyToOne(() => UserEntity, (user) => user.outcomes)
  user: UserEntity;

  constructor(
    id?: number,
    category?: Categories,
    description?: string,
    value?: number,
    date?: string,
  ) {
    this.id = id;
    this.category = category;
    this.description = description;
    this.value = value;
    this.date = date;
  }

  static fromDomain(outcome: Outcome): OutcomeEntity {
    return new OutcomeEntity(
      outcome.id,
      outcome.category,
      outcome.description,
      outcome.value,
      outcome.date,
    );
  }
}
