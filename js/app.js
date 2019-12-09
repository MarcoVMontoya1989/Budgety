// let addBtn = document.querySelector('.add__btn');

// BUDGET CONTROLLER
let budgetController = (function () {

    let dataBudget, calculateTotal;

    //-------------------- CONSTRUCTORS -----------------------
    const expenseCreate = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    const incomeCreate = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // -------------- PERCENTAGES CALCULATION ----------------

    expenseCreate.prototype.calculatePercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    expenseCreate.prototype.getPercentagePrototype = function() {
        return this.percentage;
    };

    // -------------- OBJECT OF ARRAYS -----------------------
    dataBudget = {
        allItems: {
            exp: [],
            inc: [],
        },
        totalItem: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,
    };

    calculateTotal = function (type) {
        let sum = 0;

        dataBudget.allItems[type].forEach(ar => {
           sum += ar.value;
        });

        dataBudget.totalItem[type] = sum;
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
        },
        calculateBudget: function () {
            // let allExpenses, allIncome;
            // calculate total income and expense
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate the budget: income - expense
            dataBudget.budget = dataBudget.totalItem.inc - dataBudget.totalItem.exp;
            // calculate the percentage of income that we spent
            if (dataBudget.totalItem.inc > 0) { // this is to prevent to divide to zero = infinity
                dataBudget.percentage = Math.round((dataBudget.totalItem.exp / dataBudget.totalItem.inc) * 100)
            } else {
                dataBudget.percentage = -1;
            }
        },
        calculatePercentages: function() {
          /*
          * a = 20
          * b = 10
          * c = 40
          * income = 100
          * a = 20/100 = 20%
          * b = 10/100 = 10%
          * c = 40/100 = 40%
          * */
          dataBudget.allItems.exp.forEach(current => {
              current.calculatePercentage(dataBudget.totalItem.inc);
          });
        },
        getPercentages: function() {
            let allPercentages;

            allPercentages = dataBudget.allItems.exp.map(function (current) {
                return current.getPercentagePrototype();
            });

            return allPercentages;
        },
        getBudget: function () {
            return {
                budget: dataBudget.budget,
                percentage: dataBudget.percentage,
                totalIncome: dataBudget.totalItem.inc,
                totalExpense: dataBudget.totalItem.exp,
            }
        },
        deleteItem(type, id) {
            // do not use dataBudget[type][id] because it will create a conflict when
            // in some point we delete the item and the length of the data it's not the same
            /*
            * for example
            * id = 6;
            * dataBudget = [1,2,6,7,11];
            * dataBudget[inc][6]; to delete it's not valid because we surpass the limit
            * then we need to select the index
            * index = 2; //is where contains the 6
            * */

            let deleteItem, ids, index;
            ids = dataBudget.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1){
                dataBudget.allItems[type].splice(index, 1);
            }
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
        budgetIncomeLabel: '.budget__income--value',
        budgetExpenseLabel: '.budget__expenses--value',
        budgetTotalLabel: '.budget__value',
        percentageExpLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
    };

    return {
      getInput: function () {
          return {
              type: document.querySelector(DOMStrings.inputType).value, //inc or exp
              description: document.querySelector(DOMStrings.inputDescription).value,
              value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
          };
      },
        getDOMStrings: function () {
            return DOMStrings;
        },
        addListItem: function (obj, type) {
            let html, element, newHTML;
            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html =
                    '<div class="item clearfix" id="inc-%id%">' +
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
                element = DOMStrings.expensesContainer;
                html =
                    '<div class="item clearfix" id="exp-%id%">\n' +
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
        },
        clearFields: function () {
          let fields, fieldsArray;
          fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

          fieldsArray = Array.prototype.slice.call(fields);

          fieldsArray.forEach(function (current, index, array) {
              current.value = '';
          });

          fieldsArray[0].focus();
        },
        displayBudget: function (obj) {
          document.querySelector(DOMStrings.budgetTotalLabel).textContent = obj.budget;
          // document.querySelector(DOMStrings.percentageIncLabel).textContent = obj.budget;
          document.querySelector(DOMStrings.budgetIncomeLabel).textContent = obj.totalIncome;
          document.querySelector(DOMStrings.budgetExpenseLabel).textContent = obj.totalExpense;
          if (obj.percentage > 0) {
              document.querySelector(DOMStrings.percentageExpLabel).textContent = obj.percentage + '%';
          } else {
              document.querySelector(DOMStrings.percentageExpLabel).textContent = '---';
          }
        },
        displayPercentages: function (percentages) {
          let fields, nodeListForSearch;
          fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);

          //callback function
          nodeListForSearch = function (list, callback) {
              for (let i = 0; i< list.length; ++i) {
                  callback(list[i], i);
              }
          };

          nodeListForSearch(fields, function (current, index) {
              if (percentages[index] > -1) {
                  current.textContent = percentages[index] + '%';
              } else {
                  current.textContent = '---';
              }

          })

        },
        deleteListItem(selectorIDToDelete) {
          let deleteItemSelected;

          deleteItemSelected = document.getElementById(selectorIDToDelete);

          deleteItemSelected.parentNode.removeChild(deleteItemSelected);
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
        });

        document.querySelector(DOMStrings.container).addEventListener('click', ctrlDeleteItem);
    };

    let updateBudget = function() {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        // 2. Return the budget
        let budgetComplete = budgetCtrl.getBudget();
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budgetComplete);
        // console.log(budgetComplete);
    };

    let updatePercentage = function() {
        let allPercentagesFromBudget;
        // 1. calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. read percentages from budget controller
        allPercentagesFromBudget = budgetCtrl.getPercentages();

        // 3. update the UI percentages value
        // console.log(allPercentagesFromBudget);
        UICtrl.displayPercentages(allPercentagesFromBudget);
    };

    let ctrlAddItem = function() {
        let input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput(); // it's an Object of input selected

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI

            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields from input containers after submitted the values
            UICtrl.clearFields();

            // 5. Calculate and update the budget
            updateBudget();

            // 6. Update the percentages
            updatePercentage();
        } else {
            alert('Please add description and value.');
        }
    };

    let ctrlDeleteItem = function (event) {
        let itemID, splitID, typeItem, numberItem;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            typeItem = splitID[0];
            numberItem = parseInt(splitID[1]);

            // 1. delete the item
            budgetCtrl.deleteItem(typeItem, numberItem);

            // 2. delete the item from UI
            UICtrl.deleteListItem(itemID);

            // 3. update and show the new budget
            updateBudget();

            // 4. Update the percentages
            updatePercentage();
        }

    };

    return {
        init: function () {
            UICtrl.displayBudget({
                budget: 0,
                percentage: 0,
                totalIncome: 0,
                totalExpense: 0
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controllersPublic.init();