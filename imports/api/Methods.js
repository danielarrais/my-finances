import {Meteor} from "meteor/meteor";
import {check, Match} from "meteor/check";
import {TransactionsCollection} from "/imports/api/TransactionsCollection";

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
    }
})