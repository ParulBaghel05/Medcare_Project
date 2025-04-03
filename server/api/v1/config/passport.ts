import { ExtractJwt } from "passport-jwt";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dbPool from "./db";
import authService from "../services/authService";
const config={
    jwtFromRequest :ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.JWT_SECRET || "my-secure-secret",
}

const googleConfig={
    clientID:process.env.GOOGLE_CLIENT_ID as string,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL:process.env.GOOGLE_CALLBACK_URL as string
}

passport.use(new GoogleStrategy(googleConfig,async (accessToken, refreshToken, profile, done) => {
    try {
      const { id, displayName, emails } = profile;
      console.log("profile values",id,displayName);
      const email = emails?.[0]?.value;
      if (!email) {
        return done(new Error("Email not found in profile"));
      }
      const response=await dbPool.query("SELECT FROM users WHERE email=$1",[email]);
      if (response.rowCount) {
        return done(null, response.rows[0]);
      }
      else await authService.registerUser({email:email,password:id,name:displayName});
      
      return done(null, response.rows[0]);
    } catch (error) {
      return done(error, false);
    }
  }
)
);

passport.serializeUser((user: any, done) => {
done(null, user.email);
});

passport.deserializeUser(async (email: string, done) => {
try {
  const user =await dbPool.query("SELECT FROM users WHERE email=$1",[email]);
  done(null, user.rows[0]);
} catch (error) {
  done(error, null);
}
});
export {passport,config};