"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
//import { Post } from "@/app/_types/Post";
import { Category } from "@/app/_types/Category";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("/api/admin/categories");
      const { categories } = await res.json();
      setCategories(categories);
    };
    fetcher();
  }, []);

  return (
    <main className="w-5/6 mx-auto">
      <div className="w-full my-4 flex items-center justify-between">
        <h1 className="font-bold text-xl p-4">カテゴリー一覧</h1>
        <button className="mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Link href={"/admin/categories/new"}>新規作成</Link>
        </button>
      </div>

      <div>
        {categories.map((category: Category) => {
          return (
            <>
              <Link
                href={`/admin/categories/${category.id}`}
                key={category.id}
                className="block w-5/6 py-4 mt-4 mx-auto"
              >
                <div className="font-bold">{category.name}</div>
              </Link>
              <hr />
            </>
          );
        })}
      </div>
    </main>
  );
};

export default Categories;
