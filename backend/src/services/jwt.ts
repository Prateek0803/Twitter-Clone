import { User } from "@prisma/client";
import JWT from "jsonwebtoken";
import { JwtUser } from "../app/interfaces";

const JWT_SECRET = "prateek@1234";

class JWTService {
  public static generateToken(user: User) {
    const payload: JwtUser = {
      id: user.id,
      email: user.email,
    };

    const token = JWT.sign(payload, JWT_SECRET);

    return token;
  }
  public static decodeToken(token: string) {
    try {
      return JWT.verify(token, JWT_SECRET) as JwtUser;
    } catch (error) {
      return null;
    }
  }
}

export default JWTService;
