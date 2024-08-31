"use client";
import React from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { useSupabaseSession } from "../hooks/useSupabaseSession";

export const Header: React.FC = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };
  const { session, isLoading } = useSupabaseSession();
  return (
    <header className="py-4 px-12 bg-gray-900 text-white flex justify-between items-center fixed top-0 left-0 w-full">
      <h1>
        <Link href="/">Blog</Link>
      </h1>
      {!isLoading && (
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/admin/posts"> 管理画面</Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link href="/contact">お問合せ</Link>
              <Link href="/login">ログイン</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
