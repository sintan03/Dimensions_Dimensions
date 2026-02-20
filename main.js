let antimatter = new Decimal(10);
let dimension = new Decimal(0);
let cost = new Decimal(10);

function openTab(name) {
  document.getElementById("dimensions").style.display = "none";
  document.getElementById("upgrades").style.display = "none";
  document.getElementById(name).style.display = "block";
}

function updateButtons() {
  const btn = document.getElementById("dim1-btn");

  if (antimatter.gte(cost)) {
    btn.classList.add("can-buy");
    btn.classList.remove("cannot-buy");
  } else {
    btn.classList.add("cannot-buy");
    btn.classList.remove("can-buy");
  }
}

function buyDimension() {
  if (antimatter.gte(cost)) {
  antimatter = antimatter.sub(cost);
  dimension = dimension.add(1);
  cost = cost.mul(1.15);
  }
}

function save() {
  const saveData = {
    antimatter: antimatter.toString(),
    dimension: dimension.toString(),
    cost: cost.toString(),
    lastUpdate: Date.now()
  };

  localStorage.setItem("save", JSON.stringify(saveData));
}

function load() {
  const saveData = JSON.parse(localStorage.getItem("save"));

  if (saveData) {
    antimatter = new Decimal(saveData.antimatter);
    dimension = new Decimal(saveData.dimension);
    cost = new Decimal(saveData.cost);

    const offlineTime = (Date.now() - saveData.lastUpdate) / 1000;

    const offlineGain = dimension * 0.1 * offlineTime;
    antimatter = antimatter.add(offlineGain);

    alert("オフライン中に +" + offlineGain.toFixed(1) + " 獲得しました！");
  }
}

function hardReset() {
  const input = prompt("RESETと入力すると完全リセットします");

  if (input !== "RESET") return;

  localStorage.removeItem("save");

  antimatter = new Decimal(10);
  dimension = new Decimal(0);
  cost = new Decimal(10);

  update();
}

function giveMoney() {
  antimatter = antimatter.add("1e10");
}

let lastTick = Date.now();

function update() {
  const now = Date.now();
  const diff = (now - lastTick) / 1000;
  lastTick = now;

  antimatter = antimatter.add(dimension.mul(diff));

  document.getElementById("antimatter").innerText = antimatter.toFixed(1);
  document.getElementById("dim1-cost").innerText = cost.toFixed(1);

  document.getElementById("persec").innerText = dimension.toFixed(1);
  document.getElementById("dim1-amount").innerText = dimension.toFixed(1);

  updateButtons();  // ← これを追加
}

setInterval(update, 50); // 0.05秒ごと更新
setInterval(save, 5000); // 5秒ごとに保存

load();
