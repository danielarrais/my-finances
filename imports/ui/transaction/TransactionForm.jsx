import React, {useEffect} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "/imports/ui/components/form";
import {Input} from "/imports/ui/components/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "/imports/ui/components/select";
import {Button} from "/imports/ui/components/button";
import {Meteor} from "meteor/meteor";
import {Calendar} from "/imports/ui/components/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "/imports/ui/components/popover";
import {ChevronDownIcon} from "lucide-react";
import {format} from "date-fns";

const TransactionTypes = Object.freeze({
    INCOME: "INCOME",
    EXPENSE: "EXPENSE",
});

const transactionSchema = z.object({
    description: z.string().min(2, "Descrição muito curta"),
    amount: z.string().trim().min(1, "Informe um valor").refine(
        v => /^-?\d+(?:[.,]\d+)?$/.test(v),
        "Use apenas números (e opcional , ou .)"
    ).transform(v => parseFloat(v.replace(",", "."))),
    type: z.enum(Object.values(TransactionTypes), "Tipo de transação invalido"),
    date: z.date()
});

export const TransactionForm = ({transaction = null, onCancel, onReset}) => {
    const [open, setOpen] = React.useState(false)
    const form = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            description: "",
            amount: "",
            type: TransactionTypes.EXPENSE,
            date: new Date()
        },
        mode: "onChange",
        reValidateMode: "onChange",
    });

    const saveTransaction = (values) => {
        const userId = Meteor.userId();
        if (!userId) {
            alert("You must be logged in.");
            return;
        }

        const amountNumber = parseFloat(values.amount);

        if (!transaction) {
            Meteor.call(
                "transactions.insert",
                {
                    description: values.description.trim(),
                    type: values.type,
                    amount: amountNumber,
                    date: new Date(values.date),
                },
                (error) => {
                    if (error) {
                        alert(error.reason || error.message);
                        return;
                    }
                    reset();
                }
            );
            return;
        }

        Meteor.call(
            "transactions.update",
            {
                id: transaction._id,
                description: values.description.trim(),
                type: values.type,
                amount: amountNumber,
                date: new Date(values.date)
            },
            (error) => {
                if (error) {
                    alert(error.reason || error.message);
                    return;
                }
                reset();
            }
        );
    };

    useEffect(() => {
        if (transaction) {
            form.reset({
                description: transaction.description,
                amount: String(transaction.amount),
                type: transaction.type,
            });
        } else {
            form.reset();
        }
    }, [transaction]);

    const reset = () => {
        onReset();
        form.reset();
    }

    return (
        <div className="mb-4 mx-auto">
            <div className="rounded-2xl border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                    <h3 className="text-xl font-semibold tracking-tight">Nova Transação</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Preencha os campos abaixo para registrar uma entrada ou despesa.
                    </p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(saveTransaction)} className="mt-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Descrição</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Mercado, Uber, etc."
                                                    autoComplete="off"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Data</FormLabel>
                                            <FormControl>
                                                <Popover open={open} onOpenChange={setOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            id="date"
                                                            className="w-48 justify-between font-normal"
                                                        >
                                                            {field.value ? format(field.value, "dd/MM/yyyy") : "Select date"}
                                                            <ChevronDownIcon/>
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto overflow-hidden p-0"
                                                                    align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            className="rounded-lg border"
                                                            {...field}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    pattern="^-?\d*([.,]\d+)?$"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Valor</FormLabel>
                                            <FormControl>
                                                <Input
                                                    inputMode="decimal"
                                                    placeholder="0.00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Tipo</FormLabel>
                                            <FormControl>
                                                <Select key={field.value}
                                                        value={field.value}
                                                        onValueChange={field.onChange}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o tipo"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={TransactionTypes.EXPENSE}>Despesa
                                                            (-)</SelectItem>
                                                        <SelectItem value={TransactionTypes.INCOME}>Entrada
                                                            (+)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    className="cursor-pointer"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={reset}
                                    className="cursor-pointer"
                                >
                                    Limpar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!form.formState.isValid}
                                    className="cursor-pointer"
                                >
                                    {transaction ? "Salvar" : "Inserir"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};
