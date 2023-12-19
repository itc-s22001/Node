const express = require("express");
const router = express.Router();

router.get("/",(req,res, next) => {
    let msg = "なにか書いて送信してください";
    if (req.session.message !== undefined)  {
        msg = `Last Message: ${req.session.message}`;
    }
    const data = {
        title: "Hello3!",
        content: msg,
    }
    res.render("hello3", data);
});


router.post("/post",(req, res, next) => {
    req.session.message = req.body.message;
    const data = {
        title: "Hello3!",
        content: `Lase Message:「${req.session.message}」`,
    };
    res.render("hello3", data)
})

module.exports = router