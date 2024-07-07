import dotenv from "dotenv";

dotenv.config();

export const config = {
  secrtKey: process.env.SECRET_KEY,
  tokenSecret: process.env.TOKEN_SECRET,
  refrchTokenSecret: process.env.REFRCH_TOKEN_SECRET,
  userDb: process.env.USER_DB,
  passDb: process.env.PASS_DB,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
};