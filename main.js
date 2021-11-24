const config = {
  initialForm: document.getElementById("initial-form"),
  bankPage: document.getElementById("bankPage"),
  sidePage: document.getElementById("sidePage")
}

class BankAccount{
  maxWithdrawPercent = 0.2;
  annualInterest = 0.08;
  constructor(firstName, lastName, email, type, accountNumber,money){
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.type = type;
    this.accountNumber = accountNumber;
    this.money = money;
    this.initialDeposit = money;
  }
  //フルネームを返す
  getFullName(){
    return this.firstName + " " + this.lastName;
  }
  //金額を受け取り、それが所持金の20%以下ならその金額、20$以上なら所持金の20%を返す
  calculateWithdrawAmount(amount){
    let maxWithdrawAmount = Math.floor(this.money * this.maxWithdrawPercent);
    if(amount <= maxWithdrawAmount){
      return amount;
    }else{
      return maxWithdrawAmount;
    }
  }

  //お金が引き出された時に残高をアップデート。金額を受け取り、残高を返す。
  withdraw(amount){
    this.money -= this.calculateWithdrawAmount(amount);
    return this.calculateWithdrawAmount(amount);
  }

  //金額を受け取り、残高をアップデートする
  deposit(amount){
    this.money += amount;
    return amount;
  }

  //日にちを受け取って利子を計算する
  simulateTimePassage(days){
    let daysPerYear = 365;
    let profit = (this.money * Math.pow((1 + this.annualInterest) , days / daysPerYear)) - this.money;
    this.money += profit;
    return profit;
  }
}
// 要素(ele)を受け取って要素を非表示にする
function displayNone(ele){
  ele.classList.remove("d-block");
  ele.classList.add("d-none");
}
// 要素(ele)を受け取って要素を表示する
function displayBlock(ele){
  ele.classList.remove("d-none");
  ele.classList.add("d-block");
}
// 最低値と最高値を与えてその間にある任意の整数を出力
function getRandomInteger(min,max){
  return Math.floor(Math.random() * (max - min) + min);
}

//submitがクリックされると入力されたデータに応じてオブジェクトを作成する
function initializeUserAccount(){
  const email = document.querySelectorAll("input[name='email']");
  const firstName = document.querySelectorAll("input[name='firstName']");
  const lastName = document.querySelectorAll("input[name='lastName']");
  const initialDeposit = document.querySelectorAll("input[name='initialDeposit']");
  const type = document.querySelectorAll("input[name='type']");
  let selectedType = "";
  if(type.item(0).checked){
    selectedType = type.item(0).value;
  }else{
    selectedType = type.item(1).value;
  }
  let userBankAccount = new BankAccount(firstName.item(0).value,lastName.item(0).value,email.item(0).value,selectedType,getRandomInteger(1,Math.pow(10,8)),parseInt(initialDeposit.item(0).value));
  //１ページ目を非表示にして２ページ目を呼び出す。
  config.initialForm.classList.add("d-none");
  config.bankPage.append(mainBankPage(userBankAccount));
}

