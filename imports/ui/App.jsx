import React from 'react';
import {useTracker} from 'meteor/react-meteor-data';
import {Meteor} from "meteor/meteor";
import {LoginForm} from "./users/LoginForm";
import SidebarLayout from "./AppMenu";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {MAIN_MENU, MENUS} from "/imports/ui/constant/menus";

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
                <Route element={<SidebarLayout/>}>
                    <Route index element={<Navigate to={MAIN_MENU.href} replace/>}/>
                    {MENUS.map(({href, element}) => (
                        <Route path={href} element={element}/>
                    ))}
                </Route>
            </Routes>
        </BrowserRouter>
    )
};
