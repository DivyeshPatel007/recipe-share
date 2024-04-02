"use client";
import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { registerUser } from "@/services/auth";
import { cookies } from "next/headers";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

export const registerFormSchema = z
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
    confirmPassword: z.string().min(8).max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof registerFormSchema>) {
    startTransition(async () => {
      try {
        const { confirmPassword, ...data } = values;
        const response = await registerUser(data);
        console.log(response);
        if (response?.error) {
          toast(response.error);
        }
        if (response?.token) {
          localStorage.setItem("accessToken", response.token);
          router.push("/");
        }
      } catch (error) {
        toast("Cannot register");
      }
    });
    form.reset();
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen  ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border border-slate-200 flex flex-col items-center min-h-[300px] p-4 rounded-md shadow-md"
        >
          <h1 className="text-2xl font-semibold">Register</h1>
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem className="mt-5">
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mt-5">
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mt-5">
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="mt-5">
                <FormControl>
                  <Input
                    placeholder="Confirm password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full mt-5" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default RegisterForm;
