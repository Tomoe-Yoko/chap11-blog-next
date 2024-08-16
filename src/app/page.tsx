"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Post } from "./_types/Post";

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // 非同期関数を定義
    const fetchData = async () => {
      const response = await fetch("/api/v1/posts");
      const { contents } = await response.json();
      setPosts(contents);
    };

    // 非同期関数を呼び出す
    fetchData();
  }, []);

  return (
    <main className="pt-14">
      <ul>
        {posts.map((post) => (
          <li
            key={post.id}
            className="w-2/4 my-12 mx-auto p-8 outline outline-1"
          >
            <Link href={`/post/${post.id}`}>
              {/* //URL */}
              <div className="flex justify-between items-center">
                <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                <div className="flex justify-between items-center">
                  {post.postCategories.map((category, index) => (
                    <div
                      key={index}
                      className="text-sm p-1 text-blue-700 border border-solid border-1 border-blue-700 rounded-md mx-1"
                    >
                      {category.category.name}
                    </div>
                  ))}
                </div>
              </div>
              <h2 className="font-bold">{post.title}</h2>
              <div>{renderContent(post.content)}</div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};
export default Home;

////renderContent関数
//1. HTMLタグを削除してテキストのみを抽出する
const stripPTags = (p: string): string => {
  const tempP = document.createElement("p");
  tempP.innerHTML = p;
  return tempP.textContent || tempP.innerText || "";
};
// 2. 抽出したテキストを指定された長さにトリミング
const truncateText = (text: string): string => {
  if (text.length <= 24) {
    return text;
  }
  return text.slice(0, 24) + "…";
};
//3. 最終的なレンダリング
const renderContent = (content: string): string => {
  // HTMLタグを削除してテキストを抽出
  const cleanContent = stripPTags(content);

  // 抽出したテキストをトリミング
  const truncatedContent = truncateText(cleanContent);

  return truncatedContent;
};
