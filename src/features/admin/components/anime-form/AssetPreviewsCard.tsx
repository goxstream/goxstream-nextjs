import * as React from "react";
import { Image as ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AssetPreviewsCardProps {
  coverImage: string;
  bannerImage: string;
}

export function AssetPreviewsCard({ coverImage, bannerImage }: AssetPreviewsCardProps) {
  return (
    <Card className="border border-border bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-border">
        <CardTitle className="text-base font-medium">Asset Previews</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Cover Image Preview</Label>
          <div className="relative aspect-[2/3] w-36 rounded-lg border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center overflow-hidden">
            {coverImage && coverImage.startsWith("http") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImage}
                alt="Cover Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="text-center p-2 text-muted-foreground">
                <ImageIcon className="h-6 w-6 mx-auto mb-1 opacity-40" />
                <span className="text-xs">No Cover Image</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Banner Image Preview</Label>
          <div className="relative aspect-[21/9] w-full rounded-lg border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center overflow-hidden">
            {bannerImage && bannerImage.startsWith("http") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bannerImage}
                alt="Banner Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="text-center p-2 text-muted-foreground">
                <ImageIcon className="h-6 w-6 mx-auto mb-1 opacity-40" />
                <span className="text-xs">No Banner Image</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
