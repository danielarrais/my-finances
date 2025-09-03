import React from "react";
import {useState} from "react";
import {Accounts} from "meteor/accounts-base";

export const ResgisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submit = (e) => {
        e.preventDefault();

        Accounts.createUser({email: email.trim(), password}, (error) => {
            if (error) {
                alert(error.reason || "Falha no registro.");
            } else {
                alert("Usuário registrado com sucesso!");
            }
        });
    }

    return (
        <form onSubmit={submit} className="register-form">
            <h2>Criar conta</h2>
            <label htmlFor="email">Email:</label>
            <input type="email"
                   name="email"
                   required={true}
                   onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Senha:</label>
            <input type="password"
                   name="password"
                   required={true}
                   onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Registrar</button>
        </form>
    );
}