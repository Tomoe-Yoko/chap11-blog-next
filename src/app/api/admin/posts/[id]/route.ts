import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/utils/supabase";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = request.headers.get("Authorization") ?? "";
  //supabaseにtokenを送る
  const { error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });
  //tokenが正しい場合try以降が実行される
  const { id } = params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json({ status: "OK", post: post }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(
        {
          status: error.message,
        },
        { status: 400 }
      );
  }
};

////////PUT更新
interface UpdatePostRequestBody {
  title: string;
  content: string;
  categories: { id: number }[];
  thumbnailImageKey: string;
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { currentUser, error } = await getCurrentUser(request);
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  const { id } = params;
  //このパラメーターは文字列として返す

  const {
    title,
    content,
    categories,
    thumbnailImageKey,
  }: UpdatePostRequestBody = await request.json();

  try {
    const post = await prisma.post.update({
      where: {
        id: parseInt(id), //数字にすると検索できるようになる
      },
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    });
    //一旦全部データを削除
    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
    });

    //for文で新しくデータを作り直す
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: category.id,
        },
      });
    }
    return NextResponse.json({ status: "OK", post: post }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

///////DELETE 削除
// DELETEという命名にすることで、DELETEリクエストの時にこの関数が呼ばれる

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    });
    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
