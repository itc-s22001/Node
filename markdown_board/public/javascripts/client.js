"use strict";
(() => {
    let userId = null;
    let documents = [];
    let title = "";
    let markdown = "";
    let content = "";
    let editId = 0;
    let isCreateMode = true;

    // 関数群
    /**
     * ログインのチェックとユーザ名の取得
     */
    const getUser = async () => {
        try {
            const res = await axios.get("/api/check");
            const data = res.data;
            userId = data.result;
        } catch (e) {
            // ユーザ情報が取れなかったので未ログインのはず
            window.location.href = "/users/login";
            return;
        }
        getAllData();
        refresh();
    };

    /**
     * 全 Markdown ドキュメントを取ってくる
     */
    const getAllData = async () => {
        const res = await axios.get("/api/all");
        documents = res.data.documents;
        refreshDocumentList();
    };

    /**
     * いくつか表示上の更新をするらしい
     */
    const refresh = () => {
        document.querySelector("#username").textContent = userId;
        document.querySelector("#title").value = title;
        document.querySelector("#text").value = markdown;
        document.querySelector("#content").innerHTML = content;
    };

    /**
     * ドキュメント一覧を更新するらしい
     */
    const refreshDocumentList = () => {
        let dataContainer = document.querySelector("#data_container");
        dataContainer.innerHTML = "";
        documents.map(markdown => {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            const a = document.createElement("a");
            a.classList.add("text-dark");
            a.setAttribute("href", "javascript:void(0);");
            a.dataset.documentId = markdown.id;
            a.textContent = markdown.title;
            a.addEventListener("click", getById);
            tr.appendChild(td);
            td.appendChild(a);
            dataContainer.appendChild(tr);
        });
    };

    const getById = async (event) => {
        try {
            const res = await axios.get(`/api/markdown/${event.target.dataset.documentId}`);
            const data = res.data.markdown;
            title = data.title;
            markdown = data.text;
            editId = data.id;
            isCreateMode = false;
            getRenderedMarkdown(data.text);
        } catch (e) {
            console.error(e);
        }
    };

    const getRenderedMarkdown = async (data) => {
        try {
            const res = await axios.post("/api/markdown/render", {
                data
            });
            content = res.data.render;
            refresh();
        } catch (e) {
            console.error(e);
        }
    };

    // 新規登録のリクエスト
    const create = async () => {
        try {
            const data = {
                title,
                text: markdown
            };
            await axios.post("/api/add", data);
            getAllData();
        } catch (e) {
            console.error(e);
        }
    };

    // データ更新
    const update = async () => {
        try {
            const data = {
                title,
                text: markdown,
                id: editId
            };
            await axios.put("/api/markdown/edit", data);
            getAllData();
        } catch (e) {
            console.error(e);
        }
    };

    // 送信ボタン押されたとき
    document.querySelector("#action")
        .addEventListener("click", (event) => {
            title = document.querySelector("#title").value;
            markdown = document.querySelector("#text").value;
            if (isCreateMode) {
                create();
            } else {
                update();
            }
        });

    // 初回ページ読み込み時の処理
    window.addEventListener("DOMContentLoaded", getUser);
})();