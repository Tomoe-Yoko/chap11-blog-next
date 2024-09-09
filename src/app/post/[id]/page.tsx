"use client";

import React, { useEffect, useState } from "react";
import Apiloading from "@/app/loading";
import Image from "next/image";
import { Post } from "@/app/_types/Post";
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid"; // 固有IDを生成するライブラリ

//params URLから取得する
function Page({ params }: { params: { id: string } }) {
  // const params = useParams();//useParamsを使うときはこの書き方
  // 表示したい記事のIDを指定
  const { id } = params;
  const [post, setPost] = useState<Post | null>(null);

  //////// Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );
  //////ここの書き方（thumbnailImageKey）の取得の仕方がわからない
  const [thumbnailImageKey, setThumbnailImageKey] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();
      //★★★↑必ず型指定明記しておくと後が楽
      setPost(data.post);
      // setLoading(false);
      console.log(data.post);
    };

    fetchPost();
    console.log(fetchPost);
  }, [id]);
  // console.log(post);
  //三項演算子（？）よりも早期リターンを使う！
  useEffect(() => {
    if (!post?.thumbnailImageKey) return;

    // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcherImage = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(post.thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };

    fetcherImage();
    console.log(post);
  }, [post, thumbnailImageKey]);
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
  /////////////////////////

  /////////////////////////
  return (
    <div className="w-9/12 mx-auto my-10 max-w-screen-md  pt-24">
      {/* // 画像の表示 */}
      {thumbnailImageUrl && (
        <Image
          src={thumbnailImageUrl}
          alt={post.title}
          width={800}
          height={500}
          // layout="responsive"
          className="max-h-96 object-cover"
        />
      )}

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
