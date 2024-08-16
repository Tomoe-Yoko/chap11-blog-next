//管理者記事一覧ページ
"use client";
import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Post } from "@/app/_types/Post";

const Page = () => {
  const [posts, setPost] = useState<Post[]>([]);

  // useEffect(() => {
  //   const fetcher = () => {};
  // });
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("/api/admin/posts");
      const { posts } = await res.json();
      setPost(posts);
    };
    fetcher();
  }, []);

  return (
    <main className="w-5/6 mx-auto">
      <div className="w-full my-4 flex items-center justify-between">
        <h1 className="font-bold text-xl p-4">記事一覧</h1>
        <button className="mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Link href={"/admin/posts/new"}>新規作成</Link>
        </button>
      </div>

      <ul className="w-5/6 mx-auto my-4">
        {posts.map(({ id, title, createdAt }) => (
          <li key={id} className="p-4 my-4">
            <Link href={`/admin/posts/${id}`}>
              <div className="font-bold text-xl">{title}</div>
              <div>{new Date(createdAt).toLocaleDateString()}</div>
            </Link>
            <hr />
          </li>
        ))}
      </ul>
    </main>
  );
};
export default Page;
// useState: posts という状態を管理し、その初期値を空の配列に設定しています。Post[] は TypeScript の型注釈で、posts が Post 型の配列であることを示しています。

// useEffect: コンポーネントが初めてレンダリングされた時に、/api/admin/posts から記事データを取得します。このデータを posts に保存し、ページ内で利用できるようにします。

// map 関数: 取得した posts の配列をループし、各 id に基づいて記事のタイトルと作成日を表示します。createdAt は new Date() を使って日付形式に変換しています。

// Link コンポーネント: 各記事のタイトルがクリック可能になり、/admin/posts/[id] に遷移します。このリンクは next/link を使用しているため、クライアントサイドのナビゲーションが可能です。
