'use server'
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import { cookies } from 'next/headers';

import { z } from 'zod'

const registerFormSchema = z
    .object({
        firstname: z
            .string()
            .min(3, { message: "firstname must contain at least 3 char" })
            .max(25, { message: "firstname must contain at most 25 char" }),
        email: z.string().email(),
        password: z
            .string()
            .min(8)
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                {
                    message:
                        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
                }
            )
            .max(50),
    })

const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
const SECRET = process.env.TOKEN_SECRET;

export async function registerUser(formData: z.infer<typeof registerFormSchema>) {
    try {
        const validatedFields = registerFormSchema.safeParse(formData);
        if (!validatedFields.success) {
            console.log(validatedFields.success)
            return { error: "Invalid fields!" };
        }
        const { firstname, email, password } = validatedFields.data;

        const emailCheck = await db.user.findUnique({
            where: {
                email: email
            }
        })
        if (emailCheck) {
            console.log("username already exists");
            return { error: "Username already exists" };
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                firstname: firstname,
                email: email,
                password: hashedPassword
            }
        });
        const token = jwt.sign({ userId: newUser.id, email: newUser.email }, SECRET!, { expiresIn: '1h' });

        console.log("User registered successfully");
        console.log("JWT Token", token)
        return { token }


    } catch (error) {
        console.log(error)
    }

}

export async function loginUser(formData: z.infer<typeof loginFormSchema>) {
    try {
        const validatedFields = loginFormSchema.safeParse(formData);
        if (!validatedFields.success) {
            console.log(validatedFields.success)
            return { error: "Invalid fields!" };
        }

        const { email, password } = validatedFields.data;
        const user = await db.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            // return res.status(400).json({ message: "username already exists." })
            console.log("Incorrect Email or Password");
            return { error: "Incorrect Email or Password" };
        };
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { error: "Incorrect Username or Password" }
        }
        const { firstname, id, email: sanitizeEmail } = user;
        const token = jwt.sign({ userId: id, email: sanitizeEmail }, SECRET!, { expiresIn: '1h' });

        return { accessToken: token, firstname, id, email: sanitizeEmail }



    } catch (error) {

    }
}