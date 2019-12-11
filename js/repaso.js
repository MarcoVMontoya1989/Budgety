const UIControllerR = (function () {

    const stringDOM = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputAmount: '.add__value',
        inputAddButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetIncomeLabel: '.budget__income--value',
        budgetExpenseLabel: '.budget__expenses--value',
        budgetPercentageExpensesLabel: '.budget__expenses--percentage',
        budgetTotalLabel: '.budget__value',
        container: '.container'
    };

    return {
      getInputValues: function () {
          return {
              type: document.querySelector(stringDOM.inputType).value,
              description: document.querySelector(stringDOM.inputDescription).value,
              amount: parseFloat(document.querySelector(stringDOM.inputAmount).value),
          }
      },
        getStringDOM: function () {
          return stringDOM;
        },
        addNewListItem: function (type, obj) {
          let html, newHtml, element;
          if (type === 'inc') {
              element = stringDOM.incomeContainer;
              html = '<div class="item clearfix" id="inc-%id%">\n' +
                  '<div class="item__description">description</div>\n' +
                  '<div class="right clearfix">\n' +
                  '<div class="item__value">+ %amount%</div>\n' +
                  '<div class="item__delete">\n' +
                  '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                  '</div>\n' +
                  '</div>\n' +
                  '</div>';
          } else if (type === 'exp') {
              element = stringDOM.expensesContainer;
              html = '<div class="item clearfix" id="exp-%id%">\n' +
                  '<div class="item__description">%description%</div>\n' +
                  '<div class="right clearfix">\n' +
                  '<div class="item__value">- %amount%</div>\n' +
                  '<div class="item__percentage">21%</div>\n' +
                  '<div class="item__delete">\n' +
                  '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                  '</div>\n' +
                  '</div>\n' +
                  '</div>';
          }

          newHtml = html.replace('%id%', obj.id);
          newHtml = newHtml.replace('%description%', obj.description);
          newHtml = newHtml.replace('%amount%', obj.amount);

          document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        clearFields: function () {
          let fields, fieldsArray;

          fields = document.querySelectorAll(stringDOM.inputDescription + ',' + stringDOM.inputAmount);

          fieldsArray = Array.prototype.slice.call(fields);

          fieldsArray.forEach(elements => {
             elements.value = '';
          });

          fieldsArray[0].focus();
        },
        showUpdatedBudget(budgetComplete) {
          /*
            budgetTotal: dataBudgetAll.budgetTotalAmount,
            percentageTotal: dataBudgetAll.percentage,
            totalIncome: dataBudgetAll.totalAmountBudget.inc,
            totalExpenses: dataBudgetAll.totalAmountBudget.exp
          */
          document.querySelector(stringDOM.budgetExpenseLabel).textContent = budgetComplete.totalExpenses;
          document.querySelector(stringDOM.budgetIncomeLabel).textContent = budgetComplete.totalIncome;
          document.querySelector(stringDOM.budgetTotalLabel).textContent = budgetComplete.budgetTotal;

          if (budgetComplete.percentageTotal > 0) {
              document.querySelector(stringDOM.budgetPercentageExpensesLabel).textContent = budgetComplete.percentageTotal + '%';
          } else {
              document.querySelector(stringDOM.budgetPercentageExpensesLabel).textContent = '---';
          }
        },
        deleteItemFromList: function (selectorIDToDelete) {
            let deleteItemSelected;

            deleteItemSelected = document.getElementById(selectorIDToDelete);

            deleteItemSelected.parentNode.removeChild(deleteItemSelected);
        }
    }

})();

