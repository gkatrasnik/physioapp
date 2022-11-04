import React, {useState} from 'react';
import Layout from "../Layout";
import {useAuth} from "../../auth";

const Signup = () => {
    const auth = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [message, setMessage] = useState("")


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== passwordConfirmation) {
            return setMessage("Password confirmation does not match")
        }

        const signIn = await auth.signup(email, password)

        if(signIn.error) {
            setMessage(signIn.error.message)
        } else {
            setMessage("Your account has been created,  please verify it by clicking the activation link that has been send to your email")
        }

        setEmail("")
        setPassword("")
        setPasswordConfirmation("")
    }

    return (
        <Layout>
            {message && message}
            <h1>Sign Up</h1>

            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}/>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
                <input type="password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)}/>
                <button type={"submit"}>Signup</button>
            </form>
        </Layout>
    );
};

export default Signup;