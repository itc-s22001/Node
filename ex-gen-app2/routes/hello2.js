const router = require("express").Router();
const mariadb = require("mariadb");
const {check, validationResult} = require("express-validator");

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

router.get("/add2", (req,res,next) => {
    const data = {
        title: "Hello/Add",
        content: "新しいコードを入力:",
        form: {name: "", email: "", age: 0}
    };
    res.render("hello2/add2", data)
});

router.post("/add2", [
    check("name", "NAME　は必ず入力してください").notEmpty(),
    check("email", "EMAIL はメールアドレスを記入してください。").isEmail(),
    check("age", "AGE　は年齢(整数)を入力してください。").isInt()
], async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const messages = errors.array();
        const data = {
            title: "Hello2/Add2",
            content: "新しいコードを入力:",
            form: req.body,
            errors: messages,
        };
        res.render("hello2/add2", data);
        return;
    }
    // 入力チェックで問題なければ以下の処理へ進める系
    const {name, email, age} = req.body;
    try {
        await pool.query(
            "INSERT INTO mydata (name, email, age) VALUES (?, ?, ?)",
            [name, email, age]
        );
        res.redirect("/hello2");
    } catch (e) {
        res.status(500).send("データベースエラー");
        console.log(e);
    }
});



module.exports = router;