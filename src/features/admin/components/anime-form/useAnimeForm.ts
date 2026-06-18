"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAnimeAction } from "@/modules/anime/actions/createAnimeAction";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function useAnimeForm(adminSegment: string) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [isSlugTouched, setIsSlugTouched] = React.useState(false);
  
  const [coverImage, setCoverImage] = React.useState("");
  const [bannerImage, setBannerImage] = React.useState("");
  const [synopsis, setSynopsis] = React.useState("");
  const [year, setYear] = React.useState("");
  const [quarter, setQuarter] = React.useState<string>("Winter");
  const [status, setStatus] = React.useState<string>("Ongoing");
  const [episodeCount, setEpisodeCount] = React.useState("");
  const [rating, setRating] = React.useState("");
  const [popularity, setPopularity] = React.useState("");
  const [selectedGenreIds, setSelectedGenreIds] = React.useState<string[]>([]);
  
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    if (!isSlugTouched) {
      setSlug(generateSlug(value));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsSlugTouched(true);
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
  };

  const toggleGenre = (genreId: string) => {
    setSelectedGenreIds((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    const payload = {
      title,
      slug,
      coverImage,
      bannerImage,
      synopsis: synopsis || null,
      year: year ? parseInt(year, 10) : null,
      quarter: quarter || null,
      status: status || null,
      episodeCount: episodeCount ? parseInt(episodeCount, 10) : null,
      rating: rating ? parseFloat(rating) : null,
      popularity: popularity ? parseInt(popularity, 10) : 0,
      genreIds: selectedGenreIds,
    };

    try {
      const result = await createAnimeAction(payload);
      if (!result.success) {
        if (result.errors) {
          setFieldErrors(result.errors);
          toast.error("Please resolve the validation errors");
        } else if (result.error) {
          toast.error(result.error);
        } else {
          toast.error("Failed to register anime");
        }
      } else {
        toast.success("Anime registered successfully");
        router.push(`/${adminSegment}/anime`);
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    title,
    slug,
    coverImage,
    bannerImage,
    synopsis,
    year,
    quarter,
    status,
    episodeCount,
    rating,
    popularity,
    selectedGenreIds,
    fieldErrors,
    setTitle,
    setSlug,
    setCoverImage,
    setBannerImage,
    setSynopsis,
    setYear,
    setQuarter,
    setStatus,
    setEpisodeCount,
    setRating,
    setPopularity,
    handleTitleChange,
    handleSlugChange,
    toggleGenre,
    handleSubmit,
  };
}
