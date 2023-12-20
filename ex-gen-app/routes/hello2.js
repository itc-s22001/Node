const express = require("express");
const router = express.Router();

router.get("/",(req,res, next) => {
    const name = req.query.name;
    const mail = req.query.mail;
    const data = {
        title: "Hello2",
        content: `あなたの名前は、${name}。<br>` +
            `メールアドレスは、${mail}です。`
    };
    res.render("hello", data);
});

router.get("/index2", (req, res, next) => {
    const data = {
        title: "Hello2 index2",
        content: "なにか書いて送信してください",
    };
    res.render("hello2", data)
})

router.post("/post",(req, res, next) => {
    const msg = req.body["message"];
    const data = {
        title: "Hello2 !",
        content: `あなたは、「${msg}」と送信しました`,
    };
    res.render("hello2", data)
})

module.exports = router