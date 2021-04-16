"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// ? BANKIST APP

// ? Data
const account1 = {
  owner: "William Poncelet",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2021-04-01T14:11:59.604Z",
    "2021-04-10T17:01:17.194Z",
    "2021-04-12T23:36:17.929Z",
    "2021-04-14T10:51:36.790Z",
  ],
  currency: "CAD",
  locale: "fr-CA", // de-DE
};

const account2 = {
  owner: "Juliane Simon",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Night mode
const tumblerWrapper = document.querySelector(".tumbler__wrapper");
const tumbler = document.querySelector(".tumbler");
const logo = document.querySelector(".logo");
const movementsWrapper = document.querySelector(".movements");

let isDark = false;

tumblerWrapper.addEventListener("click", () => {
  tumbler.classList.toggle("tumbler--night-mode");
  tumblerWrapper.classList.toggle("tumbler__wrapper--night-mode");
  document.body.classList.toggle("body--night-mode");
  logo.classList.toggle("logo--night-mode");
  movementsWrapper.classList.toggle("movements--night-mode");

  isDark = !isDark;
  const movementsRow = document.querySelectorAll(".movements__row");
  console.log(movementsRow);
  movementsRow.forEach((row) => {
    row.classList.toggle("movements__row--night-mode");
  });
});

/**
 // ? Create a username as a property for each of the accounts objects.
 * The user name has the first letter of each word in lower case. William Poncelet -> wp.
 * @param {Array.<Object>} accounts - The array of account objects.
 */
const createUsernames = (accounts) => {
  accounts.forEach((account) => {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsernames(accounts);

/**
 // ? Display the current account balance based on the sum of all the movements.
 * @param {object} acc - The account object.
 */
const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce(
    (acc, currentValue) => acc + currentValue,
    0
  );

  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

/**
 * // ? Displays the summaries at the bottom of the screen
 * @param {object} acc - The account object.
 */
const calcDisplaySummary = (acc) => {
  const deposits = acc.movements
    .filter((movement) => movement > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = formatCurrency(deposits, acc.locale, acc.currency);

  const withdrawals = acc.movements
    .filter((movement) => movement < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = formatCurrency(
    withdrawals,
    acc.locale,
    acc.currency
  );

  const interests = acc.movements
    .filter((movement) => movement > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(
    interests,
    acc.locale,
    acc.currency
  );
};

/**
 // ? Format the movements dates (deposits and withdrawals).
 * @param {Date} date - Date object.
 * @param {string} locale - The current user locale.
 * @return {string} - The formatted date dd/mm/yyy.
 */
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.floor(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)); // Convert to days

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  /*  const day = `${date.getDate()}`.padStart(2, "0");
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;*/

  return new Intl.DateTimeFormat(locale).format(date);
};

/**
 // ? Format the currency depending on the user locale and currency options.
 * @param {number} value - The value to format.
 * @param {string} locale - The user defined locale in the acc object.
 * @param {string} currency - The user defined currency in the acc object.
 * @return {string} - The formatted currency.
 */
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

/**
 // ? Display the transactions of an account (deposits and withdrawals).
 * @param {object} acc - The account object.
 * @param {boolean} sort - Sort in ascending order or not.
 */
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movements = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movements.forEach(function (movement, i) {
    const type = movement > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCurrency(movement, acc.locale, acc.currency);

    const html = ` ${
      isDark
        ? `<div class='movements__row movements__row--night-mode'>`
        : `<div class='movements__row'>`
    }
          <div class='movements__type movements__type--${type}'>${
      i + 1
    } ${type}</div>
        <div class='movements__date'>${displayDate}</div>
        <div class='movements__value'>${formattedMov}</div>
    </div>
    `;

    //"afterbegin" used here to have the most recent movement
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

/**
 // ? Updates the UI by calling these functions on the currentAccount object.
 * @param {object} currentAccount - The account on which we need to update the UI.
 */
const updateUI = (currentAccount) => {
  // Display balance
  calcDisplayBalance(currentAccount);

  // Display summary
  calcDisplaySummary(currentAccount);

  // Display movements
  displayMovements(currentAccount);
};

const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;

    // When the time is at 0 seconds, stop timer and logout user.
    if (time === 0) {
      clearTimeout(timer);

      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    //Decrease 1 second
    time--;
  };

  // Set time to 5 minutes
  let time = 120; // Seconds

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// ? FAKE ALWAYS LOGGED IN
/*currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;*/

// ? Login implementation

let currentAccount, timer;

btnLogin.addEventListener("click", (e) => {
  //Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc["username"] === inputLoginUsername.value
  );
  console.log(currentAccount);

  // Optional chaining. The property pin will only be read if the account is not undefined.
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      //weekday: 'long'
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

// ? Sorting implementation.

let isSorted = false;

btnSort.addEventListener("click", () => {
  isSorted = !isSorted;
  displayMovements(currentAccount, isSorted);
});

// ? Transfert implementation.

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  // Clear input fields
  inputTransferTo.value = inputTransferAmount.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing the transfert
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

// ? Loan request implementation.

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);
  }

  // Clear input field
  inputLoanAmount.value = "";
});

// ? Close account implementation.

btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    // Clear input fields
    inputCloseUsername.value = inputClosePin.value = "";

    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
});
