"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Category } from "@/app/_types/Category";
import PostForm from "../_components/PostForm";
import { useSupabaseSession } from "@/app/hooks/useSupabaseSession";
import { log } from "console";

const PostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const { id } = useParams();
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const { token } = useSupabaseSession(); //token追加

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    //記事更新　画像をアップロードしてthumbnailImageKeyを保存する処理
    await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json", Authorization: token },
      body: JSON.stringify({
        title,
        content,
        thumbnailImageKey,
        categories: selectedCategories,
      }),
    });
    alert("記事を更新しました。");
    router.push("/admin/posts");
  };

  //記事削除
  const handleDeletePost = async () => {
    if (!confirm("記事を削除しますか？")) return;
    if (!token) return;
    await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: token },
    });
    alert("記事を削除しました。");
    router.push("/admin/posts");
  };

  //記事更新：画像をアップロード及びthumbnailImageKeyを保存した後の記事取得
  useEffect(() => {
    if (!token) return;
    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      // const data = await res.json();
      // console.log(data);

      const { post } = await res.json();
      setTitle(post.title);
      setContent(post.content);
      setThumbnailImageKey(post.thumbnailImageKey);

      // カテゴリーの状態を更新↓
      const postCategories = post.postCategories;
      // 中間テーブルをはさんでいる。console.logで何がはいっているか確認し、設定
      // ・・post.postCategoriesの中のカテゴリーオブジェクトを取ってきている。

      console.log(post);
      console.log(postCategories);
      console.log(post.thumbnailImageKey);
      const categories: Category[] = postCategories.map(
        (pc: { category: Category }) => pc.category
      );
      setSelectedCategories(categories);

      //   setSelectedCategories(post.postCategories.map((pc: Category) => pc
      // ));
    };
    fetcher();
  }, [id, token]);

  //カテゴリーを取得
  //  useEffect(()=>{});
  useEffect(() => {
    if (!token) return;
    const fetcher = async () => {
      const res = await fetch("/api/admin/categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const { categories }: { categories: Category[] } = await res.json();
      setCategories(categories);
    };
    fetcher();
  }, [token]);

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
        thumbnailImageKey={thumbnailImageKey} // サムネイルURLの状態
        setThumbnailImageKey={setThumbnailImageKey} // サムネイルURLを更新する関数
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
