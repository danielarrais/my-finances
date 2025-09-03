import React, {Fragment} from "react";
import {TransactionList} from "/imports/ui/transaction/TransactionList";
import {TransactionForm} from "/imports/ui/transaction/TransactionForm";

export const TransactionPage = () => {
    return (
        <Fragment>
            <TransactionForm/>
            <TransactionList/>
        </Fragment>
    )
}