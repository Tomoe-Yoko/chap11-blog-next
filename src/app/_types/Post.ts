// export interface Post {
//   id: number;
//   thumbnailUrl: string;
//   title: string;
//   createdAt: string;
//   categories: string[];
//   content: string;
// }
import React from "react";
import { useState } from "react";

//app/page.tsx,Post[Id]/page.tsx用
export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  categories: { id: string; name: string }[];
  thumbnail: { url: string; height: number; width: number };
}

// eslint-disable-next-line react-hooks/rules-of-hooks
const [post, setPost] = useState<Post[]>([]);
