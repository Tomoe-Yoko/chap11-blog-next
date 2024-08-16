"use client";

import React from "react";
import { redirect } from "next/navigation";

//admin/postsのpage.jsに直行する
const Page = () => {
  redirect("/admin/posts");
};

export default Page;
