import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
const googleAuthRouter = express.Router();

// @desc Auth with Google
googleAuthRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// @desc Google auth callback
googleAuthRouter.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // Send JWT or redirect to frontend with token
        // Example: generate JWT token for session-based frontend
        // ✅ Generate JWT token using MongoDB ObjectId
        const token = jwt.sign(
        { id: req.user._id }, // this is from MongoDB
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
        ); 
        // console.log("Google Auth Token:", token);
        res.redirect(`http://localhost:5173/?token=${token}`);
    }
);

export default googleAuthRouter;