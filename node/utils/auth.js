import jwt from 'jsonwebtoken'
import 'dotenv/config'

const token_secret = process.env.JWT_token_secret

export function verifyToken(req, res, next) {
    const header = req.header("Authorization") || "";
    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token not provied" });
    }
    try {
      const payload = jwt.verify(token, token_secret);
      req.id = payload.id;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Token not valid" });
    }
  }

export const getUserIdFromToken = (req) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_token_secret);
  return decoded.userId;
};

export const getUserId = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_token_secret);
  return decoded.userId;
};
