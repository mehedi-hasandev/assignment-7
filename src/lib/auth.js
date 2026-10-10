import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URL);
const db = client.db("assignment-7"); 

export const auth = betterAuth({
  database: mongodbAdapter(db),
  
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: { 
      enabled: true, 
      clientId: process.env.GOOGLE_ID, 
      clientSecret: process.env.GOOGLE_SECRET 
    },
    github: { 
      enabled: true, 
      clientId: process.env.GITHUB_ID, 
      clientSecret: process.env.GITHUB_SECRET 
    }
  }
});