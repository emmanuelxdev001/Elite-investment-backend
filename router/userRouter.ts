import { Router } from "express";
import {
  createAccount,
  loginAccount,
  verifyAccount,
  readOneAccount,
  readAllAccount,
  fogetAccountPassword,
  changeAccountPassword,
} from "../controller/userController";

const router: any = Router();

router.route("/register").post(createAccount);
router.route("/login").post(loginAccount);
router.route("/verify-account/:userID").get(verifyAccount);
router.route("/forget-account-password").patch(fogetAccountPassword);
router.route("/reset-account-password/:userID").patch(changeAccountPassword);

router.route("/get-one-user/:userID").get(readOneAccount);
router.route("/get-user").get(readAllAccount);

export default router;
