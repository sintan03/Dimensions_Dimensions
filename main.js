let antimatter = 10;
let dimension = 0;
let cost = 10;

function openTab(name) {
  document.getElementById("dimensions").style.display = "none";
  document.getElementById("upgrades").style.display = "none";
  document.getElementById(name).style.display = "block";
}

function updateButtons() {
  const btn = document.getElementById("dim1-btn");

  if (antimatter >= cost) {
    btn.classList.add("can-buy");
    btn.classList.remove("cannot-buy");
  } else {
    btn.classList.add("cannot-buy");
    btn.classList.remove("can-buy");
  }
}

function buyDimension() {
  if (antimatter >= cost) {
    antimatter -= cost;
    dimension++;
    cost += 1;
  }
}

function save() {
  const saveData = {
    antimatter: antimatter,
    dimension: dimension,
    cost: cost,
    lastUpdate: Date.now()
  };

  localStorage.setItem("save", JSON.stringify(saveData));
}

function load() {
  const saveData = JSON.parse(localStorage.getItem("save"));

  if (saveData) {
    antimatter = saveData.antimatter;
    dimension = saveData.dimension;
    cost = saveData.cost;

    const offlineTime = (Date.now() - saveData.lastUpdate) / 1000;

    const offlineGain = dimension * 0.1 * offlineTime;
    antimatter += offlineGain;

    alert("オフライン中に +" + offlineGain.toFixed(1) + " 獲得しました！");
  }
}

let lastTick = Date.now();

function update() {
  const now = Date.now();
  const diff = (now - lastTick) / 1000;
  lastTick = now;

  antimatter += dimension * diff;

  document.getElementById("antimatter").innerText = antimatter.toFixed(1);
  document.getElementById("dim1-cost").innerText = cost.toFixed(1);

  document.getElementById("persec").innerText = dimension.toFixed(1);
  document.getElementById("antimatter").innerText = antimatter.toFixed(1);

  updateButtons();  // ← これを追加
}

setInterval(update, 50); // 0.05秒ごと更新
setInterval(save, 5000); // 5秒ごとに保存

load();
