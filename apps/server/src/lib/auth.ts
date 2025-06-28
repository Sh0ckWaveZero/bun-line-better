import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../../prisma/index.js";
import { genericOAuth } from "better-auth/plugins";
import { randomUUID } from "crypto";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  generateId: () => {
    const id = randomUUID();
    console.log('🆔 Generated ID:', id);
    return id;
  },
  logger: {
    level: "debug",
    disabled: false,
  },
  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  // ตั้งค่า default redirect หลัง OAuth สำเร็จ
  redirectTo: process.env.CORS_ORIGIN + "/dashboard" || "http://localhost:3001/dashboard",
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: "user",
  },
  account: {
    modelName: "account",
    accountLinking: {
      enabled: true,
      trustedProviders: ["line"],
    }
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "line",
          clientId: process.env.LINE_CHANNEL_ID || "",
          clientSecret: process.env.LINE_CHANNEL_SECRET || "",
          authorizationUrl: "https://access.line.me/oauth2/v2.1/authorize",
          tokenUrl: "https://api.line.me/oauth2/v2.1/token",
          userInfoUrl: "https://api.line.me/v2/profile",
          scopes: ["profile", "openid"],
          redirectURI: "http://localhost:4235/api/auth/oauth2/callback/line", // ใช้ URL ที่ลงทะเบียนใน LINE Developers Console
          getUserInfo: async (tokens) => {
            const res = await fetch("https://api.line.me/v2/profile", {
              headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
              },
            });
            const profile = await res.json();
            return profile;
          },
          mapProfileToUser: (user: any) => {
            console.log('🚀 ~ LINE user profile:', JSON.stringify(user, null, 2));
            
            // สร้าง fake email เป็น unique key สำหรับ LINE user
            const fakeEmail = `${user.userId}@line.local`;
            
            const mappedUser = {
              id: randomUUID(),
              name: user.displayName || 'LINE User',
              image: user.pictureUrl || null,
              email: fakeEmail,
              emailVerified: false,
            };
            
            console.log('✨ Mapped user data:', JSON.stringify(mappedUser, null, 2));
            return mappedUser;
          },
        },
      ],
    }),
  ],
});



