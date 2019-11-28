let UIController = (function () {
    let DOMString = {
        type: '.add__type',
        description: '.add__description',
        numberValue: '.add__value',
        btnAdd: '.add__btn',
    };

    return {
        getDOMString: function () {
            return DOMString;
        },
        getInputValues: function () {
            return {
                inputType: document.querySelector(DOMString.type).value,
                inputDescription: document.querySelector(DOMString.description).value,
                inputNumberValue: document.querySelector(DOMString.numberValue).value,
            }
        }
    }
})();

let budgetController = (function () {
    //expenses and incomes

    //constructor
    const createIncomeBudget = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const creatExpenseBudget = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const allDataBudget = {
        allItems: {
            exp: [],
            inc: []
        },
        totalItem: {
            exp: 0,
            inc: 0
        }
    };

    return {
      addNewItem: function (type, des, val) {
          let newItem, ID;

          if (allDataBudget.allItems[type] > 0) {
              ID = allDataBudget.allItems[type][allDataBudget.allItems[type].length - 1].id + 1;
          } else {
              ID = 0;
          }

          if (type === 'exp') {
              newItem = new creatExpenseBudget(ID, des, val);
          } else if (type === 'inc') {
              newItem = new createIncomeBudget(ID, des, val);
          }

          allDataBudget.allItems[type].push(newItem);

          return newItem;
      },
        testing: function () {
          console.log(allDataBudget);
        }
    }

})();

const publicController = (function (UICtrl, BdgCtrl) {

    let setupAddEventListener = function () {
        let getDOM = UICtrl.getDOMString();

        document.querySelector(getDOM.btnAdd).addEventListener('click', addItemCtrl);

        document.addEventListener('keyboard', function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                addItemCtrl();
            }
        })
    };

    let addItemCtrl = function () {
        let input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInputValues(); // it's an Object of input selected

        // 2. Add the item to the budget controller

        newItem = BdgCtrl.addNewItem(input.inputType, input.inputDescription, input.inputNumberValue);

        // 3. Add the item to the UI



        // 4. Calculate the budget


        // 5. Display the budget on the UI

    };

    return {
        init: function () {
            setupAddEventListener();
        }
    }


})(UIController, budgetController);

publicController.init();