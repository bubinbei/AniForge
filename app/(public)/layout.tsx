import { Header } from "@/components/shared/header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-6xl p-4">{children}</main>
    </div>
  );
}
