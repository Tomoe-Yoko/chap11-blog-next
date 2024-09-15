import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

///////GET
export const GET = async (request: NextRequest) => {
  // ??  左側の値が`null`または`undefined`の場合に右側の''(空文字)を返します。
  const token = request.headers.get("Authorization") ?? "";
  //supabaseにtokenを送る
  const { error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });
  //tokenが正しい場合try以降が実行される
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ status: "OK", categories }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

///////POST
interface CreateCategoryRequestBody {
  name: string;
}

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { name }: CreateCategoryRequestBody = body;
    const data = await prisma.category.create({
      data: {
        name,
      },
    });
    return NextResponse.json({
      status: "OK",
      message: "作成しました",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
