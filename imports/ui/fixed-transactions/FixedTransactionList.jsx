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
import {useTracker} from "meteor/react-meteor-data";
import {FixedTransactionForm} from "/imports/ui/fixed-transactions/FixedTransactionForm";
import {Edit, SquarePlus, Trash2} from "lucide-react";
import {Button} from "/imports/ui/components/button";
import {cn} from "/imports/ui/lib/utils";
import {FixedTransactionsCollection} from "/imports/api/FixedTransactionsCollection";

const BRL = new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL"});

const TRANSACTION_TYPE = {
    INCOME: "INCOME",
    EXPENSE: "EXPENSE",
};

export const FixedTransactionList = () => {
    const [transactionEdit, setTransactionEdit] = useState();
    const [showForm, setShowForm] = useState(false);
    const {isReady, transactions} = useTracker(() => {
        const emptyResult = {transactions: []}
        const sub = Meteor.subscribe("fixed_transactions.list");
        const isReady = sub.ready();

        if (!isReady) {
            return {...emptyResult, isReady: true};
        }

        const transactionsResult = FixedTransactionsCollection.find({}, {sort: {monthDay: -1}}).fetch();
        const totalAmount = transactionsResult.reduce((acc, cur) => {
            if (cur.type === "INCOME") {
                return acc + cur.amount
            } else if (cur.type === "EXPENSE") {
                return acc - cur.amount
            }
        }, 0);

        const transactions = {
            list: transactionsResult,
            totalAmount: totalAmount,
            count: transactionsResult.length
        }

        return {isReady, transactions};
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

    const transactionRow = (transaction) => {
        const isIncome = transaction.type === TRANSACTION_TYPE.INCOME;
        return (
            <TableRow key={transaction._id}>
                <TableCell
                    className={cn("font-medium", isIncome ? "text-green-600" : "text-red-600")}>{transaction.description}{" "}({isIncome ? "+" : "-"})</TableCell>
                <TableCell>{transaction.monthDay}</TableCell>
                <TableCell
                    className={isIncome ? "text-right text-green-600" : "text-right text-red-600"}>
                    {isIncome ? "+" : "-"} {BRL.format(Math.abs(Number(transaction.amount) || 0))}
                </TableCell>
                <TableCell className="flex justify-end cursor-pointer">
                    <Edit className="text-blue-600" onClick={() => {
                        setTransactionEdit(transaction);
                    }}/>
                    <Trash2 className="text-red-600" onClick={() => {
                        deleteTransaction(transaction._id);
                    }}/>
                </TableCell>
            </TableRow>
        );
    }

    return (
        <Fragment>
            {(showForm || transactionEdit) && (
                <FixedTransactionForm key={transactionEdit?._id || "new"}
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
                            <h3 className="text-xl font-semibold tracking-tight">Transações Fixas</h3>
                            <span>
                                <Button variant="green" onClick={() => setShowForm(true)}>
                                    <SquarePlus size={25}/>
                                    Nova
                                </Button>
                            </span>
                        </div>
                        {transactions.count === 0 && (
                            <p className="text-sm text-muted-foreground mt-1">
                                Você ainda não cadastrou nenhuma transação fixa.
                            </p>
                        )}
                        {transactions.count > 0 && (
                            <Table>
                                <TableHeader className="text-bold">
                                    <TableRow>
                                        <TableHead className="w-[100px]">Descrição</TableHead>
                                        <TableHead>Dia do mês</TableHead>
                                        <TableHead className="text-right">Valor</TableHead>
                                        <TableHead className="text-right">Ação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.list.map(transactionRow)}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell>Total</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell
                                            className={transactions.totalAmount >= 0 ? "text-right text-green-600" : "text-right text-red-600"}>
                                            {BRL.format(Math.abs(Number(transactions.totalAmount) || 0))}
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};
