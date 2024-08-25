import React from "react";
import { PostFormProps } from "../_types/PostFormProps";

const PostForm: React.FC<PostFormProps> = ({
  title,
  setTitle,
  content,
  setContent,
  thumbnailUrl,
  setThumbnailUrl,
  categories,
  selectedCategories,
  handleSelectCategory,
  handlePostSubmit,
  handleDeletePost,
  mode,
}) => {
  return (
    <div>
      <form onSubmit={handlePostSubmit} className="w-5/6 mx-auto">
        <div>
          <label
            htmlFor="title"
            className="mt-4 block w-24 text-sm font-medium text-gray-700"
          >
            タイトル名
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-4 block w-5/6 min-w-40 rounded-md border border-gray-200 p-3"
          />
        </div>
        <div>
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
            className="mt-4 block w-5/6 min-w-40 h-22 rounded-md border border-gray-200 p-3"
          />
        </div>
        <div>
          <label
            htmlFor="thumbnailUrl"
            className="mt-4 block w-32 text-sm font-medium text-gray-700"
          >
            サムネイルURL
          </label>
          <input
            type="text"
            id="thumbnailUrl"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="mt-4 block w-5/6 min-w-40 rounded-md border border-gray-200 p-3"
          />
        </div>

        {/* //カテゴリー */}
        <div>
          <label
            htmlFor="categories"
            className="mt-4 block w-32 text-sm font-medium text-gray-700"
          >
            カテゴリー
          </label>
          <div className="flex flex-row-reverse justify-end">
            {categories.map((category) => {
              const isSelected = selectedCategories
                //selectedCategories配列の中の一つのid
                .map((c) => c.id)
                //さらにcategory.idが含まれているもの
                .includes(category.id);
              return (
                <div
                  key={category.id}
                  onClick={() => handleSelectCategory(category)}
                  className={`${
                    isSelected ? "bg-blue-500" : ""
                  } border border-blue-500 w-fit p-1 rounded-md text-xs my-4 mr-4 `}
                >
                  {category.name}
                </div>
              );
            })}
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {/* 更新 */}
          {mode === "new" ? "作成" : "更新"}
        </button>
        {mode === "edit" && (
          <button
            onClick={handleDeletePost}
            type="button"
            className="mt-4 ml-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            削除
          </button>
        )}
      </form>
    </div>
  );
};

export default PostForm;
