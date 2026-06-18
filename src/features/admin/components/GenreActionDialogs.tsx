"use client";

import * as React from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGenreAction, renameGenreAction, deleteGenreAction } from "@/app/(admin)/[adminSegment]/(dashboard)/anime/genres/actions";
import type { AdminGenreRow } from "@/modules/anime/dto/adminAnime";

interface GenreActionDialogsProps {
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
  renameGenre: AdminGenreRow | null;
  onRenameClose: () => void;
  deleteGenre: AdminGenreRow | null;
  onDeleteClose: () => void;
}

export function GenreActionDialogs({
  createOpen,
  onCreateOpenChange,
  renameGenre,
  onRenameClose,
  deleteGenre,
  onDeleteClose,
}: GenreActionDialogsProps) {
  const [loading, setLoading] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [renameName, setRenameName] = React.useState("");

  // Set initial rename name when the genre changes
  React.useEffect(() => {
    if (renameGenre) {
      setRenameName(renameGenre.name);
    } else {
      setRenameName("");
    }
  }, [renameGenre]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);
    try {
      await createGenreAction(newName);
      toast.success("Genre created successfully");
      setNewName("");
      onCreateOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create genre");
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameGenre || !renameName.trim()) return;
    setLoading(true);
    try {
      await renameGenreAction(renameGenre.id, renameName);
      toast.success("Genre renamed successfully");
      onRenameClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to rename genre");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteGenre) return;
    setLoading(true);
    try {
      await deleteGenreAction(deleteGenre.id);
      toast.success("Genre deleted successfully");
      onDeleteClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete genre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={onCreateOpenChange}>
        <DialogContent>
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Add New Genre</DialogTitle>
              <DialogDescription>
                Create a new genre tag for anime titles.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
              <Label htmlFor="name">Genre Name</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Action, Fantasy"
                disabled={loading}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onCreateOpenChange(false)} disabled={loading} className="cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="cursor-pointer">
                {loading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={!!renameGenre} onOpenChange={(open) => !open && onRenameClose()}>
        <DialogContent>
          <form onSubmit={handleRename}>
            <DialogHeader>
              <DialogTitle>Rename Genre</DialogTitle>
              <DialogDescription>
                Change the name of this genre. Associated anime links will be preserved.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
              <Label htmlFor="renameName">Genre Name</Label>
              <Input
                id="renameName"
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
                placeholder="e.g. Action, Fantasy"
                disabled={loading}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onRenameClose} disabled={loading} className="cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="cursor-pointer">
                {loading ? "Renaming..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteGenre} onOpenChange={(open) => !open && onDeleteClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Genre</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the genre <span className="font-semibold text-foreground">"{deleteGenre?.name}"</span>?
              This action will remove the genre tag from all <span className="font-semibold text-foreground">{deleteGenre?.animeCount}</span> associated anime titles. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onDeleteClose} disabled={loading} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading} className="cursor-pointer">
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
