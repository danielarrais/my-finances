import React from 'react';
import {useState} from "react";
import {Meteor} from "meteor/meteor";

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submit = (e) => {
        e.preventDefault();
        Meteor.loginWithPassword(email.trim(), password, (error) => {
            if (error) {
                alert("Credenciais inválidas. Tente novamente.");
            }
        })
    }

    return (
        <form onSubmit={submit} className="login-form">
            <h2>Entrar</h2>
            <label htmlFor="email">Email:</label>
            <input type="email"
                   name="email"
                   required={true}
                   onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Email:</label>
            <input type="password"
                   name="password"
                   required={true}
                   onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    )
}