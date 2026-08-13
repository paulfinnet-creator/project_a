import { Suspense } from "react";
import { AuthLayout } from "@/components/auth-layout";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Log in to manage your bookings.">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
