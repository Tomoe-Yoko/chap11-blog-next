"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CategoryId = () => {
  const [name, setName] = useState("");
  const { id } = useParams();
  const router = useRouter();

  // ///input状態の更新
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`api/admin/categories/${id}`);
      const { category } = await res.json();
      setName(category.name);
    };
    fetcher();
  }, [id]);

  // ///カテゴリー更新ボタン
  const handlePutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //fetch 関数で、サーバーのAPIエンドポイントにPUTリクエストを送り、カテゴリー名を更新
    await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    alert("カテゴリーを更新しました");
    router.push("/admin/categories");
  };

  // ///削除ボタン
  const handleDeleteCategory = async () => {
    if (!confirm("カテゴリーを削除しますか？")) return;
    await fetch(`api/admin/categories/${id}`, {
      method: "DELETE",
    });
    alert("カテゴリーを削除しました。");
    router.push("/admin/categories");
  };

  return (
    <main className="w-4/5 mx-auto">
      <div>
        <h1 className="font-bold text-xl p-4 my-4">カテゴリー作成</h1>
      </div>
      <form onSubmit={handlePutSubmit} className="w-5/6 mx-auto">
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
          // onClick={handlePutSubmit}
          type="submit"
          className="mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          更新
        </button>
        <button
          onClick={handleDeleteCategory}
          type="button"
          className="mt-4 ml-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          削除
        </button>
      </form>
    </main>
  );
};

export default CategoryId;
