import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/userModel.js"; // Your Mongoose User model

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/api/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    let user = await userModel.findOne({ googleId: profile.id });

    if (!user) {
        user = await userModel.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
        });
    }

    done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
});
