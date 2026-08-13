"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { registerAction, type RegisterFormState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth-layout";

const initialState: RegisterFormState = {};

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success("Account created! Please log in.");
      router.push("/login");
    }
  }, [state.success, router]);

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Register to book tours and manage your trips."
    >
      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" placeholder="Ada Okafor" required />
          {state.fieldErrors?.name && (
            <p className="text-sm text-destructive">{state.fieldErrors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          {state.fieldErrors?.email && (
            <p className="text-sm text-destructive">{state.fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone number (optional)</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+1 555 000 0000" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
          {state.fieldErrors?.password && (
            <p className="text-sm text-destructive">{state.fieldErrors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required />
          {state.fieldErrors?.confirmPassword && (
            <p className="text-sm text-destructive">{state.fieldErrors.confirmPassword}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
