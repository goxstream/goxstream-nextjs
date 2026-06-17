"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClientAdmin } from "@/lib/auth/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Shield } from "lucide-react";

export function LoginForm() {
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
    <div className="w-full max-w-md space-y-6">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-950/50 border border-red-500/35 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
          <Shield className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">GoxStream Console</h1>
        <p className="text-sm text-neutral-400">
          Secure administrative backstage access
        </p>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-neutral-300 text-sm font-medium">
              Admin Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@goxstream.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus:border-red-500/50 focus:ring-red-500/20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-neutral-300 text-sm font-medium">
              Console Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus:border-red-500/50 focus:ring-red-500/20"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-2 rounded-md transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Spinner className="h-4 w-4 text-white" />
                <span>Authenticating...</span>
              </>
            ) : (
              "Enter Backstage"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
