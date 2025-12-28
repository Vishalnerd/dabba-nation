import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Custom hook to verify JWT token on client side
 * Redirects to login if token is invalid or expired
 */
export function useAdminAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    
    if (!token) {
      router.push("/components/admin");
      return;
    }

    // Basic JWT expiration check on client side
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired) {
        localStorage.removeItem("adminToken");
        router.push("/components/admin");
      }
    } catch (error) {
      console.error("Invalid token format:", error);
      localStorage.removeItem("adminToken");
      router.push("/components/admin");
    }
  }, [router]);
}
