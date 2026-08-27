import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminConfigured, isAuthenticated } from "@/lib/admin/auth";
import { loginAction } from "@/lib/admin/auth-actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "管理ログイン — RIO LAB",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  const { error } = await searchParams;
  const configured = isAdminConfigured();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">管理ログイン</h1>

      {!configured ? (
        <p className="text-sm text-foreground/70">
          <code className="font-mono text-foreground">.env.local</code> に{" "}
          <code className="font-mono text-foreground">ADMIN_PASSWORD</code> と{" "}
          <code className="font-mono text-foreground">
            ADMIN_SESSION_SECRET
          </code>{" "}
          を設定し、
          <code className="font-mono text-foreground">next dev</code>{" "}
          を再起動してください。
        </p>
      ) : null}

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <form action={loginAction} className="flex max-w-sm flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-foreground/70">パスワード</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="border border-foreground/20 bg-transparent px-3 py-2 text-foreground"
          />
        </label>
        <button
          type="submit"
          className="border border-foreground bg-foreground px-4 py-2 text-sm text-background hover:opacity-90"
        >
          ログイン
        </button>
      </form>
    </div>
  );
}
