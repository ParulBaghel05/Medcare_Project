import { ExtractJwt } from "passport-jwt";

const config={
    jwtFromRequest :ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.JWT_SECRET || "my-default-secret",
}

export default config;