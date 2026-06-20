import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../models/UserModel.js";

export default function configurePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          `${process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`}/auth/google/callback`
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          let userDocument = await UserModel.findOne({
            $or: [{ googleId: profile.id }, { email }]
          });

          if (!userDocument) {
            userDocument = await UserModel.create({
              firstName: profile.name?.givenName || "ANVIA",
              lastName: profile.name?.familyName || "Member",
              email,
              googleId: profile.id,
              profileImage: profile.photos?.[0]?.value
            });
          } else if (!userDocument.googleId) {
            userDocument.googleId = profile.id;
            userDocument.profileImage =
              userDocument.profileImage || profile.photos?.[0]?.value || "";
            await userDocument.save();
          }

          done(null, userDocument);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
}
