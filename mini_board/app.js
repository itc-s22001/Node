const http = require("node:http")
const fs = require("node:fs")
const pug = require("pug")
const qs = require("querystring")

// 投稿データの最大保持数設定
// @type {number}
const maxNum = 10
const filename = "mydata.txt"
let messageData;
readFromFile(filename)


const server = http.createServer(getFromClient);
server.listen(3000);
console.log("Server Start!");

// リクエストに応じてルーティング
function getFromClient(req,res) {
    // リクエストURLのパーズ
    const url = new URL(req.url,`https://${req.headers.host}`)

    switch (url.pathname) {
        case "/": // トップページ
            responseIndex(req,res)
            break
        case "/login": // ログインページ
            responseLogin(req,res)
            break
        default: // 想定外のページ(404エラーを返す)
            res.writeHead(404,{"Content-Type":"text/plain"})
            res.end("404 Not Found..")
            break
    }
}


// ログインページの処理
function responseLogin(request, response) {
    const content = pug.renderFile("./login.pug");
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(content);
    response.end();
}


// トップページの処理
function responseIndex(request, response) {
    if (request.method === "POST") {　// POSTだったらメッセージの投稿を受付
        let body = "";

        // データの受信イベントの処理
        request.on("data", (data) => {
            body += data;
        });

        //　リクエスト完了時のイベント処理
        request.on("end", () => {
            const data = qs.parse(body);
            addToData(data.id, data.msg, filename,);
            writeIndex(request, response);
        });
    } else {// POSTではなかったら単なる表示
        writeIndex(request, response);
    }
}

// トップページのレンダリング処理
function writeIndex(request, response) {
    const msg = "なにかメッセージを書いてください";
    const content = pug.renderFile("./index.pug", {
        title: "Index",
        content: msg,
        data: messageData,
    });
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(content);
    response.end();
}

// メッセージデータを指定のファイルから読み込んで
/**
 *
 * @param filename
 * @param {string} filename
 */
function readFromFile(filename) {
    fs.readFile(filename, "utf-8", (err, data) => {
        if (data.length === 0) {
            messageData = [];
        } else {
            messageData = JSON.parse(data);
        }
    });
}


/**
 *
 * @param {string} id
 * @param {string} msg
 * @param {string} filename
 * @param {IncomingMessage} request
 */
function addToData(id, msg, filename) {
    const obj = {id,msg}; //　省略記法
    const json = JSON.stringify(obj);　// オブジェクトをJSON文字列へ変換
    console.log(`add data: ${obj}`);　// コンソールに出してみる
    messageData.unshift(obj); // messageDataはArrayらしいので、末尾に追加
    if (messageData.length > maxNum) {　// 投稿データの最大数を超えたら・・・
        messageData.pop(); // 先頭から１個データを取り出す。
    }
    saveToFile(filename) // 保存処理を呼び出し
}

/**
 *
 * @param {string} filename
 */
function saveToFile(filename) {
    const data = JSON.stringify(messageData);
    fs.writeFile(filename, data, (err) => {
        if (err) {
            throw err;
        }
    })
}