import { hostname } from "os";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // hostname:
        //   "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/",
        //APIのドメインでなく、画像URL（post.thumbnailUrl）のドメイン

        hostname: "placehold.jp",
      },
    ],
  },
};

export default nextConfig;
