"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClientAdmin } from "@/lib/auth/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const params = useParams();
  const router = useRouter();
  const adminSegment = params.adminSegment as string;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClientAdmin.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Failed to authenticate");
      } else {
        toast.success("Welcome back, Administrator");
        router.push(`/${adminSegment}`);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-sm", className)} {...props}>
      <Card>
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent border border-border text-foreground">
              <Shield className="h-5 w-5" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">GoxStream Console</CardTitle>
          <CardDescription className="text-sm">
            Secure administrative backstage access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Admin Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@goxstream.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Console Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Spinner className="h-4 w-4" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    "Enter Backstage"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
