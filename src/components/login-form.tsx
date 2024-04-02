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
import { loginUser, registerUser } from "@/services/auth";
import { cookies } from "next/headers";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    startTransition(async () => {
      try {
        // const { confirmPassword, ...data } = values;

        const response = await loginUser(values);
        console.log(response);
        if (response?.error) {
          toast(response.error);
        }
        if (response?.accessToken) {
          localStorage.setItem("accessToken", response.accessToken);
          router.push("/");
        }
      } catch (error) {
        toast.error("Cannot register");
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
          <h1 className="text-2xl font-semibold">Login</h1>

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

          <Button className="w-full mt-5" type="submit">
            Login
          </Button>
          <span
            className="cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Register
          </span>
        </form>
      </Form>
    </div>
  );
}

export default LoginForm;
