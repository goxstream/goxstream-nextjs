import { LoginForm } from "@/features/admin/components/login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-6 md:p-10">
      <LoginForm />
    </div>
  );
}

