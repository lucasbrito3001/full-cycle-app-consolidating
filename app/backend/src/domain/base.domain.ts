import { randomUUID, UUID } from 'crypto';

export abstract class DomainBase {
  constructor(protected _id?: number, protected _uuid?: string) {}

  get id(): number {
    return this._id;
  }
  get uuid(): string {
    return this._uuid;
  }

  protected static createUUID(): UUID {
    return randomUUID();
  }
}