// オブジェクトを受け取って2ページ目を作成する関数
function mainBankPage(userBankAccount){
  let infoCon = document.createElement("div");
  infoCon.classList.add("pb-2", "pb-md-4", "text-right");
  const pName = document.createElement("p");
  pName.classList.add("py-1");
  const pID = pName.cloneNode(true);
  const pDeposit = pName.cloneNode(true);
  pName.innerHTML = `Your Name: ${userBankAccount.getFullName()}`;
  pID.innerHTML = `Your Bank ID: ${userBankAccount.accountNumber}`;
  pDeposit.innerHTML = `Your First Deposit: ${userBankAccount.initialDeposit}`;
  infoCon.append(pName,pID,pDeposit);

  let balanceCon = document.createElement("div");
  balanceCon.classList.add("d-flex","bg-danger","py-1","py-md-2");
  balanceCon.innerHTML =
  `
  <p class="fontSize1p5rem col-8 text-left">Available Balance</p>
  <p class="fontSize1p5rem col-4 text-right">$${userBankAccount.money}</p>
  `;

  let buttonsCon = document.createElement("div");
  buttonsCon.classList.add("d-flex", "justify-content-center", "flex-wrap", "text-center", "py-3", "mx-0");
  buttonsCon.innerHTML =
  `
    <div class="col-lg-4 col-12 py-1 py-md-3 px-0 px-md-1">
      <div id="withdrawBtn" class="bg-blue hover p-3">
        <h5>WITHDRAWAL</h5>
        <i class="fas fa-wallet fa-3x"></i>
      </div>
    </div>
    <div class="col-lg-4 col-12 py-1 py-md-3 px-0 px-md-1">
      <div id="depositBtn" class="bg-blue hover p-3">
        <h5>DEPOSIT</h5>
        <i class="fas fa-coins fa-3x"></i>
      </div>
    </div>
    <div class="col-lg-4 col-12 py-1 py-md-3 px-0 px-md-1">
      <div id="comeBackLaterBtn" class="bg-blue hover p-3">
        <h5>COME BACK LATER</h5>
        <i class="fas fa-home fa-3x"></i>
      </div>
    </div>
  `;

  let container = document.createElement("div");
  container.classList.add("px-4", "pt-1", "pt-md-4");
  container.append(infoCon,balanceCon,buttonsCon);

  let withdrawBtn = buttonsCon.querySelectorAll("#withdrawBtn").item(0);
  let depositBtn = buttonsCon.querySelectorAll("#depositBtn").item(0);
  let comeBackLaterBtn = buttonsCon.querySelectorAll("#comeBackLaterBtn").item(0);
  // ボタンを押した場合の挙動
  withdrawBtn.addEventListener("click",function(){
    sideBankSwitch(userBankAccount);
    config.sidePage.append(withdrawPage(userBankAccount));
  });
  depositBtn.addEventListener("click",function(){
    sideBankSwitch(userBankAccount);
    config.sidePage.append(depositPage(userBankAccount));
  });
  comeBackLaterBtn.addEventListener("click",function(){
    sideBankSwitch(userBankAccount);
    config.sidePage.append(comeBackLater(userBankAccount));
  });
  return container;
}

//bankPageを非表示にし、sidePageを表示する
// function withdrawController(BankAccount){
//   displayNone(config.bankPage);
//   displayBlock(config.sidePage);
//   config.bankPage.innerHTML = "";
//   config.sidePage.innerHTML = "";
//   config.sidePage.append(withdrawPage(BankAccount));
// }

//withdrawControllerをsideBankSwitchに書き換える。
// deposit,come back laterページを表示する時にも使えるよう汎用化させる
function sideBankSwitch(){
  displayNone(config.bankPage);
  displayBlock(config.sidePage);
  config.bankPage.innerHTML = "";
  config.sidePage.innerHTML = "";
}

