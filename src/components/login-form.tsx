"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

function LoginForm() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen  ">
      <form className="border border-slate-200 flex flex-col items-center h-[300px] p-4 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold">Login</h1>
        <div className="mt-10">
          <Input type="email" id="email" placeholder="Email" />
        </div>
        <div className="mt-5">
          <Input type="password" id="password" placeholder="Password" />
        </div>
        <Button className="w-full mt-5">Login</Button>
      </form>
    </div>
  );
}

export default LoginForm;
