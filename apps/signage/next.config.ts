import type { NextConfig } from "next";

const backend =
  process.env.BACKEND_ORIGIN ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  // Keep client-facing URLs on this origin: without this, Next 308s
  // `/signages/` -> `/signages`, the backend replies with an absolute
  // redirect back to its own host, and the browser leaves the proxy.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${backend}/api/:path*` },
      { source: "/signages", destination: `${backend}/signages/` },
      { source: "/signages/", destination: `${backend}/signages/` },
      { source: "/signages/:path*", destination: `${backend}/signages/:path*` },
    ];
  },
};

export default nextConfig;
