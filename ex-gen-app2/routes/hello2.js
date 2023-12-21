const router = require("express").Router();
const mariadb = require("mariadb");
const e = require("express");

const pool = mariadb.createPool({
    host: "localhost",
    port: "3306",
    user: "express",
    password: "foobarhogepiyo",
    database: "ex-gen-app2",
    connectionLimit: 5,
});

router.get("/", async (req, res, next) => {
    try {
        const rows = await pool.query("SELECT * FROM mydata");
        const data = {
            title: "Hello!",
            content: rows,
        };
        res.render("hello2/index", data);
    } catch (e) {
        res.sendStatus(500).send("データベースエラー");
        console.log(e);
    }

})

router.get("/add", (req,res,next) => {
    const data = {
        title: "Hello/Add",
        content: "新しいコードを入力:",
    };
    res.render("hello2/add", data)
});

router.post("/add", async (req,res,next) => {
    const {name, email, age} = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO mydata (name, email, age) VALUES (?,?,?)",
            [name, email, age]
        );
        console.log(`result?: ${result}`)
        res.redirect("/hello2");
    } catch (e) {
        res.sendStatus(500);
        res.send("データベースエラーです");
        console.log(e);
    }
});

router.get("/show", async (req, res, next) => {
    const id = req.query.id;
    if (id == null) { // 表示したいデータのidがパラメータで未指定だったら
        res.status(404).send("Not found...");
        return;
    }
    try {
        const rows = await pool.query(
            "SELECT * FROM mydata WHERE id = ?",
            [id]
        );
        if (rows == null || rows.length !== 1) { //　該当データがない場合
            res.status(404).send("Not found...");
            return;
        }
        const data = {
            title: "Hello/show",
            content: `id = ${id} のレコード`,
            mydata: rows[0]
        };
        res.render("hello2/show", data);
    } catch (e) {
        res.status(500).send("データベースエラーです");
        console.log(e);
    }
});

router.get("/edit", async (req, res, next) => {
    const id = req.query.id;
    if (id == null) {
        res.stat(404).send("Not found...");
        return;
    }
    try {
        const rows = await pool.query(
            "SELECT * FROM mydata WHERE id = ?",
            [id]
        );
        if (rows == null || rows.length !== 1) {
            res.status(404).send("Not found...");
            return;
        }
        const data = {
            title: "hello/edit",
            content: `id = ${id} のレコードを編集:`,
            mydata: rows[0]
        };
        res.render("hello2/edit", data);
    } catch (e) {
        res.status(500).send("データベースエラー");
        console.log(e)
    }
});

router.post("/edit", async (req, res, next) => {
    const {id, name, email, age} = req.body;
    try {
        await pool.query(
            "UPDATE mydata SET name = ?, email = ?, age = ? WHERE id = ?",
            [name, email, age, id]
        );
        res.redirect("/hello2");
    } catch (e) {
        res.status(500).send("データベースエラー");
        console.log(e);
    }
});

module.exports = router;
