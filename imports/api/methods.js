import {Meteor} from "meteor/meteor";
import {check, Match} from "meteor/check";
import {TransactionsCollection} from "/imports/api/TransactionsCollection";
import {FixedTransactionsCollection} from "/imports/api/FixedTransactionsCollection";

Meteor.methods({
    async 'transactions.insert'({description, amount, type, date}) {
        check(description, String);
        check(amount, Number);
        check(type, Match.OneOf("INCOME", "EXPENSE"));
        check(date, Date);

        if (!this.userId) throw new Meteor.Error('not-authorized');

        return await TransactionsCollection.insertAsync({
            description,
            amount,
            type,
            date,
            userId: this.userId,
            createdAt: new Date(),
        })
    },
    async 'transactions.update'({id, description, amount, type, date}) {
        check(id, String);
        check(description, String);
        check(amount, Number);
        check(type, Match.OneOf("INCOME", "EXPENSE"));
        check(date, Date);

        if (!this.userId) throw new Meteor.Error('not-authorized');

        const transaction = await TransactionsCollection.findOneAsync({_id: id, userId: this.userId})

        if (!transaction) throw new Meteor.Error("not-found", "Transação não encontrada.");

        return await TransactionsCollection.updateAsync(
            {_id: id, userId: this.userId},
            {
                $set: {
                    description,
                    amount,
                    type,
                    date,
                    updatedAt: new Date()
                }
            });
    },
    async 'transactions.remove'(id) {
        check(id, String);

        if (!this.userId) throw new Meteor.Error('not-authorized');

        const transaction = await TransactionsCollection.findOneAsync({_id: id, userId: this.userId})

        if (!transaction) throw new Meteor.Error("not-found", "Transação não encontrada.");

        const result = await TransactionsCollection.removeAsync({_id: id, userId: this.userId});

        if (result === 0) {
            throw  new Meteor.Error("delete-failed", "Nada foi removido")
        }

        return result;
    },
    async 'fixed_transactions.insert'({description, amount, type, monthDay}) {
        check(description, String);
        check(amount, Number);
        check(type, Match.OneOf("INCOME", "EXPENSE"));
        check(monthDay, Number);

        if (!this.userId) throw new Meteor.Error('not-authorized');

        return await FixedTransactionsCollection.insertAsync({
            description,
            amount,
            type,
            monthDay,
            userId: this.userId,
            createdAt: new Date(),
        })
    },
    async 'fixed_transactions.update'({id, description, amount, type, monthDay}) {
        check(id, String);
        check(description, String);
        check(amount, Number);
        check(type, Match.OneOf("INCOME", "EXPENSE"));
        check(monthDay, Number);

        if (!this.userId) throw new Meteor.Error('not-authorized');

        const transaction = await FixedTransactionsCollection.findOneAsync({_id: id, userId: this.userId})

        if (!transaction) throw new Meteor.Error("not-found", "Transação não encontrada.");

        return await FixedTransactionsCollection.updateAsync(
            {_id: id, userId: this.userId},
            {
                $set: {
                    description,
                    amount,
                    type,
                    monthDay,
                    updatedAt: new Date()
                }
            });
    },
})