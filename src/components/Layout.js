//top navbar with burger
//left drawer menu
//active component
//signup/login/forgot password is not in layout

import React from 'react';
import {Link} from "react-router-dom";
import {useAuth} from "../auth";

const Layout = ({children}) => {
    const auth = useAuth();

    const handleResetPassword = () => {
        auth.resetPassword(auth.user.email)
    }

    return (
        <div>
            <header>
                <ul>
                    <li><Link to={"/"}>App</Link></li>
                    <li><Link to={"/signup"}>Signup</Link></li>
                    <li><button onClick={handleResetPassword}>Reset Password</button></li>


                    {auth.user ?
                        <li>
                            <button onClick={auth.logout}>Logout</button>
                        </li>
                        :
                        <li><Link to={"/login"}>Login</Link></li>
                    }
                </ul>
            </header>

            <main>
                {children}
            </main>

        </div>
    );
};

export default Layout;