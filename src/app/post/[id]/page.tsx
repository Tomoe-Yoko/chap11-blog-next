"use client";

import React, { useEffect, useState } from "react";
import Apiloading from "@/app/loading";
import Image from "next/image";

interface PagePost {
  thumbnailUrl: string;
  title: string;
  createdAt: string;
  categories: string[];
  content: string;
}
//params URLから取得する
function Page({ params }: { params: { id: string } }) {
  // const params = useParams();//useParamsを使うときはこの書き方
  // 表示したい記事のIDを指定

  const [post, setPost] = useState<PagePost | null>(null);

  useEffect(() => {
    const fetchPost = async (id: string): Promise<void> => {
      const response = await fetch(
        `https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${params.id}`
      );

      const data = await response.json();
      setPost(data.post);
    };

    fetchPost(params.id as string);
  }, [params.id]);
  // console.log(post);
  //三項演算子（？）よりも早期リターンを使う！
  if (!post) {
    return (
      <div>
        <Apiloading />
      </div>
    );
  }
  return (
    <div className="w-9/12 mx-auto my-10 max-w-screen-md">
      <Image
        src={post.thumbnailUrl}
        alt={post.title}
        width={800}
        height={400}
      />

      <div className="flex  justify-between mt-4">
        <p> {new Date(post.createdAt).toLocaleDateString()}</p>

        <ul className="flex">
          {post.categories.map((category: string, index: number) => (
            <li
              key={index}
              className="p-1 m-1 text-blue-700 border border-solid border-blue-700 rounded"
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">{renderContent(post.content)}</div>
    </div>
  );
}

const renderContent = (content: string) => {
  const paragraphs = content.split("<br/>");
  return paragraphs.map((paragraph: string, index: number) => (
    <p key={index}>{paragraph}</p>
  ));
};

export default Page;
