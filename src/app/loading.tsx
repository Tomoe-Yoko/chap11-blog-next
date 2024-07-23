"use client";
import React from "react";

export default function Apiloading() {
  return (
    <div className="flex justify-center h-screen" aria-label="Now Loading...">
      <div className="animate-spin h-20 w-20 my-52 border-8 border-blue-300 rounded-full border-b-transparent"></div>
    </div>
  );
}
