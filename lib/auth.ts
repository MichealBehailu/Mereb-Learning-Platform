import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
export const auth = betterAuth({ //this creates the auth configuration file for the server side 
    database: prismaAdapter(prisma, { 
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
  //  emailAndPassword: { 
  //   enabled: true, 
  // }, 
  socialProviders: { 
    github: { 
      clientId: process.env.AUTH_GITHUB_CLIENT_ID as string, 
      clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET as string, 
    }, 
  },  
});