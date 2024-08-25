"use client";

import React from "react";
import { useState, useEffect } from "react";
// import { Post } from "@/app/_types/Post";
import { useRouter } from "next/navigation";
import { Category } from "@/app/_types/Category";
import PostForm from "../_components/PostForm";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(
    "https://placehold.jp/800x400.png"
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const router = useRouter();

  //カテゴリーを取得
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("/api/admin/categories");
      const { categories }: { categories: Category[] } = await res.json();
      setCategories(categories);
    };
    fetcher();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //投稿新規作成
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      //JavaScriptのオブジェクトや配列を JSON 形式の文字列に変換する関数です。APIにデータを送るとき、通常は文字列として送信する必要があるため、JavaScriptのオブジェクトを JSON 形式の文字列に変換
      body: JSON.stringify({
        title,
        content,
        thumbnailUrl,
        categories: selectedCategories,
      }),
    });

    // レスポンスから作成した記事のIDを取得
    const { id } = await res.json();
    // 作成した記事の詳細ページに遷移
    router.push(`/admin/posts/${id}`);
    alert("記事を作成しました。");
    router.push("/admin/posts");
  };

  // const handleSelectCategory = (category: Category) => {
  //   setSelectedCategories([...selectedCategories, category]);
  // };

  const handleSelectCategory = (category: Category) => {
    const selectedCategoryIds = selectedCategories.map((c) => c.id);
    const isSelected = selectedCategoryIds.includes(category.id);
    if (isSelected) {
      setSelectedCategories(
        selectedCategories.filter((c) => c.id !== category.id)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <main className=" w-4/5 mx-auto">
      <div>
        <h1 className="font-bold text-xl p-4 my-4">記事作成</h1>
      </div>
      <PostForm
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        categories={categories}
        selectedCategories={selectedCategories}
        handleSelectCategory={handleSelectCategory}
        handlePostSubmit={handlePostSubmit}
        mode="new"
      />
    </main>
  );
};

export default NewPost;
