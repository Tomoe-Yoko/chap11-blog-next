// "use client";
//アクセス制限のロジックを一括管理するためのカスタムhook
import { useSupabaseSession } from "@/app/hooks/useSupabaseSession";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const useRouteGuard = () => {
  const router = useRouter();
  const { session } = useSupabaseSession();
  useEffect(() => {
    if (session === undefined) return; //sessionがundefinedの場合は読み込み中なので何もしない
    const fetcher = async () => {
      if (session === null) {
        router.replace("/login");
      } //sessionがnullならログインページに遷移
    };
    fetcher();
  }, [router, session]);
};
//このhookをimportしたコンポーネントでは、コンポーネントの初回レンダリング時にこの処理が発火するようにします。

export default useRouteGuard;

// 初学者向けにポイントをまとめると以下の通り
// 1. **インポート**: 必要なモジュールやフックをインポート。
// 2. **カスタムフックの定義**: useRouteGuard という名前でカスタムフックを定義。
// 3. **ルーターとセッションの取得**: useRouter と useSupabaseSession を使ってルーターとセッション情報を取得。
// 4. **認証チェック**: useEffect フックを使って、セッション情報を監視し、未認証の場合はログインページにリダイレクト。
