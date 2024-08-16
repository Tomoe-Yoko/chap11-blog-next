"use client";

import React from "react";

// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Header } from "@/app/component/Header";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "管理者画面",
//   description: "Next.jsの練習の管理者画面",
// };

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Header />
        <div className="flex pt-14">
          {/* //sidebar */}
          <div className="bg-gray-200 w-64 h-screen pt-12">
            <ul>
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
                  className="font-bold w-ful block px-4 pt-4 mt-6 ml-4"
                >
                  カテゴリー一覧
                </Link>
              </li>
            </ul>
          </div>

          {/* //main_area */}
          <div className="w-5/6 mx-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
