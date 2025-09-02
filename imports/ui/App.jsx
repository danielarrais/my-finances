import React, {Fragment} from 'react';
import {useTracker} from 'meteor/react-meteor-data';
import {Meteor} from "meteor/meteor";
import {LoginForm} from "./LoginForm";
import SidebarLayout from "./AppMenu";

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
        <Fragment>
            <SidebarLayout>
                <p>Bem-vindo, {user.emails?.[0]?.address}!</p>
            </SidebarLayout>

        </Fragment>
    )
};
