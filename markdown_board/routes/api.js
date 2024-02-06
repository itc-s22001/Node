import express from "express";
import markdownIt from "markdown-it";
import {PrismaClient} from "@prisma/client";
import {check, validationResult} from "express-validator";
const router = express.Router();
const prisma = new PrismaClient();
const markdown = markdownIt();
/**
 * ログイン状態のチェックミドルウェア
 */
router.use((req, res, next) => {
    if (!req.user) {
        // 未ログインだったらここ
        res.status(401).json({message: "unauthenticated"});
        return;
    }
    // ログインできていたら次の処理へ
    next();
});
/**
 * 単純にクライアント側でログイン状態をチェックする用
 */
router.get("/check", (req, res, next) => {
    res.json({message: "ok", result: req.user.name});
});
/**
 * 全データ取得
 */
router.get("/all", async (req, res, next) => {
    const documents = await prisma.markdownDocument.findMany({
        where: {
            ownerId: +req.user.id
        },
        orderBy: [
            {createdAt: "desc"}
        ]
    });
    res.json({
        message: "ok",
        documents,
    });
});
/**
 * Markdown データの新規登録
 */
router.post("/add", [
    check("title").notEmpty(),
    check("text").notEmpty()
], async (req, res, next) => {
    const isValid = validationResult(req).isEmpty();
    if (!isValid) {
        // 入力値チェックで引っかかったらここで終わり
        res.status(400).json({message: "bad request"});
        return;
    }
    const {title, text} = req.body;
    await prisma.markdownDocument.create({
        data: {
            title,
            text,
            ownerId: +req.user.id
        }
    });
    res.status(201).json({message: "created"});
});
/**
 * 特定の Markdown データを取得して返す
 */
router.get("/markdown/:id", async (req, res, next) => {
    const markdown = await prisma.markdownDocument.findUnique({
        where: {
            id: +req.params.id,
            ownerId: +req.user.id
        },
    });
    if (!markdown) {
        // 存在しないIDか、所有者じゃないです
        res.status(404).json({message: "not found"});
        return;
    }
    // ちゃんと取れたので返す
    res.json({message: "ok", markdown});
});
/**
 * クライアントから送られてきた Markdown をレンダリングした結果を返す
 */
router.post("/markdown/render", (req, res, next) => {
    const source = req.body.data;
    res.json({message: "ok", render: markdown.render(source)});
});

/**
 * Markdown データの更新処理
 */
router.put("/markdown/edit", [
    check("id").notEmpty()
], async (req, res, next) => {
    const isValid = validationResult(req).isEmpty();
    if (!isValid) {
        res.status(400).json({message: "id is required"});
        return;
    }
    const id = +req.body.id;
    const title = req.body.title || "";
    const text = req.body.text || "";
    await prisma.markdownDocument.update({
        where: {id},
        data: {
            title,
            text
        }
    });
    res.status(201).json({message: "updated"});
});

export default router;