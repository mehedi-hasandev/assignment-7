import { betterAuth } from "better-auth";

export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: { enabled: true, clientId: process.env.GOOGLE_ID, clientSecret: process.env.GOOGLE_SECRET },
    github: { enabled: true, clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }
  }
});