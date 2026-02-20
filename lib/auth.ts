import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../generated/prisma/client";
export const auth = betterAuth({ //this creates the auth configuration file for the server side 
    database: prismaAdapter(prisma, { 
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
  //...
});