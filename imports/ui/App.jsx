import React, {Fragment} from 'react';
import {useTracker} from 'meteor/react-meteor-data';
import {Meteor} from "meteor/meteor";
import {LoginForm} from "./users/LoginForm";
import SidebarLayout from "./AppMenu";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {TransactionPage} from "/imports/ui/transaction/TransactionPage";

export const App = () => {
    const user = useTracker(() => {
        console.log("Chamou o use tracker 'Meteor.user()'")
        return Meteor.user();
    });

    if (!user) {
        return (
            <LoginForm/>
        )
    }

    return (
        // <Fragment>
        //     <SidebarLayout>
        //         <TransactionForm />
        //     </SidebarLayout>
        //
        // </Fragment>
        <BrowserRouter>
            <Routes>
                <Route element={<SidebarLayout />}>
                    <Route index element={<Navigate to="/entradas" replace />} />
                    <Route path="/entradas" element={<TransactionPage />} />
                    <Route path="/saidas" element={<Fragment />} />
                    <Route path="/economias" element={<Fragment />} />
                    <Route path="/listas" element={<Fragment />} />
                    <Route path="*" element={<Fragment />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
};
