import React, {Fragment, useState} from 'react';
import {useTracker} from 'meteor/react-meteor-data';
import {Meteor} from "meteor/meteor";
import {ResgisterForm} from "./RegisterForm";
import {LoginForm} from "./LoginForm";

export const App = () => {
    const user = useTracker(() => Meteor.user());
    const [showRegister, setShowRegister] = useState(false);

    if (!user) {
        return (
            <div className="auth-container">
                {showRegister ? <ResgisterForm/> : <LoginForm/>}

                <button onClick={() => setShowRegister(!showRegister)}>
                    {showRegister ? "Já tem uma conta? Login" : "Não tem conta? Registre-se"}
                </button>
            </div>
        )
    }

    return (
        <Fragment>
            <header>
                <h1>Organizador Financeiro</h1>

                <button onClick={() => Meteor.logout()}>Sair</button>
            </header>

            <p>Bem-vindo, {user.emails?.[0]?.address}!</p>
        </Fragment>
    )
};
