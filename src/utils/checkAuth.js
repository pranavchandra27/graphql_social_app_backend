import jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server-errors";

export default (context) => {
  // context = {... headers}
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    // Bearer ....
    const token = authHeader.split("Bearer ")[1];

    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return user;
      } catch (error) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Authentication token must be 'Beared [token]' ");
  }

  throw new Error("Authorization header must be provided");
};
