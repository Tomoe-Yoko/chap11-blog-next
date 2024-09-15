// "use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";

export const useSupabaseSession = () => {
  // undefined: ログイン状態ロード中, null: ログインしていない, Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null); //ログインしている場合のアクセストークンを格納。初期値はnull。
  const [isLoading, setIsLoading] = useState(true); //セッション情報の取得が完了するまでのロード状態を示す。初期値はtrueで、「読み込み中」であることを示す。falseはロードが完了

  useEffect(() => {
    const fetcher = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession(); //現在のセッション情報を取得
      setSession(session); //getSessionで取得したsessionは、stateのsessionに格納
      setToken(session?.access_token || null); //現在のユーザーがログインしている場合にはアクセストークンを設定し、ログインしていない場合にはnullを設定
      setIsLoading(false); //データの取得が完了したら、isLodingをfalseに設定してロードが完了したことを示す。
    };
    fetcher();
  }, []);

  return { session, isLoading, token };
};

//このカスタムフックを使うことで、どのコンポーネントでも現在のユーザーのログイン状態を簡単に取得し、利用できるようになる。ログイン状態の管理が必要な場所で、このフックを呼び出すだけでコードの重複を防ぎ、効率的な管理ができる。
