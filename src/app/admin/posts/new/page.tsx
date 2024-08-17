"use client";

import React from "react";
import { useState, useEffect } from "react";
// import { Post } from "@/app/_types/Post";
import { useRouter } from "next/navigation";
import { Category } from "@/app/_types/Category";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(
    "https://placehold.jp/800x400.png"
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const router = useRouter();

  //カテゴリーを取得
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("/api/admin/categories");
      const data: Category[] = await res.json();
      setCategories(data);
    };
    fetcher();
  });

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //投稿新規作成
    const res = await fetch("/api/admin/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      //JavaScriptのオブジェクトや配列を JSON 形式の文字列に変換する関数です。APIにデータを送るとき、通常は文字列として送信する必要があるため、JavaScriptのオブジェクトを JSON 形式の文字列に変換
      body: JSON.stringify({
        title,
        content,
        thumbnailUrl,
        categoryIds: selectedCategoryIds,
      }),
    });

    // レスポンスから作成した記事のIDを取得
    const { id } = await res.json();
    // 作成した記事の詳細ページに遷移
    router.push(`/admin/posts/${id}`);
    alert("記事を作成しました。");
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedIds = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedIds.push(Number(options[i].value));
      }
    }
    setSelectedCategoryIds(selectedIds);
  };

  return (
    <main className=" w-4/5 mx-auto">
      <div>
        <h1 className="font-bold text-xl p-4 my-4">記事作成</h1>
      </div>
      <form onSubmit={handlePostSubmit} className="w-5/6 mx-auto">
        <div className=" w-full mb-11">
          <label
            htmlFor="title"
            className="mt-4 block w-4/5 text-sm font-medium text-gray-700"
          >
            タイトル
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block min-w-40 w-full rounded-md border border-gray-200 p-3"
          />
        </div>
        <div className="w-full mb-11">
          <label
            htmlFor="content"
            className="mt-4 block w-24 text-sm font-medium text-gray-700"
          >
            内容
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block min-w-40 w-full h-20 rounded-md border border-gray-200 p-3"
          />
        </div>
        <div className="w-full mb-11">
          <label
            htmlFor="content"
            className="mt-4 block w-32 text-sm font-medium text-gray-700"
          >
            サムネイルURL
          </label>
          <input
            type="text"
            id="thumbnailUrl"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="mt-1 block min-w-40 w-full rounded-md border border-gray-200 p-3"
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="categories"
            className="mt-4 block w-24 text-sm font-medium text-gray-700"
          >
            カテゴリー
          </label>
          {/* ・・・・・・・・・・・・・カテゴリーのコードわからん */}
          {/* カテゴリーの選択部分を追加し、複数選択できるように`multiple`属性を設定。
   - handleCategoryChange関数を使って選択されたカテゴリーのIDを管理 */}
          <select
            id="categories"
            multiple
            onChange={handleCategoryChange}
            className="mt-4 block min-w-40 w-full h-20 rounded-md border border-gray-200 p-3"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* //button */}
        <button
          type="submit"
          className="block mt-4 mx-auto py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          作成
        </button>
      </form>
    </main>
  );
};

export default NewPost;
