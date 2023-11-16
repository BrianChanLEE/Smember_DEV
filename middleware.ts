export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/notice/:path*",
    "/signin/:path*",
    "/auth/:path*",
    "/store/:path*",
  ],
};
