const jwt = require("jsonwebtoken");

export const APP_SECRET = "keep_this_string_a_secret";

function getTokenPayload(token: any) {
  return jwt.verify(token, APP_SECRET);
}

export function getUserId(req: any, authToken: any) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        throw new Error("No token found");
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }
  throw new Error("Not authenticated");
}
