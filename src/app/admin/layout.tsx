"use client";

import React, { use } from "react";

// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Header } from "@/app/component/Header";
import useRouteGuard from "./hooks/useRouteGuard";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  useRouteGuard();
  const pathname = usePathname();
  const isSelected = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <html lang="ja">
      <body className={inter.className}>
        <Header />
        <div className="md:flex md:pt-14 md:items-stretch">
          {/* //sidebar */}
          <div className="md:fixed md:inset-0  bg-gray-200 md:w-64 pt-12 pb-4">
            <ul className="flex md:block">
              <li>
                <Link
                  href="/admin/posts"
                  className="font-bold w-full block px-4 pt-4  mt-4 ml-4"
                >
                  記事一覧
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/categories"
                  className="font-bold w-full block px-4 pt-4 mt-4 md:mt-6 ml-4"
                >
                  カテゴリー一覧
                </Link>
              </li>
            </ul>
          </div>

          {/* //main_area */}
          <div className="w-5/6 md:ml-[20%] md:m-0 m-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
//useRouteGuardで管理者画面へのアクセス制限の実装
