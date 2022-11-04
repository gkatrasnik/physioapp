import React, {useState} from 'react';
import Layout from "../Layout";
import {useAuth} from "../../auth";

const UpdatePassword = () => {
    const auth = useAuth()
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [message, setMessage] = useState("")


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== passwordConfirmation) {
            return setMessage("Password confirmation does not match")
        }

        const passwordReset = await auth.updatePassword(password)            

        if(passwordReset.error) {
            setMessage(passwordReset.error.message)
        } else {
            setMessage("Your password was updated successfuly")
        }

        setPassword("")
        setPasswordConfirmation("")
    }

    return (
        <Layout>
            {message && message}
            <h1>Update Password</h1>

            <form onSubmit={handleSubmit}>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
                <input type="password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)}/>
                <button type={"submit"}>Update Password</button>
            </form>
        </Layout>
    );
};

export default UpdatePassword;