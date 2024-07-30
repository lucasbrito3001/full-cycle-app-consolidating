import { AddOutcomeInput } from 'src/adapters/dto/add-outcome.dto';
import { DomainBase } from '../base.domain';
import { Categories } from 'src/constants/enums';

export class Outcome extends DomainBase {
  private constructor(
    public value: number,
    public description: string,
    private _category: Categories,
    private _date: string,
    id?: number,
  ) {
    super(id);
  }

  get date(): string {
    return this._date;
  }
  get category(): Categories {
    return this._category;
  }

  static create(createOutcomeInput: AddOutcomeInput): Outcome {
    const today = new Date().toISOString().substring(0, 10);

    return new Outcome(
      createOutcomeInput.value,
      createOutcomeInput.description,
      createOutcomeInput.category,
      today,
      null,
    );
  }

  static fromEntity(outcomeEntity: any): Outcome {
    return new Outcome(
      outcomeEntity.value,
      outcomeEntity.description,
      outcomeEntity.date,
      outcomeEntity.category,
      outcomeEntity.id,
    );
  }
}