//withdrawページを作る
function withdrawPage(BankAccount){
  let container = document.createElement("div");
  container.classList.add("p-5");
  let withdrawContainer = document.createElement("div");
  container.append(withdrawContainer);
  withdrawContainer.append(billInputSelector("Please Enter The Withdrawal Amount"),backNextBtn("back","next"));

  //入力のたびにtotalの値が更新されていく
  let billInputs = container.querySelectorAll(".bill-input");
  let withdrawTotal = container.querySelectorAll("#totalAmount").item(0);
  for(let i = 0; i < billInputs.length; i++){
    billInputs.item(i).addEventListener("change",function(){
      withdrawTotal.innerHTML = billSummation(billInputs,"data-bill").toString();
    });
  }

  //backを押すと前のページに戻るに戻る処理
  let backBtn = withdrawContainer.getElementsByClassName("back-btn").item(0);
  backBtn.addEventListener("click",function(){
    bankReturn(BankAccount);
  });
  //nextボタンをクリックした後に出現するcalculation boxを作成する
  let nextBtn = withdrawContainer.getElementsByClassName("next-btn").item(0);
  nextBtn.addEventListener("click",function(){
    let confirmCon = document.createElement("div");
    confirmCon.classList.add("p-5");
    config.sidePage.innerHTML = "";
    config.sidePage.append(confirmCon);
    confirmCon.append(billDialog("The money you are going to take is ...",billInputs,"data-bill"));
    let canWithdrawAmount = document.createElement("div");
    canWithdrawAmount.innerHTML =
    `
    <div class="d-flex bg-danger py-1 py-md-2 mb-3 text-white">
      <p class="col-8 text-left fontSize1p5rem">Total to be withdrawn: </p>
      <p class="col-4 text-right fontSize1p5rem">$${BankAccount.calculateWithdrawAmount(billSummation(billInputs,"data-bill"))}</p>
    </div>
    `;
    let confirmBtnWrapper = backNextBtn("Go Back","Confirm");
    confirmCon.append(canWithdrawAmount,confirmBtnWrapper);
    //Go Backボタンがクリックされたら前のページに戻る
    //Confirmボタンがクリックされると残高を更新してダッシュボードへ戻る
    let goBackBtn = confirmBtnWrapper.querySelectorAll(".back-btn").item(0);
    let confirmBtn = confirmBtnWrapper.querySelectorAll(".next-btn").item(0);
    goBackBtn.addEventListener("click",function(){
      container.innerHTML = "";
      container.append(withdrawContainer);
    });
    confirmBtn.addEventListener("click",function(){
      container.innerHTML = "";
      BankAccount.withdraw(billSummation(billInputs,"data-bill"));
      bankReturn(BankAccount);
    });
  });
  return container;
}
//引き出す金額のフォームを作成する
function billInputSelector(title){
  let withdrawPageWrapper = document.createElement("div");
  withdrawPageWrapper.innerHTML =
  `
  <h2 class="pb-3">${title}</h2>
  <div class="form-group row">
    <label for="moneyWithdraw100" class="col-2 col-form-label col-form-label-sm">$100</label>
    <div class="col-10">
        <input type="number" class="form-control form-control-sm text-right withdraw-bill bill-input" data-bill="100" id="moneyWithdraw100" placeholder="5">
    </div>
  </div>
  <div class="form-group row">
    <label for="moneyWithdraw50" class="col-2 col-form-label col-form-label-sm">$50</label>
    <div class="col-10">
        <input type="number" class="form-control form-control-sm text-right withdraw-bill bill-input" data-bill="50" id="moneyWithdraw50" placeholder="1">
    </div>
  </div>
  <div class="form-group row">
    <label for="moneyWithdraw20" class="col-2 col-form-label col-form-label-sm">$20</label>
    <div class="col-10">
        <input type="number" class="form-control form-control-sm text-right withdraw-bill bill-input" data-bill="20" id="moneyWithdraw20" placeholder="2">
    </div>
  </div>
  <div class="form-group row">
    <label for="moneyWithdraw10" class="col-2 col-form-label col-form-label-sm">$10</label>
    <div class="col-10">
        <input type="number" class="form-control form-control-sm text-right withdraw-bill bill-input" data-bill="10" id="moneyWithdraw10" placeholder="3">
    </div>
  </div>
  <div class="form-group row">
    <label for="moneyWithdraw5" class="col-2 col-form-label col-form-label-sm">$5</label>
    <div class="col-10">
      <input type="number" class="form-control form-control-sm text-right withdraw-bill bill-input" data-bill="5" id="moneyWithdraw5" placeholder="1">
    </div>
  </div>
  <div class="form-group row">
    <label for="moneyWithdraw1" class="col-2 col-form-label col-form-label-sm">$1</label>
    <div class="col-10">
      <input type="number" class="form-control form-control-sm text-right withdraw-bill bill-input" data-bill="1" id="moneyWithdraw1" placeholder="4">
    </div>
  </div>
  <div class="summation text-center p-3 bg-blue text-white">
    <p id="totalAmount">$0.00</p>
  </div>
  `;
  return withdrawPageWrapper;
}
//文字列を受け取ってそれに応じてボタンを作成
function backNextBtn(leftString,rightString){
  let buttonsWrapper = document.createElement("div");
  buttonsWrapper.classList.add("d-flex", "justify-content-between");
  buttonsWrapper.innerHTML =
  `
  <div class="col-6 pl-0">
      <button id="withdrawGoBack" class="btn btn-outline-primary col-12 back-btn">${leftString}</button>
  </div>
  <div class="col-6 pr-0">
      <button id="withdrawProcess" class="btn btn-primary col-12 next-btn">${rightString}</button>
  </div>
  `;
  return buttonsWrapper;
}
// data-billを持つ要素の配列、入力された個数の配列、合計金額を計算する
function billSummation(billInputs, dataBill){
  let sum = 0;
  for(let i = 0; i < billInputs.length; i++){
    let amount;
    amount = parseInt(billInputs[i].value);

    if(billInputs[i].hasAttribute(dataBill)){
      amount *= parseInt(billInputs[i].getAttribute(dataBill));
    }

    if(amount > 0){
      sum += amount;
    }

  }
  return sum;
}

