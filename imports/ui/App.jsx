import React, {Fragment} from 'react';
import {useTracker} from 'meteor/react-meteor-data';
import {Meteor} from "meteor/meteor";
import {LoginForm} from "./users/LoginForm";
import SidebarLayout from "./AppMenu";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {TransactionPage} from "/imports/ui/transaction/TransactionPage";

export const App = () => {
    const user = useTracker(() => {
        return Meteor.user();
    });

    if (!user) {
        return (
            <LoginForm/>
        )
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<SidebarLayout />}>
                    <Route index element={<Navigate to="/transacoes" replace />} />
                    <Route path="/transacoes" element={<TransactionPage />} />
                    <Route path="/economias" element={<Fragment />} />
                    <Route path="/listas" element={<Fragment />} />
                    <Route path="*" element={<Fragment />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
};
