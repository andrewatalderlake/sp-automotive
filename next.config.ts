import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
};

export default withBotId(nextConfig);
