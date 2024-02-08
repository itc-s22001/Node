"use client"

import {useState, useEffect} from "react";
import axios from "axios";
import {requests} from "../../../request";

const SignupPage =  () => {
    // // ログインフォームの状態管理
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState(null);

    // useEffect(() => {
    //     const fetchData = async () =>{
    //         try {
    //             const response = await axios.get(requests.SIGNUP);
    //             const result =  response.data.name// データの指定
    //             setData(result);
    //         } catch (error) {
    //             console.log('Error fetching data:', error);
    //         }
    //     };
    //     // fetchData();
    // },[]);

    const nameChange = (event) => {
        setUsername(event.target.value)
        console.log(event.target.value)
    };
    const passChange = (event) => {
        setPassword(event.target.value)
        console.log(event.target.value)
    };

    const sig = async () => {
        try {
            const response = await axios.post(requests.SIGNUP, {
                name: username,
                password: password,
            });
            console.log(response.data);
        } catch (error) {
            console.error('エラーが発生しました:', error.response ? error.response.data : error.message);
        }
    };


    return (
        <div>
            <h1>API Data:</h1>
            {/*{data ? (*/}
            {/*    <pre>{JSON.stringify(data)}</pre>*/}
            {/*) : (*/}
            {/*    <p>Loading data...</p>*/}
            {/*)}*/}
            <h1>名前</h1>
            <input type="text" value={username} onChange={(e) => nameChange(e)}/>
            <h1>パスワード</h1>
            <input type="password" value={password} onChange={passChange}/><br/>
            <button onClick={sig}>登録</button>
        </div>
    );

    // return (
    //     <div>
    //         <h1>Login Page</h1>
    //         <form>
    //             <label>
    //                 Username:
    //                 <input type="text"/>
    //             </label>
    //             <br/>
    //             <label>
    //                 Password:
    //                 <input type="text"/>
    //             </label>
    //             <br/>
    //             <button type="button" onClick="">Login</button>
    //         </form>
    //     </div>
    // );
};

export default SignupPage;


