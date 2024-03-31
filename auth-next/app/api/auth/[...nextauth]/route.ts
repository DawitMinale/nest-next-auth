import { Backend_URL } from "@/lib/constants";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "devali",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials.password) return null;
        const { username, password } = credentials;

        const bodyData = JSON.stringify({
          username,
          password,
        }) as BodyInit; // Explicit cast to BodyInit

        console.log(bodyData)

        const res = await fetch(Backend_URL + "/auth/login", {
          method: "POST",
          body: bodyData,
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status == 401) {
          console.log(res.statusText);
          return null;
        }
        const user = await res.json();

        return user;
      },
    }),
  ],
  callbacks: {
    
    async jwt({token,user}){
      // console.log({token,user})
      if(user) return {...token, ...user}
      return token;
    },

    async session({session, token}){

      session.user = token.user;
      session.backendTokens = token.backendTokens;
      // console.log("session", session);
      
      return session;
    }

  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

