import express, { Router } from "express";
import { Register } from "../controllers/auth.js";
import Validate from "../middleware/validate.js";
import { check } from "express-validator";
import { Login } from "../controllers/auth.js";
const router = express.Router();

router.post(
    "/register",
    [
        check("email")
            .isEmail()
            .withMessage("Enter a valid email address")
            .normalizeEmail(),
        check("first_name")
            .not()
            .isEmpty()
            .withMessage("Your first name is required")
            .trim()
            .escape(),
        check("last_name")
            .not()
            .isEmpty()
            .withMessage("Your last name is required")
            .trim()
            .escape(),
        check("password")
            .notEmpty()
            .isLength({ min: 8 })
            .withMessage("Must be at least 8 characters long")
            .matches(/\d/)
            .withMessage("Must contain a number")
            .matches(/[A-Z]/)
            .withMessage("Must contain an uppercase letter")
            .matches(/[a-z]/)
            .withMessage("Must contain a lowercase letter")
            .matches(/[!@#$%^&*]/)
            .withMessage("Must contain a special character"),
    ],
    Validate,
    Register
);

router.post(
    "/login",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("password").not().isEmpty(),
    Validate,
    Login
);

export default router;