//title,bill-inputを持つnode,文字列bill-inputを受け取り、レイアウトを返す
function billDialog(title,billInputs,dataBill){
  let billWrapper = document.createElement("div");
  let calculationProcess = "";
  for(let i = 0; i < billInputs.length; i++){
    if(billInputs[i].value > 0){
      calculationProcess += `<p class="fontSize1p3rem calculation-box mb-1 pr-2">${parseInt(billInputs[i].value)} × $${parseInt(billInputs[i].getAttribute(dataBill))}</p>`;
    }
  }
  let totalParagraph = `<p class="fontSize1p3rem pr-2">total: $${billSummation(billInputs,dataBill)}</p>`;
  billWrapper.innerHTML =
  `
  <h2 class="pb-1">${title}</h2>
  <div class="d-flex justify-content-center">
      <div class="text-right col-8 px-1 calculation-box">
        ${calculationProcess}
        ${totalParagraph}
      </div>
  </div>
  `;
  return billWrapper;
}
//depositPageを作る関数
function depositPage(BankAccount){
  let container = document.createElement("div");
  container.classList.add("p-5");
  let depositContainer = document.createElement("div");
  container.append(depositContainer);
  depositContainer.append(billInputSelector("Please Enter The Deposit Amount"),backNextBtn("back","next"));

  //入力のたびにtotalの値が更新されていく
  let billInputs = container.querySelectorAll(".bill-input");
  let depositTotal = container.querySelectorAll("#totalAmount").item(0);
  for(let i = 0; i < billInputs.length; i++){
    billInputs.item(i).addEventListener("change",function(){
      depositTotal.innerHTML = billSummation(billInputs,"data-bill").toString();
    });
  }

  //backを押すと前のページに戻るに戻る処理
  let backBtn = depositContainer.getElementsByClassName("back-btn").item(0);
  backBtn.addEventListener("click",function(){
    bankReturn(BankAccount);
  });
  //nextボタンをクリックした後に出現するcalculation boxを作成する
  let nextBtn = depositContainer.getElementsByClassName("next-btn").item(0);
  nextBtn.addEventListener("click",function(){
    let confirmCon = document.createElement("div");
    confirmCon.classList.add("p-5");
    config.sidePage.innerHTML = "";
    config.sidePage.append(confirmCon);
    confirmCon.append(billDialog("The money you are going to deposit is ...",billInputs,"data-bill"));
    let canDepositAmount = document.createElement("div");
    canDepositAmount.innerHTML =
    `
    <div class="d-flex bg-danger py-1 py-md-2 mb-3 text-white">
      <p class="col-8 text-left fontSize1p5rem">Total to deposit: </p>
      <p class="col-4 text-right fontSize1p5rem">$${billSummation(billInputs,"data-bill")}</p>
    </div>
    `;
    let confirmBtnWrapper = backNextBtn("Go Back","Confirm");
    confirmCon.append(canDepositAmount,confirmBtnWrapper);
    //Go Backボタンがクリックされたら前のページに戻る
    //Confirmボタンがクリックされると残高を更新してダッシュボードへ戻る
    let goBackBtn = confirmBtnWrapper.querySelectorAll(".back-btn").item(0);
    let confirmBtn = confirmBtnWrapper.querySelectorAll(".next-btn").item(0);
    goBackBtn.addEventListener("click",function(){
      container.innerHTML = "";
      container.append(depositContainer);
    });
    confirmBtn.addEventListener("click",function(){
      container.innerHTML = "";
      BankAccount.deposit(billSummation(billInputs,"data-bill"));
      bankReturn(BankAccount);
    });
  });
  return container;
}
//sidePageを消してダッシュボードを表示する処理を切り出す。
function bankReturn(BankAccount){
  displayNone(config.sidePage);
  displayBlock(config.bankPage);
  config.bankPage.append(mainBankPage(BankAccount));
}
//come back laterページを作る関数
function comeBackLater(BankAccount){
  let container = document.createElement("div");
  container.classList.add("p-5");
  let comeBackLaterContainer = document.createElement("div");
  container.append(comeBackLaterContainer);
  comeBackLaterContainer.innerHTML =
  `
  <div class="p-5">
    <h2 class="pb-3">How many days will you be gone?</h2>
    <div class="form-group">
        <input type="number" class="form-control" id="days-gone" placeholder="4">
    </div>
  </div>
  `;
  let comeBackLaterBtnWrapper = backNextBtn("Back","Confirm");
  comeBackLaterContainer.append(comeBackLaterBtnWrapper);

  let goBackBtn = comeBackLaterBtnWrapper.querySelectorAll(".back-btn").item(0);
  let confirmBtn = comeBackLaterBtnWrapper.querySelectorAll(".next-btn").item(0);
  goBackBtn.addEventListener("click",function(){
    bankReturn(BankAccount);
  });
  confirmBtn.addEventListener("click",function(){
    let daysGoneInput = comeBackLaterContainer.querySelectorAll("#days-gone").item(0);
    let totalDaysGone = 0;
    if(parseInt(daysGoneInput.value) > 0){
      totalDaysGone = parseInt(daysGoneInput.value);
    }
    BankAccount.simulateTimePassage(totalDaysGone);
    bankReturn(BankAccount);
  });
  return container;
}
