import jwt from 'jsonwebtoken';
import { secret } from '../services/authentication.js';
// import cookieParser from "cookie-parser";
const key = "HardCoded"; // Use environment variable in production


const authMiddleware = (req, res, next) => {

  const token = req.cookies.authCookie;

//   console.log(token);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, key);
    // console.log(decoded._id);
    req.userId = decoded._id;
    // console.log(req.userId);
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

export default authMiddleware;
