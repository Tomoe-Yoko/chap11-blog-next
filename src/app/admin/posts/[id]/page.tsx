"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Category } from "@/app/_types/Category";
import PostForm from "../_components/PostForm";

const PostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const { id } = useParams();
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //記事更新
    await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        thumbnailUrl,
        categories: selectedCategories,
      }),
    });
    alert("記事を更新しました。");
    router.push("/admin/posts");
  };

  //記事削除
  const handleDeletePost = async () => {
    if (!confirm("記事を削除しますか？")) return;
    await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
    });
    alert("記事を削除しました。");
    router.push("/admin/posts");
  };

  //記事を取得
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`);
      // const data = await res.json();
      // console.log(data);

      const { post } = await res.json();
      setTitle(post.title);
      setContent(post.content);
      setThumbnailUrl(post.thumbnailUrl);

      // カテゴリーの状態を更新↓
      const postCategories = post.postCategories;
      // 中間テーブルをはさんでいる。console.logで何がはいっているか確認し、設定
      // ・・post.postCategoriesの中のカテゴリーオブジェクトを取ってきている。

      console.log(post);
      console.log(postCategories);
      const categories: Category[] = postCategories.map(
        (pc: { category: Category }) => pc.category
      );
      setSelectedCategories(categories);

      //   setSelectedCategories(post.postCategories.map((pc: Category) => pc
      // ));
    };
    fetcher();
  }, [id]);

  //カテゴリーを取得
  //  useEffect(()=>{});
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("/api/admin/categories");
      const { categories }: { categories: Category[] } = await res.json();
      setCategories(categories);
    };
    fetcher();
  }, []);

  // const handleSelectCategory = (category: Category) => {
  //   setSelectedCategories([...selectedCategories, category]);
  // };
  // console.log(selectedCategories);

  const handleSelectCategory = (category: Category) => {
    if (selectedCategories.map((c) => c.id).includes(category.id)) {
      setSelectedCategories(
        selectedCategories.filter((c) => c.id !== category.id)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  console.log(handleSelectCategory);

  return (
    <main className="w-4/5 mx-auto">
      <div>
        <h1 className="font-bold text-xl p-4 my-4">記事更新</h1>
      </div>

      <PostForm
        title={title} // タイトルの状態
        setTitle={setTitle} // タイトルを更新する関数
        content={content} // 内容の状態
        setContent={setContent} // 内容を更新する関数
        thumbnailUrl={thumbnailUrl} // サムネイルURLの状態
        setThumbnailUrl={setThumbnailUrl} // サムネイルURLを更新する関数
        categories={categories} // カテゴリーのリスト
        selectedCategories={selectedCategories} // 選択されたカテゴリーのリスト
        handleSelectCategory={handleSelectCategory} // カテゴリーを選択/解除する処理
        handlePostSubmit={handlePostSubmit} // フォーム送信時の処理
        handleDeletePost={handleDeletePost} // 記事削除の処理
        mode="edit"
      />
      {/*  PostPage で定義された状態や関数を PostForm にプロパティとして渡すことで、PostForm コンポーネント内でこれらの状態や関数を使用できる。
 このようにすることで、PostForm コンポーネント内でユーザーが入力した内容がリアルタイムで親コンポーネントの状態に反映され、フォームの送信や記事の削除が正常に動作する */}
    </main>
  );
};

export default PostPage;
