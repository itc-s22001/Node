"use client"

import {useState, useEffect} from "react";
import axios from "axios";
import {requests} from "../../request";
import {redirect} from "next/navigation";
import {useRouter} from "next/navigation";
import Link from "next/link";



const HomePage = () => {
    // // ログインフォームの状態管理
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter()


    useEffect(() => {

    }, []);

    const nameChange = (event) => {
        setUsername(event.target.value)
        console.log(event.target.value)
    };
    const passChange = (event) => {
        setPassword(event.target.value)
        console.log(event.target.value)
    };

    const log = async () => {
        try {
            const response = await axios.post(requests.LOGIN, {
                name: username,
                password: password
            });
            console.log(response.data.message);
            router.push(`http://localhost:3000`)
        } catch (error) {
            console.log('エラー発生!!:', error);
        }
    };

    const logout = () => {
        const result = axios.get("/logout", (req, res, next) => {
            req.logout((err) => {
                if (err) {
                    return next(err);
                }
                router.push(`http://localhost:3000`)
            });
        });
    }




    return (
        <div>
            <h1>API Data:</h1>
            <h1>名前</h1>
            <input type="text" value={username} onChange={(e) => nameChange(e)}/>
            <h1>パスワード</h1>
            <input type="password" value={password} onChange={passChange}/>
            <button onClick={log}>ログイン</button>
            <br/>
            <Link href="/signup/">新規の方はこちらへ</Link>
            <button onClick={logout}>ログアウト</button>
        </div>
    );
};

export default HomePage;
