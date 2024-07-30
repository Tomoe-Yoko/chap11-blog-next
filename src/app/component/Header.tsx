import React from "react";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="py-4 px-12 bg-gray-900 text-white flex justify-between items-center fixed top-0 left-0 w-full">
      <h1>
        <Link href="/">Blog</Link>
      </h1>
      <p>
        <Link href="/contact">お問合せ</Link>
      </p>
    </header>
  );
};
