import type { ReactNode } from "react";
import Link from "next/link";
import { isAuthenticated } from "@/lib/admin/auth";
import { logoutAction } from "@/lib/admin/auth-actions";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const authed = await isAuthenticated();

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-1 flex-col px-6 py-10">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-foreground/10 pb-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/admin" className="font-medium text-foreground">
            管理画面
          </Link>
          <Link href="/" className="text-foreground/60 hover:text-foreground">
            サイトを見る
          </Link>
        </div>
        {authed ? (
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-foreground/60 hover:text-foreground"
            >
              ログアウト
            </button>
          </form>
        ) : null}
      </header>
      {children}
    </div>
  );
}
