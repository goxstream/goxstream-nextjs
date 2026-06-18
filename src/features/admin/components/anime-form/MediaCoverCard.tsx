import * as React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

interface MediaCoverCardProps {
  coverImage: string;
  bannerImage: string;
  loading: boolean;
  fieldErrors: Record<string, string>;
  setCoverImage: (value: string) => void;
  setBannerImage: (value: string) => void;
}

export function MediaCoverCard({
  coverImage,
  bannerImage,
  loading,
  fieldErrors,
  setCoverImage,
  setBannerImage,
}: MediaCoverCardProps) {
  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Media Cover Assets</CardTitle>
        <CardDescription>
          Specify the URLs for images used in the catalogs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="coverImage">Cover Image URL</FieldLabel>
            <Input
              id="coverImage"
              type="url"
              placeholder="e.g. https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-it355ZgzquUd.png"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              disabled={loading}
              required
            />
            {fieldErrors.coverImage && <FieldError>{fieldErrors.coverImage}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="bannerImage">Banner Image URL</FieldLabel>
            <Input
              id="bannerImage"
              type="url"
              placeholder="e.g. https://placehold.co/1920x600/0f172a/f8fafc?text=Solo+Leveling"
              value={bannerImage}
              onChange={(e) => setBannerImage(e.target.value)}
              disabled={loading}
              required
            />
            {fieldErrors.bannerImage && <FieldError>{fieldErrors.bannerImage}</FieldError>}
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
