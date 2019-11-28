// let addBtn = document.querySelector('.add__btn');

// BUDGET CONTROLLER
let budgetController = (function () {

    //-------------------- CONSTRUCTORS -----------------------
    const expenseCreate = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const incomeCreate = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // -------------- OBJECT OF ARRAYS -----------------------
    let dataBudget = {
        allItems: {
            exp: [],
            inc: [],
        },
        totalItem: {
            exp: 0,
            inc: 0,
        }
    };

    return {
        addItem: function (type, des, val) {
            let newItem, ID;

            // Create new ID
            // increment 1 by 1 when it's adding a new item in exp or inc depending the type
            if (dataBudget.allItems[type].length > 0) {
                ID = dataBudget.allItems[type][dataBudget.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Crate new item based on inc or exp
            if (type === 'exp') {
                newItem = new expenseCreate(ID, des, val);
            } else if (type === 'inc'){
                newItem = new incomeCreate(ID, des, val);
            }

            // push into the structure array
            dataBudget.allItems[type].push(newItem);

            return newItem;
        },
        testing: function () { //just to show the content of this object nothing more
            console.log(dataBudget);
        }
    }
})();

// USER INTERFACE CONTROLLER DOM
let UIController = (function () {
    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtnAdd: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
    };

    return {
      getInput: function () {
          return {
              type: document.querySelector(DOMStrings.inputType).value, //inc or exp
              description: document.querySelector(DOMStrings.inputDescription).value,
              value: document.querySelector(DOMStrings.inputValue).value,
          };
      },
        getDOMStrings: function () {
            return DOMStrings;
        },
        addListItem: function (obj, type) {
            let html, element, newHTML;
            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMStrings.expensesContainer;
                html =
                    '<div class="item clearfix" id="income-%id%">' +
                        '<div class="item__description">%description%</div>' +
                        '<div class="right clearfix">' +
                            '<div class="item__value">+ %value%</div>' +
                            '<div class="item__delete">' +
                                '<button class="item__delete--btn">' +
                                    '<i class="ion-ios-close-outline"></i>' +
                                '</button>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
            } else if (type === 'exp') {
                element = DOMStrings.incomeContainer;
                html =
                    '<div class="item clearfix" id="expense-%id%">\n' +
                        '<div class="item__description">%description%</div>\n' +
                        '<div class="right clearfix">\n' +
                            '<div class="item__value">- %value%</div>\n' +
                            '<div class="item__percentage">21%</div>\n' +
                            '<div class="item__delete">\n' +
                                '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                            '</div>\n' +
                        '</div>\n' +
                    '</div>'
            }

            // Replace the placeholder text with some actual data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);

            // Insert the HTML into de DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
        }
    };
})();

// GLOBAL APP CONTROLLER
let controllersPublic = (function (budgetCtrl, UICtrl) {
    // ----------------------- GENERAL ACTIONS FROM FUNCTIONS -----------------------------------
    // It's important to invoke this function outside so we can use the Event Listener.
    let setupEventListeners = function() {
        let DOMStrings = UICtrl.getDOMStrings();

        document.querySelector(DOMStrings.inputBtnAdd).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13 || e.key === 'Enter') {
                ctrlAddItem();
            }
        })
    };

    let ctrlAddItem = function() {
        let input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput(); // it's an Object of input selected

        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the item to the UI

        UICtrl.addListItem(newItem, input.type);

        // 4. Calculate the budget


        // 5. Display the budget on the UI

    };

    return {
        init: function () {
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controllersPublic.init();