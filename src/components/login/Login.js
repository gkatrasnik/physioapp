//email/password login
//magic link login

import React, {useState} from 'react';
import Layout from "../Layout";
import {useAuth} from "../../auth";

const Login = () => {
    const auth = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")


    const handleSubmit = async (e) => {
        e.preventDefault()

        const signIn = await auth.login(email, password)

        if(signIn.error) {
            setMessage(signIn.error.message)
        } else {
            setMessage("Login successful")
        }

        setEmail("")
        setPassword("")
    }

    return (
        <Layout>
            {message && message}
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}/>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>

                <button type={"submit"}>Login</button>
            </form>
        </Layout>
    );
};

export default Login;