"use client"

import {useState, useEffect} from "react";
import axios from "axios";
import {requests} from "../../request";

const LoginPage =  () => {
    // // ログインフォームの状態管理
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () =>{
            try {
                const response = await axios.get();
                const result =  response.data.name// データの指定
                console.log(result);
                setData(result);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };
        fetchData();

    },[]);

    return (
        <div>
            <h1>API Data:</h1>
            {data ? (
                <pre>{JSON.stringify(data)}</pre>
            ) : (
                <p>Loading data...</p>
            )}
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

export default LoginPage;