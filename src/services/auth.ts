import { registerFormSchema } from '@/components/register-form'
import { z } from 'zod'

export async function registerUser(formData: z.infer<typeof registerFormSchema>) {
    console.log("Form Data", formData)
}