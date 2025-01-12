import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import env from "dotenv";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel";
import { createAccountEmail, forgetAccountPasswordMail } from "../utils/email";

env.config();

export const createAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, name, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const token = crypto.randomBytes(4).toString("hex");

    const user = await userModel.create({
      email,
      name,
      password: hashed,
      verifiedToken: token,
    });

    createAccountEmail(user);

    return res.status(201).json({
      message: "user created ",
      data: user,
      status: 201,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error creating Account",
      status: 404,
    });
  }
};

export const verifyAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;

    const user = await userModel.findByIdAndUpdate(
      userID,
      {
        isVerified: true,
        verifiedToken: "",
      },
      { new: true }
    );

    return res.status(201).json({
      message: "user account verified ",
      data: user,
      status: 201,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying Account",
      status: 404,
    });
  }
};

export const loginAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({
      email,
    });

    if (user) {
      const check = await bcrypt.compare(password, user?.password);

      if (check) {
        if (user?.isVerified && user?.verifiedToken === "") {
          const token = jwt.sign(
            { id: user?._id },
            process.env.JWT_SECRET as string,
            {
              expiresIn: process.env.JWT_EXPIRES as string,
            }
          );
          return res.status(201).json({
            message: "Login successful ",
            data: token,
            status: 201,
          });
        } else {
          return res.status(404).json({
            message: "Please verify your account",
            status: 404,
          });
        }
      } else {
        return res.status(404).json({
          message: "Error with password",
          status: 404,
        });
      }
    } else {
      return res.status(404).json({
        message: "Error with email",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error creating Account",
      status: 404,
    });
  }
};

export const readOneAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;

    const user = await userModel.findById(userID);

    return res.status(200).json({
      message: "read one user account ",
      data: user,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying Account",
      status: 404,
    });
  }
};

export const readAllAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await userModel.find();

    return res.status(200).json({
      message: "read one user account ",
      data: user,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying Account",
      status: 404,
    });
  }
};

export const fogetAccountPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    const token = crypto.randomBytes(6).toString("hex");
    if (user) {
      await userModel.findByIdAndUpdate(
        user?._id,
        {
          verifiedToken: token,
        },
        { new: true }
      );

      forgetAccountPasswordMail(user);

      return res.status(200).json({
        message: "Request is been processed, email has been sent to you!",
        status: 200,
      });
    } else {
      return res.status(404).json({
        message: "No email with such Account",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying Account",
      status: 404,
    });
  }
};

export const changeAccountPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const { password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    if (userID) {
      await userModel.findByIdAndUpdate(
        userID,
        {
          password: hashed,
          verifiedToken: "",
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Your password as been updated, please go login!",
        status: 200,
      });
    } else {
      return res.status(404).json({
        message: "No email with such Account",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying Account",
      status: 404,
    });
  }
};
