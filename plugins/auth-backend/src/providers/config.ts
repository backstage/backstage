export const providers = [
  {
    provider: 'google',
    options: {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:7000/auth/google/handler/frame',
      passReqToCallback: true,
    },
  },
  // {
  //   provider: 'github',
  //   options: {
  //     clientID: process.env.GITHUB_CLIENT_ID!,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  //     callbackURL: 'http://localhost:7000/auth/github/handler/frame',
  //     passReqToCallback: true,
  //   },
  // },
];
