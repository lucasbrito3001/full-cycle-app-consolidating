import { z } from 'zod';

export const registerUserInputSchema = z.object({
  name: z.string(),
  email: z.string(),
  familyIncome: z.number().positive(),
  password: z.string(),
});

export type RegisterUserInput = z.infer<typeof registerUserInputSchema>;

export class RegisterUserOutput {
  constructor(public id: number, public uuid: string, public token: string) {}
}
