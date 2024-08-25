"use client";

import React, { useEffect, useState } from "react";
import Apiloading from "@/app/loading";
import Image from "next/image";
import { Post } from "@/app/_types/Post";
import { Category } from "@/app/_types/Category";

//params URLから取得する
function Page({ params }: { params: { id: string } }) {
  // const params = useParams();//useParamsを使うときはこの書き方
  // 表示したい記事のIDを指定
  const { id } = params;
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch("/api/posts");
      const data = await res.json();
      //★★★↑必ず型指定明記しておくと後が楽
      setPost(data);
      // setLoading(false);
      console.log(data.postCategories);
    };

    fetchPost();
    console.log(fetchPost);
  }, [id]);
  // console.log(post);
  //三項演算子（？）よりも早期リターンを使う！

  if (!post) {
    return (
      <div>
        <Apiloading />
      </div>
    );
  }

  // Object.keys(obj).map((key) => {
  //   console.log(key, obj[key]); // keyにはa,b,cが入り、それに対応する値が取得できる
  // });

  return (
    <div className="w-9/12 mx-auto my-10 max-w-screen-md  pt-24">
      <Image
        src={post.thumbnailUrl}
        alt={post.title}
        width={800}
        height={400}
        // layout="responsive"
      />

      <div className="flex  justify-between mt-4">
        <p> {new Date(post.createdAt).toLocaleDateString()}</p>

        <ul className="flex">
          {post.postCategories.map((categories, index) => (
            <li
              key={index}
              className="p-1 m-1 text-blue-700 border border-solid border-blue-700 rounded"
            >
              {categories.category.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">{renderContent(post.content)}</div>
    </div>
  );
}

const renderContent = (content: string) => {
  // パラグラフを <p> タグで分割
  const paragraphs = content.split("</p>");
  // 各パラグラフを <p> タグで囲んでレンダリング
  return paragraphs.map((paragraph: string, index: number) => {
    // 空のパラグラフを除外
    if (paragraph.trim() === "") return null;
    // パラグラフの前後に <p> タグを追加
    return <p key={index}>{paragraph.replace("<p>", "").trim()}</p>;
  });
};

export default Page;
