const router = require("express").Router();

router.get("/", (req,res,next) =>  {
    const data = {
        title: "Hello",
        content: "これは、サンプルのコンテンツです"
    };
    res.render("hello/index", data)
});






module.exports = router;