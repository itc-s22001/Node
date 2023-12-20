const express = require("express");
const router = express.Router();

router.get("/",(req, res, next) => {
    const data = {
        title: "Hello",
        content: "これは、サンプルのコンテンツです。<br>this id sample content."
    };
    res.render("hello", data);
});

router.get("/ok", (req,res,next) => {
    const data = {
        title: "Hello OK!",
        content: "OKです"
    };
    res.render("hello", data)
})

module.exports = router