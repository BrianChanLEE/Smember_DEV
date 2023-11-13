export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/notice/:path*", "/users/:path*"],
};
