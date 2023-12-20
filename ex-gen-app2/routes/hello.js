const router = require("express").Router();
const mariadb = require("mariadb");

router.get("/", async (req, res, next) => {
    try {
        const db = await mariadb.createConnection({
            host: "localhost",
            port: "3306",
            user: "express",
            password: "foobarhogepiyo",
            database: "ex-gen-app2",
        });
        const rows = await db.query("SELECT * FROM mydata");
        const data = {
            title: "Hello!",
            content: rows,
        };
        res.render("hello", data);
    } catch (e) {
        res.sendStatus(500);
        res.send("データベースエラー");
        console.log(e);
    }

})

module.exports = router;
