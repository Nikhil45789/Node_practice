import User from "../models/User.js";
import bcrypt from "bcrypt";

/**
 * @route POST v1/auth/register
 * @desc Registers a user
 * @access Public
 */
export async function Register(req, res) {
    const { first_name, last_name, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "It seems you already have an account, please log in instead.",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create an instance of a user with the hashed password
        const newUser = new User({
            first_name,
            last_name,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save(); // save new user into the database
        const { role, ...user_data } = savedUser._doc;

        res.status(200).json({
            status: "success",
            data: [user_data],
            message: "Thank you for registering with us. Your account has been successfully created.",
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: err,
            message: "Internal Server Error",
        });
    }
    res.end();
}

/**
 * @route POST v1/auth/login
 * @desc Logs in a user
 * @access Public
 */
export async function Login(req, res) {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Invalid email or password. Please try again with the correct credentials.",
            });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Invalid email or password. Please try again with the correct credentials.",
            });
        }

        // Return user info except password
        const { password: _, ...user_data } = user._doc;

        res.status(200).json({
            status: "success",
            data: [user_data],
            message: "You have successfully logged in.",
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: err,
            message: err.message,
        });
    }
    res.end();
}
