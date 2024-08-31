"use client";

import React from "react";
import { useState } from "react";
import { Post } from "@/app/_types/Post";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@/app/hooks/useSupabaseSession";

const NewCategory = () => {
  const { token } = useSupabaseSession();
  const [name, setName] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    //categoryを作成
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ name }),
    });
    const { id } = await res.json();

    router.push(`/admin/categories`);
    alert("カテゴリーを作成しました。");
    console.log("カテゴリー作成しました");
  };
  return (
    <>
      <main className="w-4/5 mx-auto">
        <div>
          <h1 className="font-bold text-xl p-4 my-4">カテゴリー作成</h1>
        </div>
        <form onSubmit={handleSubmit} className="w-5/6 mx-auto">
          <label
            htmlFor="title"
            className="mt-4 block w-24 text-sm font-medium text-gray-700"
          >
            カテゴリー名
          </label>
          <input
            type="text"
            id="title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-4 block w-3/5 min-w-40 rounded-md border border-gray-200 p-3"
          />

          <button
            type="submit"
            className="mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            作成
          </button>
        </form>
      </main>
    </>
  );
};
export default NewCategory;
