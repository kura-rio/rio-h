"use server";

import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  isAdminConfigured,
  verifyPassword,
} from "@/lib/admin/auth";

export async function loginAction(formData: FormData): Promise<void> {
  if (!isAdminConfigured()) {
    redirect(
      `/admin/login?error=${encodeURIComponent(
        "管理画面が未設定です。.env.local に ADMIN_PASSWORD と ADMIN_SESSION_SECRET を設定してください。",
      )}`,
    );
  }

  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    redirect(
      `/admin/login?error=${encodeURIComponent("パスワードが正しくありません。")}`,
    );
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}
