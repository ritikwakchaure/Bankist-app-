'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr1 = ['a', 'b', 'c', 'd'];
// let arr2 = ['r', 't', 'y'];
// console.log(arr.slice(2));
// console.log(arr.reverse());
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);
// console.log(letters.join('-'));

// //---------------------------------------
// const arr=[2,3,4];
// console.log(arr[0]);

// console.log(arr[arr.length-1]);

// movements.forEach(function(movement){

// })

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>

          <div class="movements__value">${mov}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance}€`;
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};
// calcDisplaySummary(account1);
//map---------------------------------------------------------------
const createuser = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createuser(accounts);

const updateUI = function (acc1) {
  //display movements
  displayMovements(acc1.movements);

  //display balance
  calcDisplayBalance(acc1);

  //display summary
  calcDisplaySummary(acc1);
};
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //clear input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiveAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount.receiveAcc);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiveAcc &&
    currentAccount.balance >= amount &&
    receiveAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
//filter--------------------------------------------------------------------
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);

// const withdraw1 = movements.filter(mov => mov < 0);
// console.log(withdraw1);

//reduce-----------------------------------------------------------------------
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}:${acc}`);
//   return acc + cur;
// }, 0);
// const checkdogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia.slice();
//   dogsJuliaCorrected.splice(0, 1);
//   dogsJuliaCorrected.splice(-2);

//find--------------------------------------------------------------------
// const account =accounts.find(acc=>acc.owner==='Jessica Davis');
// console.log(account);
//   const dogs = dogsJuliaCorrected.concat(dogsKate);
//   console.log(dogs);
//   // console.log(dogsJuliaCorrected);

//   dogs.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`Dog no ${i + 1} is an adult, and is ${dog}years old`);
//     } else {
//       console.log(`Dog no ${i + 1} is still a puppy`);
//     }
//   });
// };
// checkdogs([1, 4, 3, 2, 5, 6], [2, 3, 4, 3, 5, 6]);

// const eurtousd = 1.1;
// const movementsUSD = movements.map(function (mov) {
//   return mov * eurtousd;
// });
// // console.log(movements);
// console.log(movementsUSD);

// const movementUSdfor = [];
// for (const mov of movements) movementUSdfor.push(mov * eurtousd);
// console.log(movementUSdfor);

// const movementDes = movements.map((mov, i, arr) => {
//   if (mov >= 0) {
//     console.log(`movement is ${i + 1} you deposited ${mov} `);
//   } else {
//     console.log(`movement is ${i + 1} you withdraw ${Math.abs(mov)}`);
//   }
// });
// console.log(movementDes);
// const calcAVg = function (ages) {
//   const humanage = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   const adults = humanage.filter(age => age >= 18);
//   console.log(humanage);
//   console.log(adults);

//   const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
//   return average;
// };
// const avg1 = calcAVg([1, 5, 6, 7, 2, 3]);
// console.log(avg1);
// const eurTousd = 1.1;
// console.log(movements);
// const totalde = movements
//   .filter(mov => mov > 0)
//   .map((mov, i, arr) => {
//     return mov * eurTousd;
//   })
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalde);
//some--------------------
// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

//every=-----------------------
// console.log(movements.every(mov => mov > 0));

//flat---------------------------------------------------------------
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrdeep = [[[1, 2], 3], [4, 5, 6], 7];
// console.log(arrdeep.flat());

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// const overalBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

//flatMap----------------------------------------------------------

// const overalBalance = accounts
//   .flatMap(acc => acc.movements)

//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

//fill method---------------------------------------------------------

// const arr = [1, 2, 3, 4, 5, 6];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// const x = new Array(7);
// console.log(x);

// x.fill(1, 3, 4);
// // x.fill(1);
// console.log(x);

// arr.fill(23, 2, 5);
// console.log(arr);

// //array from

// labelBalance.addEventListener('click', function () {
//   const movementUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('c', ''))
//   );
//   console.log(movementUI);
// });

//Array methods-----------------------------------------------------------
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);

console.log(bankDepositSum);

const numdeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
console.log(numdeposits1000);

const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

const dogs = [
  {
    weight: 22,
    curfood: 250,
    owners: ['Alice', 'Bob'],
  },
  {
    weight: 8,
    curfood: 200,
    owners: ['Matilda'],
  },
  {
    weight: 13,
    curfood: 275,
    owners: ['Sarah', 'John'],
  },
  {
    weight: 32,
    curfood: 340,
    owners: ['Michael'],
  },
];

dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);

const ownerEattoomuch = dogs
  .filter(dog => dog.curfood > dog.recFood)
  .flatMap(dog => dog.owners);
// .flat();
console.log(ownerEattoomuch);

const ownerEattoolittle = dogs
  .filter(dog => dog.curfood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownerEattoolittle);

console.log(`${ownerEattoomuch.join(' and ')} dogs eat to much`);
console.log(`${ownerEattoolittle.join(' and ')} dogs eat to little`);

console.log(dogs.some(dog => dog.curfood === dog.recFood));
