import express from "express";
import {check, validationResult} from "express-validator";
import {PrismaClient} from "@prisma/client";
import {calcHash, generateSalt} from "../util/auth.js";


const router = express.Router();
const prisma = new PrismaClient();


/* GET users listing. */

router.get("/", (req, res, next) => {
    try {
        res.status(200).json({message: "logged in"});
    } catch (e) {
        res.status(400).json({message: "unauthenticated"});
    }
});
router.get("/login", (req, res, next) => {
   const data = {
       title: "ログイン",
       name: ""
   }
    // const data = {
    //     title: "Users/login",
    //     content: "名前とパスワードを入力してください"
    // };
    // res.render("users/login", data);
});

// ログアウト処理
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/users/login")
    });
});

// 新規登録
router.get("/signup", (req, res, next) => {
    const data = {
        title: "ユーザ新規登録",
        name: "",
        // errors: []
    };
    res.status(200).json(data);
});

// 新規登録処理
router.post("/signup", async (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const error = result.array();
        const data = {
            title: "Users/Signup",
            name: req.body.name,
            error,
        };
        res.render("users/signup", data);
        return;
    }
    const {name, password} = req.body;
    const salt = generateSalt();
    const hashedPassword = calcHash(password, salt);
    await prisma.user.create({
        data: {
            name,
            password: hashedPassword,
            salt
        }
    });
    res.status(200).json({m: "登録完了"})
});

export default router;
