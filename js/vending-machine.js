/*
* Vending Machine
* Version: 1.0 
* Date Created   : 10/10/2013
* Last Changed   : 10/10/2013
* Author         : Chris Asteriou
  Email          : chris@digitalbliss.uk.com
*
* all coins accepted
* always sufficient coins to return
*
* coins defined here so they can be used by both the 
* vending machine and UI code. 
*
*/

var coins = {
    TWO_POUNDS: {
        name: "two pounds",
        value: 2.00
    },
    ONE_POUND: {
        name: "one pound",
        value: 1.00
    },
    FIFTY_PENCE: {
        name: "fifty pence",
        value: 0.50
    },
    TWENTY_PENCE: {
        name: "twenty pence",
        value: 0.20
    },
    TEN_PENCE: {
        name: "ten pence",
        value: 0.10
    },
    FIVE_PENCE: {
        name: "five pence",
        value: 0.05
    },
    TWO_PENCE: {
        name: "two pence",
        value: 0.02
    },
    PENCE: {
        name: "one penny",
        value: 0.01
    }
};

// Vending Machine Object Constructor
function VendingMachine() {

    // our items
    this.products = {
        chips: {
            code: "A1",
            price: 1.00,
            count: 4,
            maximum: 4,
            title: "A pack of chips"
        },
        snickers: {
            code: "A2",
            price: 1.15,
            count: 4,
            maximum: 4,
            title: "Snickers"
        },
        mars: {
            code: "B1",
            price: 0.50,
            count: 4,
            maximum: 4,
            title: "Mars Bar"
        },
        coke: {
            code: "B2",
            price: 0.90,
            count: 4,
            maximum: 4,
            title: "Coca Cola"
        }
    };

    //array containing user inserted coins     
    this.userInsertedCoins = [];

    //this is our display defaults to INSERT COINS
    this.display = "";
    this.updateDisplay();

    return this;
};

// Update the display and the stock levels.
VendingMachine.prototype.updateDisplay = function() {
    //if the user has put in coins display their value else the default message
    if (this.getUserCoinValue() > 0) {
        this.display = "£" + this.getUserCoinValue();
    } else {
        this.display = "INSERT COINS"
    }
    $("#digital-display").text(this.display);

    //go through the items in and update their stock level
    for (item in this.products) {
        var id = "#" + this.products[item].code + " .stock";
        $(id).text(this.products[item].count);
    }

};

// Refils all items to their maximum.
VendingMachine.prototype.reStock = function() {
    for (item in this.products) {
        if (this.products[item].count < this.products[item].maximum) {
            this.products[item].count = this.products[item].maximum;
        }
    }
    this.updateDisplay();
};

// Ejects the item specified by the input code,
VendingMachine.prototype.ejectItem = function(itemCode) {
    var item = this.getItem(itemCode);

    if (item.count > 0) {
        item.count -= 1;
        return item;
    }
};

// Convenienvce method, returns the corresponding 
// item based on the input code, null if no match is made.
VendingMachine.prototype.getItem = function(itemCode) {

    for (item in this.products) {
        if (this.products[item].code === itemCode) {
            return this.products[item];
        }
    }
    return null;
};

// Logic that executes when the user selects an item code
VendingMachine.prototype.inputCode = function(itemCode) {
    //get the item using its code
    var item = this.getItem(itemCode);

    //if an item was returned and it is in stock
    if (item !== null && item.count > 0) {
        //and its price matches or is less than the inserted coin value
        if (item.price <= this.getUserCoinValue()) {
            //return the item
            $("#item-returned").append(this.ejectItem(itemCode).title + "<br/>");
            //and the change
            return this.dispenseChange(itemCode);
        }
    }
};

// Returns the correct change as an array containing coins.
// Uses a greedy alogrithm to determine the change.
VendingMachine.prototype.dispenseChange = function(itemCode) {
    var item = this.getItem(itemCode);
    var change = this.getUserCoinValue() - item.price;
    var coinsToReturn = [];

    //go through the available coins
    for (coin in coins) {
        //if you still have to give change
        if (change > 0) {
            //and the coin you have selected does not return a negative value  
            while (change - coins[coin].value.toFixed(2) >= 0) {
                //add it to the coins to return
                coinsToReturn.push(coins[coin])
                change = change - coins[coin].value;
            }
        }

    }
    this.userInsertedCoins = [];
    this.updateDisplay();
    return coinsToReturn;
};

// Go through the coins to calculate their value and return 
// that value.
VendingMachine.prototype.getUserCoinValue = function() {
    var totalCoinValue = 0.00;
    for (coin in this.userInsertedCoins) {
        totalCoinValue += this.userInsertedCoins[coin].value;
    }
    return totalCoinValue.toFixed(2);
};

// Add a coin to the vending machine.
VendingMachine.prototype.insertCoin = function(coin) {
    this.userInsertedCoins.push(coin);
    this.updateDisplay();
};

// Returns the coins that the user entered.
VendingMachine.prototype.ejectMoney = function() {
    var ejectedMoney = this.userInsertedCoins;
    this.userInsertedCoins = [];
    this.updateDisplay();
    return ejectedMoney;
};


// Here we bind the UI elements to the VendingMachine methods.
// I tried to keep these separate for reusability but some things
// in the UI are updated directly from the Vending Machine, ideally
// I would have achieved that using callback functions.
$(window).ready(function() {
    window.vendingMachine = new VendingMachine();

    //bind clicking on the codes
    $(".input-code").click(function() {
        var change = vendingMachine.inputCode($(this).text());
        var amount = 0.00;
        var coins = "";
        for (i in change) {
            amount += change[i].value;
            coins = coins + change[i].name + "<br/>";
        }
        $("#change").empty().append("£" + amount.toFixed(2) + "<br/>").append(coins);
    });

    //clicking on the coins adds them to the machine.
    $(".coin").click(function() {
        vendingMachine.insertCoin(coins[$(this).attr("data")]);
    });

    //bind clicking on the codes.
    $("#eject").click(function() {
        var change = vendingMachine.ejectMoney();
        var amount = 0;
        var coins = "";
        for (coin in change) {
            amount += change[coin].value;
            coins = coins + change[coin].name + "<br/>";
        }
        $("#change").empty().append("£" + amount.toFixed(2) + "<br/>").append(coins);

    });

    // clicking on restock refiils the machine.
    $("#restock").click(function() {
        vendingMachine.reStock();
    });
});