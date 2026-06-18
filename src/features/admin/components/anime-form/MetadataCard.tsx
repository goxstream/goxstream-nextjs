import * as React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface MetadataCardProps {
  year: string;
  quarter: string;
  status: string;
  episodeCount: string;
  rating: string;
  popularity: string;
  loading: boolean;
  fieldErrors: Record<string, string>;
  setYear: (value: string) => void;
  setQuarter: (value: string) => void;
  setStatus: (value: string) => void;
  setEpisodeCount: (value: string) => void;
  setRating: (value: string) => void;
  setPopularity: (value: string) => void;
}

export function MetadataCard({
  year,
  quarter,
  status,
  episodeCount,
  rating,
  popularity,
  loading,
  fieldErrors,
  setYear,
  setQuarter,
  setStatus,
  setEpisodeCount,
  setRating,
  setPopularity,
}: MetadataCardProps) {
  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Metadata & Ratings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="year">Release Year</FieldLabel>
              <Input
                id="year"
                type="number"
                min="1900"
                max="2100"
                placeholder="e.g. 2024"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={loading}
              />
              {fieldErrors.year && <FieldError>{fieldErrors.year}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="quarter">Season Quarter</FieldLabel>
              <Select value={quarter} onValueChange={setQuarter} disabled={loading}>
                <SelectTrigger id="quarter" className="w-full">
                  <SelectValue placeholder="Select quarter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Winter">Winter</SelectItem>
                  <SelectItem value="Spring">Spring</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                  <SelectItem value="Fall">Fall</SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors.quarter && <FieldError>{fieldErrors.quarter}</FieldError>}
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="status">Release Status</FieldLabel>
              <Select value={status} onValueChange={setStatus} disabled={loading}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors.status && <FieldError>{fieldErrors.status}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="episodeCount">Episodes</FieldLabel>
              <Input
                id="episodeCount"
                type="number"
                min="0"
                placeholder="e.g. 12"
                value={episodeCount}
                onChange={(e) => setEpisodeCount(e.target.value)}
                disabled={loading}
              />
              {fieldErrors.episodeCount && <FieldError>{fieldErrors.episodeCount}</FieldError>}
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="rating">Rating (0-10)</FieldLabel>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="10"
                placeholder="e.g. 8.5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                disabled={loading}
              />
              {fieldErrors.rating && <FieldError>{fieldErrors.rating}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="popularity">Popularity</FieldLabel>
              <Input
                id="popularity"
                type="number"
                min="0"
                placeholder="e.g. 150000"
                value={popularity}
                onChange={(e) => setPopularity(e.target.value)}
                disabled={loading}
              />
              {fieldErrors.popularity && <FieldError>{fieldErrors.popularity}</FieldError>}
            </Field>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
