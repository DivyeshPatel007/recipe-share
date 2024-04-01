import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

function Register() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen  ">
      <form className="border border-slate-200 flex flex-col items-center min-h-[300px] p-4 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold">Register</h1>
        <div className="mt-10">
          <Input type="text" id="firstName" placeholder="First Name" />
        </div>
        <div className="mt-5">
          <Input type="text" id="userName" placeholder="Username" />
        </div>
        <div className="mt-5">
          <Input type="email" id="email" placeholder="Email" />
        </div>
        <div className="mt-5">
          <Input type="password" id="password" placeholder="Password" />
        </div>
        <div className="mt-5">
          <Input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
          />
        </div>
        <Button className="w-full mt-5">Register</Button>
      </form>
    </div>
  );
}

export default Register;
