import { Application } from "express";
import user from "./router/userRouter";

export const mainApp = async (app: Application) => {
  app.use("/api/v1", user);
  try {
  } catch (error) {
    return error;
  }
};
