"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeAccountPassword = exports.fogetAccountPassword = exports.readAllAccount = exports.readOneAccount = exports.loginAccount = exports.verifyAccount = exports.createAccount = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const email_1 = require("../utils/email");
dotenv_1.default.config();
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, password } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        const token = crypto_1.default.randomBytes(4).toString("hex");
        const user = yield userModel_1.default.create({
            email,
            name,
            password: hashed,
            verifiedToken: token,
        });
        (0, email_1.createAccountEmail)(user);
        return res.status(201).json({
            message: "user created ",
            data: user,
            status: 201,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating Account",
            status: 404,
        });
    }
});
exports.createAccount = createAccount;
const verifyAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findByIdAndUpdate(userID, {
            isVerified: true,
            verifiedToken: "",
        }, { new: true });
        return res.status(201).json({
            message: "user account verified ",
            data: user,
            status: 201,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying Account",
            status: 404,
        });
    }
});
exports.verifyAccount = verifyAccount;
const loginAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({
            email,
        });
        if (user) {
            const check = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
            if (check) {
                if ((user === null || user === void 0 ? void 0 : user.isVerified) && (user === null || user === void 0 ? void 0 : user.verifiedToken) === "") {
                    const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user._id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES,
                    });
                    return res.status(201).json({
                        message: "Login successful ",
                        data: token,
                        status: 201,
                    });
                }
                else {
                    return res.status(404).json({
                        message: "Please verify your account",
                        status: 404,
                    });
                }
            }
            else {
                return res.status(404).json({
                    message: "Error with password",
                    status: 404,
                });
            }
        }
        else {
            return res.status(404).json({
                message: "Error with email",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating Account",
            status: 404,
        });
    }
});
exports.loginAccount = loginAccount;
const readOneAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        return res.status(200).json({
            message: "read one user account ",
            data: user,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying Account",
            status: 404,
        });
    }
});
exports.readOneAccount = readOneAccount;
const readAllAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.find();
        return res.status(200).json({
            message: "read one user account ",
            data: user,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying Account",
            status: 404,
        });
    }
});
exports.readAllAccount = readAllAccount;
const fogetAccountPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        const token = crypto_1.default.randomBytes(6).toString("hex");
        if (user) {
            yield userModel_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
                verifiedToken: token,
            }, { new: true });
            (0, email_1.forgetAccountPasswordMail)(user);
            return res.status(200).json({
                message: "Request is been processed, email has been sent to you!",
                status: 200,
            });
        }
        else {
            return res.status(404).json({
                message: "No email with such Account",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying Account",
            status: 404,
        });
    }
});
exports.fogetAccountPassword = fogetAccountPassword;
const changeAccountPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { password } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        if (userID) {
            yield userModel_1.default.findByIdAndUpdate(userID, {
                password: hashed,
                verifiedToken: "",
            }, { new: true });
            return res.status(200).json({
                message: "Your password as been updated, please go login!",
                status: 200,
            });
        }
        else {
            return res.status(404).json({
                message: "No email with such Account",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying Account",
            status: 404,
        });
    }
});
exports.changeAccountPassword = changeAccountPassword;
