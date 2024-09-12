import React, { ChangeEvent, useEffect, useState } from "react";
import { Category } from "@/app/_types/Category";
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid"; // 固有IDを生成するライブラリ
import Image from "next/image";

interface PostFormProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  thumbnailImageKey: string;
  setThumbnailImageKey: React.Dispatch<React.SetStateAction<string>>;
  categories: Category[]; //記事に関連付けられる可能性があるカテゴリのリスト（配列）
  selectedCategories: Category[]; //記事に現在選択されているカテゴリのリスト（配列）
  handleSelectCategory: (category: Category) => void;
  handlePostSubmit: (e: React.FormEvent) => void;
  handleDeletePost?: () => void;
  mode: "new" | "edit";
}

const PostForm: React.FC<PostFormProps> = ({
  title,
  setTitle,
  content,
  setContent,
  categories,
  selectedCategories,
  handleSelectCategory,
  thumbnailImageKey,
  setThumbnailImageKey,
  handlePostSubmit,
  handleDeletePost,
  mode,
}) => {
  //handleImageChangeのロジック部分

  //////// Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );
  console.log(thumbnailImageUrl);

  //以下の関数はユーザーが選択した画像をクラウドストレージにアップロードし、そのパスを保存するためのものです。エラーが発生した場合はユーザーに通知し、成功した場合はパスを保存
  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      return; // 画像が選択されていない時はreturn
    }
    const file = event.target.files[0]; // 選択された画像を取得
    const filePath = `private/${uuidv4()}`; // ファイルパスをランダム文字で作成,（uuidライブラリインストール）
    //アップロード先の住所みたいなの

    const { data, error } = await supabase.storage // Supabaseに画像をアップロード
      .from("post_thumbnail") //どのストレージバケットにファイルをアップロードするかを指定、ここでバケット名を使用
      //upload:指定したバケットにファイルをアップロードするためのメソッド
      .upload(filePath, file, {
        cacheControl: "3600", //キャッシュ制御の設定です。3600秒（1時間）キャッシュされるように指定
        upsert: false, //同じ名前のファイルが存在する場合に上書きするかどうか（ここでは上書きしない）。
      });

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message);
      return;
    }
    // data.path（アップロードされたファイルのパス）が、画像固有のkey、これをthumbnailImageKeyに格納する
    setThumbnailImageKey(data.path);
  };
  // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
  useEffect(() => {
    if (!thumbnailImageKey) return;
    const fetcherImage = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(thumbnailImageKey);
      //supabaseの仕様なので、覚える

      setThumbnailImageUrl(publicUrl);
    };
    fetcherImage();
  }, [thumbnailImageKey]);
  // [thumbnailImageKey]依存配列内はthumbnailImageKeyに変更があったときにレンダリングする

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
            onChange={handleImageChange}
            accept="image/*"
            className="mt-4 block w-5/6 min-w-40 rounded-md border border-gray-200 p-3"
          />

          {thumbnailImageUrl && (
            <Image
              src={thumbnailImageUrl}
              alt={title}
              width={600}
              height={300}
            />
          )}
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
        {mode === "edit" && thumbnailImageUrl && (
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
