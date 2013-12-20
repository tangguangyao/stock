var Money = function(options) {
    this.amount = options.amount || 0;
    this.template = options.template || "{symbol}{amount}";
    this.symbol = options.symbol || "$";
};
Money.prototype = {
    add: function(toAdd) {
        this.amount += toAdd;
    },
    toString: function() {
        return this.template
            .replace("{symbol}", this.symbol)
            .replace("{amount}", this.amount)
    }
};
Money.euro = function(amount) {
    return new Money({
        amount: amount,
        template: "{amount} {symbol}",
        symbol: "EUR"
    });
};