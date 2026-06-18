import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";

interface GeneralInfoCardProps {
  title: string;
  slug: string;
  synopsis: string;
  loading: boolean;
  fieldErrors: Record<string, string>;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSynopsis: (value: string) => void;
}

export function GeneralInfoCard({
  title,
  slug,
  synopsis,
  loading,
  fieldErrors,
  handleTitleChange,
  handleSlugChange,
  setSynopsis,
}: GeneralInfoCardProps) {
  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">General Information</CardTitle>
        <CardDescription>
          Provide the core details of the anime series.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Anime Title</FieldLabel>
            <Input
              id="title"
              type="text"
              placeholder="e.g. Solo Leveling"
              value={title}
              onChange={handleTitleChange}
              disabled={loading}
              required
            />
            {fieldErrors.title && <FieldError>{fieldErrors.title}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="slug">Custom Slug</FieldLabel>
            <Input
              id="slug"
              type="text"
              placeholder="e.g. solo-leveling"
              value={slug}
              onChange={handleSlugChange}
              disabled={loading}
              required
            />
            <FieldDescription>
              The clean URL slug used to identify this anime title.
            </FieldDescription>
            {fieldErrors.slug && <FieldError>{fieldErrors.slug}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="synopsis">Synopsis</FieldLabel>
            <Textarea
              id="synopsis"
              placeholder="Provide a detailed synopsis or summary of the anime plot..."
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              disabled={loading}
              className="min-h-32"
            />
            {fieldErrors.synopsis && <FieldError>{fieldErrors.synopsis}</FieldError>}
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
