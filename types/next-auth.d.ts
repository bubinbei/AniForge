import "next-auth";

declare module "next-auth" {
  interface User {
    role?: "USER" | "ADMIN";
    plan?: "FREE" | "PREMIUM";
  }

  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
      plan: "FREE" | "PREMIUM";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "USER" | "ADMIN";
    plan?: "FREE" | "PREMIUM";
  }
}
