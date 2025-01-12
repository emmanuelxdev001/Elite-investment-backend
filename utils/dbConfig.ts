import { connect } from "mongoose";
import env from "dotenv";
env.config();

export const dbConfig = async () => {
  try {
    await connect(process.env.MONGO_URL_LIVE as string).then(() => {
      console.clear();
      console.log("db connected ❤️❤️🚀🚀");
    });
  } catch (error) {
    return error;
  }
};
