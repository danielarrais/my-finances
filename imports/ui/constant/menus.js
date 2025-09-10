import {ArrowDownCircle, PiggyBank, ShoppingCart} from "lucide-react";
import React, {Fragment} from "react";
import {TransactionPage} from "/imports/ui/transaction/TransactionPage";
import {FixedTransactionPage} from "/imports/ui/fixed-transactions/FixedTransactionPage";

export const MENUS = [
    {label: "Transações", icon: ArrowDownCircle, href: "/transacoes", element: <TransactionPage/>},
    {label: "Transações Fixas", icon: ArrowDownCircle, href: "/transacoes-fixas", element: <FixedTransactionPage/>},
    {label: "Economias", icon: PiggyBank, href: "/economias", element: <Fragment/>},
    {label: "Listas de compra", icon: ShoppingCart, href: "/listas", element: <Fragment/>},
];

export const MAIN_MENU = MENUS[0];