const budgetControllerR = (function () {

    let dataBudgetAll, calculateTotalAmount;

    const createExpenses = function (id, description, amount) {
        this.id = id;
        this.description = description;
        this.amount = amount
    };

    const createIncome = function (id, description, amount) {
        this.id = id;
        this.description = description;
        this.amount = amount
    };

    dataBudgetAll = {
        allItemsBudget: {
            exp: [],
            inc: []
        },
        totalAmountBudget: {
            exp: 0,
            inc: 0,
        },
        percentage: 0,
        budgetTotalAmount: 0
    };

    calculateTotalAmount = function (type) {
        let sum = 0;

        dataBudgetAll.allItemsBudget[type].forEach(list => {
            sum += list.amount;
        });

        dataBudgetAll.totalAmountBudget[type] = sum;
    };

    return {
      addNewItemToBudget: function (type, description, amount) {
          let dataBdgIdentifier, newItemToBudget;

          if (dataBudgetAll.allItemsBudget[type].length > 0) {
              dataBdgIdentifier = dataBudgetAll.allItemsBudget[type][dataBudgetAll.allItemsBudget[type].length - 1].id + 1;
          } else {
              dataBdgIdentifier = 0;
          }

          if (type === 'inc') {
              // add to data budget
              newItemToBudget = new createIncome(dataBdgIdentifier, description, amount);

          } else if (type === 'exp') {
              newItemToBudget = new createExpenses(dataBdgIdentifier, description, amount);
          }

          dataBudgetAll.allItemsBudget[type].push(newItemToBudget);

          return newItemToBudget;
      },
        test: function () {
          console.log(dataBudgetAll);
        },
        calculateBudget: function () {
          let res = 0;

            calculateTotalAmount('exp');
            calculateTotalAmount('inc');

          dataBudgetAll.budgetTotalAmount = dataBudgetAll.totalAmountBudget.inc - dataBudgetAll.totalAmountBudget.exp;

          //percentage calculation
            if (dataBudgetAll.totalAmountBudget.inc > 0 ) {
                dataBudgetAll.percentage = Math.round((dataBudgetAll.totalAmountBudget.exp / dataBudgetAll.totalAmountBudget.inc) * 100);
            } else {
                dataBudgetAll.percentage = 0;
            }
        },
        calculatePercentageTotal: function() {
          return null;
        },
        getBudgetTotal: function() {
            return {
                budgetTotal: dataBudgetAll.budgetTotalAmount,
                percentageTotal: dataBudgetAll.percentage,
                totalIncome: dataBudgetAll.totalAmountBudget.inc,
                totalExpenses: dataBudgetAll.totalAmountBudget.exp
            };
        },
        deleteItemFromBudget: function (type, deleteID) {
          let idsOriginal, index;

            idsOriginal = dataBudgetAll.allItemsBudget[type].map(function (current) {
                return current.id;
            });

            index = idsOriginal.indexOf(deleteID);

            dataBudgetAll.allItemsBudget[type].splice(index, 1);
        }
    }

})();

const publicController = (function (uiCtrl, bdgCtrl) {
    let getDOM;

    const updateBudget = function () {
        //calculate again the budget
        bdgCtrl.calculateBudget();

        let budgetComplete = bdgCtrl.getBudgetTotal();

        uiCtrl.showUpdatedBudget(budgetComplete);

    };

    const createNewItem = function (type, description, amount) {
        let addNewItemBdg, getInputValues;

        getInputValues = uiCtrl.getInputValues();

        if (getInputValues.description !== '' && getInputValues.amount > 0) {
            // add new item to budget
            addNewItemBdg = bdgCtrl.addNewItemToBudget(getInputValues.type, getInputValues.description, getInputValues.amount);
            // add to the DOM
            uiCtrl.addNewListItem(getInputValues.type, addNewItemBdg);

            // clear the fields
            uiCtrl.clearFields();

            // update again the budget to calculate in case it's deleted something
            updateBudget();
            // update the percentages

        } else {
            alert('Please add information');
        }

        return addNewItemBdg;
    };

    const deleteItemBudget = function (event) {
        let itemID, splitID, typeItem, numberItem;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-'); // exp-0 or inc-0 => ['exp','0']
            typeItem = splitID[0]; // inc or exp
            numberItem = parseInt(splitID[1]);

            //delete from budget
            bdgCtrl.deleteItemFromBudget(typeItem, numberItem);

            //delete from UI
            uiCtrl.deleteItemFromList(itemID);

            //update budget
            updateBudget();
        }
    };

    const setupEventListeners = function () {
        getDOM = uiCtrl.getStringDOM();

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 && event.key === 'Enter') {
                createNewItem();
            }
        });

        document.querySelector(getDOM.inputAddButton).addEventListener('click', createNewItem);

        document.querySelector(getDOM.container).addEventListener('click', deleteItemBudget);

    };

    return {
        init: function () {
            setupEventListeners();
        },
    }

})(UIControllerR, budgetControllerR);

publicController.init();