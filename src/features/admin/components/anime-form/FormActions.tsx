import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface FormActionsProps {
  loading: boolean;
  adminSegment: string;
}

export function FormActions({ loading, adminSegment }: FormActionsProps) {
  return (
    <div className="flex flex-col gap-2 pt-2">
      <Button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <>
            <Spinner className="h-4 w-4" />
            <span>Registering...</span>
          </>
        ) : (
          "Save Anime Title"
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        asChild
        disabled={loading}
        className="w-full cursor-pointer"
      >
        <Link href={`/${adminSegment}/anime`}>Cancel</Link>
      </Button>
    </div>
  );
}
