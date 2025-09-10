import { Meteor } from "meteor/meteor";
import { TransactionsCollection } from "./TransactionsCollection";
import {FixedTransactionsCollection} from "/imports/api/FixedTransactionsCollection";

Meteor.publish("transactions.list", function () {
    if (!this.userId) {
        return this.ready();
    }

    return TransactionsCollection.find(
        { userId: this.userId },
        { sort: { date: -1 } }
    );
});

Meteor.publish("fixed_transactions.list", function () {
    if (!this.userId) {
        return this.ready();
    }

    return FixedTransactionsCollection.find(
        { userId: this.userId },
        { sort: { date: -1 } }
    );
});