
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "/imports/ui/components/form";
import { Input } from "/imports/ui/components/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "/imports/ui/components/select";
import { Button } from "/imports/ui/components/button";
import { Meteor } from "meteor/meteor";

const TransactionType = Object.freeze({
    INCOME: "INCOME",
    EXPENSE: "EXPENSE",
});

const transactionSchema = z.object({
    description: z.string().min(2, "Descrição muito curta"),
    amount: z.string().refine((v) => !Number.isNaN(parseFloat(v)), "Valor deve ser numérico"),
    type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE]),
});

export const TransactionForm = () => {
    const form = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            description: "",
            amount: "",
            type: TransactionType.EXPENSE,
        },
        mode: "onChange",
    });

    const saveTransaction = (values) => {
        const userId = Meteor.userId();
        if (!userId) {
            alert("You must be logged in.");
            return;
        }

        const amountNumber = parseFloat(values.amount);

        Meteor.call(
            "transactions.insert",
            {
                description: values.description.trim(),
                type: values.type,
                amount: amountNumber,
                date: new Date(),
            },
            (error) => {
                if (error) {
                    alert(error.reason || error.message);
                    return;
                }
                form.reset();
            }
        );
    };

    return (
        <div className=" mx-auto">
            <div className="rounded-2xl border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                    <h3 className="text-xl font-semibold tracking-tight">Nova Transação</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Preencha os campos abaixo para registrar uma entrada ou despesa.
                    </p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(saveTransaction)} className="mt-6 space-y-6">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Mercado, Uber, etc."
                                                autoComplete="off"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Valor</FormLabel>
                                            <FormControl>
                                                <Input
                                                    inputMode="decimal"
                                                    placeholder="0.00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo</FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o tipo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={TransactionType.EXPENSE}>Despesa (-)</SelectItem>
                                                        <SelectItem value={TransactionType.INCOME}>Entrada (+)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => form.reset()}
                                    className="cursor-pointer"
                                >
                                    Limpar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!form.formState.isValid}
                                    className="cursor-pointer"
                                >
                                    Inserir
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};
