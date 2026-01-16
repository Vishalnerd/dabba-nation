// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = { 
  // Protect all routes starting with /admin, except /admin/login
  matcher: ["/admin/dashboard/:path*", "/admin/settings/:path*"] 
};