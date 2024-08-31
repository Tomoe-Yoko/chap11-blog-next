import React, { ChangeEvent, useState } from "react";
import { Category } from "@/app/_types/Category";
//import { PostFormProps } from "../_types/PostFormProps";
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid"; // 固有IDを生成するライブラリ

interface PostFormProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  thumbnailUrl: string;
  setThumbnailUrl: React.Dispatch<React.SetStateAction<string>>;
  categories: Category[]; //記事に関連付けられる可能性があるカテゴリのリスト（配列）
  selectedCategories: Category[]; //記事に現在選択されているカテゴリのリスト（配列）
  handleSelectCategory: (category: Category) => void;
  handlePostSubmit: (e: React.FormEvent) => void;
  handleDeletePost?: () => void;
  mode: "new" | "edit";
}

//handleImageChangeのロジック部分
const [thumbnailUrlKey, setThumbnailUrlKey] = useState("");
const handleImageChange = async (
  event: ChangeEvent<HTMLInputElement>
): Promise<void> => {
  if (!event.target.files || event.target.files.length == 0) {
    return; // 画像が選択されていないのでreturn
  }
  const file = event.target.files[0]; // 選択された画像を取得
  const filePath = `private/${uuidv4()}`; // ファイルパスを指定,uuidライブラリインストール
  // Supabaseに画像をアップロード
  const { data, error } = await supabase.storage
    .from("post_thumbnail") //ここでバケット名を使用
    //upload:指定したバケットにファイルをアップロードするためのメソッド
    .upload(filePath, file, {
      cacheControl: "3600", //キャッシュ制御の設定です。3600秒（1時間）キャッシュされるように指定
      upsert: false, //ファイルが既に存在する場合に上書きするかどうかを指定します。`false`に設定すると、既存のファイルがある場合は上書きせずにエラーを返す。
    });

  // アップロードに失敗したらエラーを表示して終了
  if (error) {
    alert(error.message);
    return;
  }
  // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する
  setThumbnailUrlKey(data.path);
};

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
            type="file"
            id="thumbnailUrl"
            // value={thumbnailUrl}
            //onChange={(e) => setThumbnailUrl(e.target.value)}
            onChange={handleImageChange}
            accept="image/*"
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
