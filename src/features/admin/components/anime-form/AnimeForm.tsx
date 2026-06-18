"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AdminGenreRow } from "@/modules/anime/dto/adminAnime";

import { useAnimeForm } from "./useAnimeForm";
import { GeneralInfoCard } from "./GeneralInfoCard";
import { MediaCoverCard } from "./MediaCoverCard";
import { GenrePickerCard } from "./GenrePickerCard";
import { MetadataCard } from "./MetadataCard";
import { AssetPreviewsCard } from "./AssetPreviewsCard";
import { FormActions } from "./FormActions";

interface AnimeFormProps {
  genres: AdminGenreRow[];
  adminSegment: string;
}

export function AnimeForm({ genres, adminSegment }: AnimeFormProps) {
  const form = useAnimeForm(adminSegment);

  return (
    <form onSubmit={form.handleSubmit} className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm" className="cursor-pointer">
          <Link href={`/${adminSegment}/anime`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <GeneralInfoCard
            title={form.title}
            slug={form.slug}
            synopsis={form.synopsis}
            loading={form.loading}
            fieldErrors={form.fieldErrors}
            handleTitleChange={form.handleTitleChange}
            handleSlugChange={form.handleSlugChange}
            setSynopsis={form.setSynopsis}
          />

          <MediaCoverCard
            coverImage={form.coverImage}
            bannerImage={form.bannerImage}
            loading={form.loading}
            fieldErrors={form.fieldErrors}
            setCoverImage={form.setCoverImage}
            setBannerImage={form.setBannerImage}
          />

          <GenrePickerCard
            genres={genres}
            selectedGenreIds={form.selectedGenreIds}
            loading={form.loading}
            toggleGenre={form.toggleGenre}
          />
        </div>

        {/* Right Column - Metadata inputs & Asset Previews */}
        <div className="space-y-6">
          <MetadataCard
            year={form.year}
            quarter={form.quarter}
            status={form.status}
            episodeCount={form.episodeCount}
            rating={form.rating}
            popularity={form.popularity}
            loading={form.loading}
            fieldErrors={form.fieldErrors}
            setYear={form.setYear}
            setQuarter={form.setQuarter}
            setStatus={form.setStatus}
            setEpisodeCount={form.setEpisodeCount}
            setRating={form.setRating}
            setPopularity={form.setPopularity}
          />

          <AssetPreviewsCard
            coverImage={form.coverImage}
            bannerImage={form.bannerImage}
          />

          <FormActions
            loading={form.loading}
            adminSegment={adminSegment}
          />
        </div>
      </div>
    </form>
  );
}
