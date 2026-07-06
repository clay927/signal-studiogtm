import { Sidebar } from "@/components/shell/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <div className="sticky top-0 h-dvh">
        <Sidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-6 py-6">
          <div className="mx-auto w-full max-w-[1080px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
