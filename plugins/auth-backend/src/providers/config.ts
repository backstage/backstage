export const providers = [
  {
    provider: 'google',
    options: {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:7000/auth/google/handler/frame',
    },
  },
];
