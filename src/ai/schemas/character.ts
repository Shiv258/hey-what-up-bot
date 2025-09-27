import { z } from 'zod';

export const CharacterSchema = z.enum(['Kaira', 'Aisha', 'Mayra', 'Bailey']);
export type Character = z.infer<typeof CharacterSchema>;
