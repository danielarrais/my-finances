import React from "react";
import {Meteor} from "meteor/meteor";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "/imports/ui/components/table";
import {TransactionsCollection} from "/imports/api/TransactionsCollection";
import {useTracker} from "meteor/react-meteor-data";

const BRL = new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL"});
const DMY = new Intl.DateTimeFormat("pt-BR", {year: "numeric", month: "2-digit", day: "2-digit"});

const TRANSACTION_TYPE = {
    INCOME: "INCOME",
    EXPENSE: "EXPENSE",
};

export const TransactionList = () => {
    const {isReady, transactions} = useTracker(() => {
        const emptyResult = {transactions: []}
        const sub = Meteor.subscribe("transactions.list");
        const isReady = sub.ready();

        if (!isReady) {
            return {...emptyResult, isReady: true};
        }

        const transactions = TransactionsCollection.find({}, {sort: {date: -1}}).fetch();
        return {isReady, transactions};
    }, []);

    if (!isReady) {
        return <p>Carregando...</p>;
    }

    if (transactions.length === 0) {
        return (
            <div className="mx-auto">
                <div className="rounded-2xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold tracking-tight">Transações</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Você ainda não cadastrou nenhuma transação.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className=" mx-auto">
            <div className="rounded-2xl border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                    <h3 className="text-xl font-semibold tracking-tight">Transaçoes</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Descrição</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead className="text-right ">Valor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((t) => {
                                const isIncome = t.type === TRANSACTION_TYPE.INCOME;
                                const date = t.date ? new Date(t.date) : null;
                                return (
                                    <TableRow key={t._id}>
                                        <TableCell className="font-medium">{t.description}</TableCell>
                                        <TableCell className={isIncome ? "text-green-600" : "text-red-600"}>
                                            {isIncome ? "Entrada" : "Despesa"}
                                        </TableCell>
                                        <TableCell>{date ? DMY.format(date) : "-"}</TableCell>
                                        <TableCell
                                            className={isIncome ? "text-right text-green-600" : "text-right text-red-600"}>
                                            {isIncome ? "+" : "-"} {BRL.format(Math.abs(Number(t.amount) || 0))}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};
