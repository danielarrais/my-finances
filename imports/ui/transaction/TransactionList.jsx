import React, {Fragment, useState} from "react";
import {Meteor} from "meteor/meteor";
import {
    Table,
    TableBody,
    TableCell, TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "/imports/ui/components/table";
import {TransactionsCollection} from "/imports/api/TransactionsCollection";
import {useTracker} from "meteor/react-meteor-data";
import {TransactionForm} from "/imports/ui/transaction/TransactionForm";
import {Edit, SquarePlus, Trash2} from "lucide-react";
import {Button} from "/imports/ui/components/button";
import {cn} from "/imports/ui/lib/utils";

const BRL = new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL"});
const DMY = new Intl.DateTimeFormat("pt-BR", {year: "numeric", month: "2-digit", day: "2-digit"});

const TRANSACTION_TYPE = {
    INCOME: "INCOME",
    EXPENSE: "EXPENSE",
};

export const TransactionList = () => {
    const [transactionEdit, setTransactionEdit] = useState();
    const [showForm, setShowForm] = useState(false);
    const {isReady, transactions, totalAmount} = useTracker(() => {
        const emptyResult = {transactions: []}
        const sub = Meteor.subscribe("transactions.list");
        const isReady = sub.ready();

        if (!isReady) {
            return {...emptyResult, isReady: true};
        }

        const transactions = TransactionsCollection.find({}, {sort: {date: -1}}).fetch();
        const totalAmount = transactions.reduce((acc, cur) => {
            if (cur.type === "INCOME") {
                return acc + cur.amount
            } else if (cur.type === "EXPENSE") {
                return acc - cur.amount
            }
        }, 0);

        return {isReady, transactions, totalAmount};
    }, []);


    const deleteTransaction = (id) => {
        Meteor.call("transactions.remove", id, (error) => {
            if (error) {
                alert(error.reason || error.message);
            }
        })
    }

    if (!isReady) {
        return <p>Carregando...</p>;
    }

    if (transactions.length === 0) {
        return (
            <div className="mx-aut">
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
        <Fragment>
            {(showForm || transactionEdit) && (
                <TransactionForm key={transactionEdit?._id || "new"}
                                 transaction={transactionEdit}
                                 onCancel={() => {
                                     setTransactionEdit(null)
                                     setShowForm(false);
                                 }}
                                 onReset={() => {
                                     setTransactionEdit(transactionEdit);
                                 }}/>
            )}

            <div className=" mx-auto">
                <div className="rounded-2xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6">
                        <div className="flex w-full justify-between mb-4">
                            <h3 className="text-xl font-semibold tracking-tight">Transações</h3>
                            <span>
                                <Button variant="green" onClick={() => {
                                    setShowForm(true)
                                }}>
                                    <SquarePlus size={25}/>
                                    Nova
                                </Button>
                            </span>
                        </div>
                        <Table>
                            <TableHeader className="text-bold">
                                <TableRow>
                                    <TableHead className="w-[100px]">Descrição</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                    <TableHead className="text-right">Ação</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((t) => {
                                    const isIncome = t.type === TRANSACTION_TYPE.INCOME;
                                    const date = t.date ? new Date(t.date) : null;
                                    return (
                                        <TableRow key={t._id}>
                                            <TableCell className={cn("font-medium", isIncome ? "text-green-600" : "text-red-600")}>{t.description}{" "}({isIncome ? "+" : "-"})</TableCell>
                                            <TableCell>{date ? DMY.format(date) : "-"}</TableCell>
                                            <TableCell
                                                className={isIncome ? "text-right text-green-600" : "text-right text-red-600"}>
                                                {isIncome ? "+" : "-"} {BRL.format(Math.abs(Number(t.amount) || 0))}
                                            </TableCell>
                                            <TableCell className="flex justify-end cursor-pointer">
                                                <Edit className="text-blue-600" onClick={() => {
                                                    setTransactionEdit(t);
                                                }}/>
                                                <Trash2 className="text-red-600" onClick={() => {
                                                    deleteTransaction(t._id);
                                                }}/>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell>Total</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell
                                        className={totalAmount >= 0 ? "text-right text-green-600" : "text-right text-red-600"}>
                                        {BRL.format(Math.abs(Number(totalAmount) || 0))}
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};
