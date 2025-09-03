import { Meteor } from "meteor/meteor";
import { TransactionsCollection } from "./TransactionsCollection";

Meteor.publish("transactions.list", function () {
    if (!this.userId) {
        return this.ready();
    }

    return TransactionsCollection.find(
        { userId: this.userId },
        { sort: { date: -1 } }
    );
});