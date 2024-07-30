import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { InternalErrorException } from '../exceptions';

@Injectable()
export class HashService {

  async hashText(text: string): Promise<string> {
    try {
      const hashedText = await hash(text, +process.env.SALT_ROUNDS || 1);
      return hashedText;
    } catch (error) {
      throw new InternalErrorException(error);
    }
  }

  async compareHash(text: string, hash: string): Promise<boolean> {
    try {
      const textsMatch = await compare(text, hash);
      return textsMatch;
    } catch (error) {
      throw new InternalErrorException(error);
    }
  }
}
