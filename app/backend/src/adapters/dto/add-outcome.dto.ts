import { Categories } from 'src/constants/enums';
import { z } from 'zod';

export const addOutcomeInputSchema = z.object({
  value: z.number().positive(),
  description: z.string(),
  category: z.nativeEnum(Categories),
});

export type AddOutcomeInput = z.infer<typeof addOutcomeInputSchema>;

export class AddOutcomeOutput {
  constructor(public id: number) {}
}
