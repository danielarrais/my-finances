import React from 'react';
import {useState} from "react";
import {Meteor} from "meteor/meteor";
import {Checkbox} from "/imports/ui/components/checkbox";
import {Input} from "/imports/ui/components/input";
import {Label} from "/imports/ui/components/label";
import {Button} from "/imports/ui/components/button";
import {GithubIcon, Link, TwitterIcon} from "lucide-react";

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submit = (e) => {
        e.preventDefault();
        Meteor.loginWithPassword(email.trim(), password, (error) => {
            if (error) {
                alert("Credenciais inválidas. Tente novamente.");
            } else {
                alert("Usuário logado")
            }
        })
    }

    return (
        <div className="flex min-h-[760px] w-full">
            <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <h2 className="mt-6 text-center text-3xl font-bold">Login</h2>
                    <div className="mt-8 space-y-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="mt-1"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="mt-1"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="rememberMe" />
                                    <label
                                        htmlFor="rememberMe"
                                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <Link
                                        href="/forgot-password"
                                        className="text-primary hover:text-primary/90 font-medium">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <Button type="submit" className="w-full">
                                    Sign in
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}