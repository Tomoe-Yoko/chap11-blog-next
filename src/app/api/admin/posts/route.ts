///////GET
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
  try {
    const posts = await prisma.post.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(
      {
        status: "OK",
        posts: posts,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

///////POST
//記事作成のリクエストボディの型
interface CreatePostRequestBody {
  title: string;
  content: string;
  categories: { id: number }[]; //IDをナンバーで指定したオブジェクトの配列
  thumbnailUrl: string;
}

//POSTと命名することでポストリクエスト時にこの関数が呼ばれる
//管理者が記事を作成・投稿するための処理：POST
export const POST = async (request: Request) => {
  try {
    //リクエストのbodyを取得
    const body = await request.json();
    //bodyの中から以下の４つを取り出す
    const { title, content, categories, thumbnailUrl }: CreatePostRequestBody =
      body;
    //投稿をDBに生成
    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailUrl,
      },
    });
    //postCategoryにも生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施

    for (const category of categories) {
      //postCategory` テーブルに新しいエントリを作成するためのメソッド↓
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: data.id,
        },
      });
    }
    //レスポンスを返す
    return NextResponse.json({
      status: "OK",
      message: "送信しました",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          status: error.message,
        },
        { status: 400 }
      );
    }
  }
};
