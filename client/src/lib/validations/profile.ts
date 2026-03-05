import { z } from 'zod';

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must not exceed 50 characters')
    .optional()
    .or(z.literal('')),
  email: z.email('Please enter a valid email address').min(1, 'Email is required'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
