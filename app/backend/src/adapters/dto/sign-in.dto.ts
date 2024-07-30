import { z } from 'zod';

export const signInInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type SignInInput = z.infer<typeof signInInputSchema>;

export class SignInOutput {
  constructor(public access_token: string) {}
}
