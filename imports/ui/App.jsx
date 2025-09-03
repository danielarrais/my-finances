import React, {Fragment} from 'react';
import {useTracker} from 'meteor/react-meteor-data';
import {Meteor} from "meteor/meteor";
import {LoginForm} from "./users/LoginForm";
import SidebarLayout from "./AppMenu";
import {TransactionForm} from "/imports/ui/transaction/TransactionForm";

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
                <TransactionForm />
            </SidebarLayout>

        </Fragment>
    )
};
