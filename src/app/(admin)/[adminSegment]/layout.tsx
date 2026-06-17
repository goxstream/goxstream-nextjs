import { notFound } from "next/navigation";

interface AdminParentLayoutProps {
  children: React.ReactNode;
  params: Promise<{ adminSegment?: string }>;
}

export default async function AdminParentLayout({
  children,
  params,
}: AdminParentLayoutProps) {
  const { adminSegment } = await params;
  const expectedSlug = process.env.GOX_ADMIN_SLUG;

  if (!expectedSlug || !adminSegment || adminSegment !== expectedSlug) {
    notFound();
  }

  return <>{children}</>;
}
