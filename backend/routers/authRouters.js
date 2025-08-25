import { Router } from "express";
import User from "../models/user.js";
import multer from "multer";

import path from 'path';

import authMiddleware from '../middlewares/authMiddleware.js'


const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.png')
    }
})

const upload = multer({ storage: storage })

router.get('/me',authMiddleware, async (req, res) => {
    // console.log(req)
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
//   console.log(user);
});

router.post('/signup', upload.single('profileImageURL'), async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const newUser = await User.create({
            userName,
            email,
            password,
            profileImageURL: `/uploads/${req.file.filename}`
        });

        const token = await User.matchPasswordandGenrateToken(email, password);

        res.cookie('authCookie', token, {
            httpOnly: true,
            secure: false,  
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000 
        });

        return res.status(201).json({ token });

    }
    catch (error) {
        console.error(error);
        return;
    }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // const user = await User.findOne({ userName }); // ✅ fix

    // if (!user) {
    //   return res.status(404).json({ message: 'User not found' });
    // }
    console.log(email);

    const token = await User.matchPasswordandGenrateToken(email, password); // ✅ ok

    

    res.cookie('authCookie', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ token });
  } catch (error) {
    console.error("Signin Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


export default router;
