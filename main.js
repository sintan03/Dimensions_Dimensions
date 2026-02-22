let antimatter;
let dimensions;
let dimensionsMulti;
let costs;
let costups;

let upgrades;

set(10);

function set(reset) {
  antimatter = new Decimal(reset);

  dimensions = [
    new Decimal(0),
    new Decimal(0),
    new Decimal(0),
    new Decimal(0)
  ];

  dimensionsMulti = [
    new Decimal(1),
    new Decimal(1),
    new Decimal(1),
    new Decimal(1)
  ];

  costs = [
    new Decimal(10),
    new Decimal(100),
    new Decimal(1e4),
    new Decimal(1e6)
  ];

  costups = [
    new Decimal(1.1),
    new Decimal(1.2),
    new Decimal(1.4),
    new Decimal(1.8)
  ];

  upgrades = [
    {
      effect: new Decimal(1),
      cost: new Decimal(100),
      costup: new Decimal(10)
    }
  ];
}

function openTab(name) {
  document.getElementById("dimensions").style.display = "none";
  document.getElementById("upgrades").style.display = "none";
  document.getElementById(name).style.display = "block";
}

function updateButtons() {
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById("dim" + (i + 1) + "-btn");

    if (antimatter.gte(costs[i])) {
      btn.classList.add("can-buy");
      btn.classList.remove("cannot-buy");
    } else {
      btn.classList.add("cannot-buy");
      btn.classList.remove("can-buy");
    }
  }

  const btn = document.getElementById("upgrade" + (0 + 1) + "-btn");

  if (antimatter.gte(upgrades[0]["cost"])) {
    btn.classList.add("can-buy");
    btn.classList.remove("cannot-buy");
  } else {
    btn.classList.add("cannot-buy");
    btn.classList.remove("can-buy");
  }
}

function buyDimension(n) {
  const i = n - 1;

  if (antimatter.gte(costs[i])) {
    antimatter = antimatter.sub(costs[i]);
    dimensions[i] = dimensions[i].add(1);
    costs[i] = costs[i].mul(costups[i]);
  }
}

function buyUpgrade(i) {
  if (antimatter.gte(upgrades[i]["cost"])) {
    antimatter = antimatter.sub(upgrades[i]["cost"]);
    upgrades[i]["effect"] = upgrades[i]["effect"].mul(2);
    upgrades[i]["cost"] = upgrades[i]["cost"].mul(upgrades[i]["costup"])
  }
}

function save() {
  const saveData = {
    antimatter: antimatter.toString(),
    dimensions: dimensions.map(d => d.toString()),
    costs: costs.map(c => c.toString()),
    dimensionsMulti: dimensionsMulti.map(m => m.toString()),
    lastUpdate: Date.now()
  };

  localStorage.setItem("save", JSON.stringify(saveData));
}

function load() {
  const saveData = JSON.parse(localStorage.getItem("save"));

  if (saveData) {
    antimatter = new Decimal(saveData.antimatter);
    dimensions = saveData.dimensions.map(d => new Decimal(d));
    costs = saveData.costs.map(c => new Decimal(c));
    dimensionsMulti = saveData.dimensionsMulti.map(m => new Decimal(m));

    const offlineTime = (Date.now() - saveData.lastUpdate) / 1000;

    const steps = Math.min(offlineTime * 20, 20000);
    const dt = new Decimal(offlineTime).div(steps);

    let offlineGain = new Decimal(0);

    for (let i = 0; i < steps; i++) {
      for (let j = 3; j > 0; j--) {
        dimensionsMulti[j - 1] = dimensionsMulti[j - 1].add(dimensions[j].mul(dt).mul(0.1).mul(dimensionsMulti[j]));
      }
      offlineGain = offlineGain.add(dimensions[0].mul(dt).mul(dimensionsMulti[0]));
      antimatter = antimatter.add(dimensions[0].mul(dt).mul(dimensionsMulti[0]));
    }

    alert(`オフライン中に ${format(offlineGain)} 獲得しました！`);
  }
}

function hardReset() {
  const input = prompt("RESETと入力すると完全リセットします");

  if (input !== "RESET") return;

  localStorage.removeItem("save");

  set(10);

  update();
}

function giveMoney() {
  antimatter = antimatter.add("1e10");
}

function format(value) {
  if (value.lt(1e3)) {
    return value.toFixed(1);
  } else {
    return value.toExponential(2).replace("+", "");
  }
}

let lastTick = Date.now();

function update() {
  const now = Date.now();
  const diff = (now - lastTick) / 1000;
  lastTick = now;

  // 下から順に生産
  dimensionsMulti[2] = dimensionsMulti[2].add(dimensions[3].mul(diff).mul(0.1).mul(dimensionsMulti[3]));
  dimensionsMulti[1] = dimensionsMulti[1].add(dimensions[2].mul(diff).mul(0.1).mul(dimensionsMulti[2]));
  dimensionsMulti[0] = dimensionsMulti[0].add(dimensions[1].mul(diff).mul(0.1).mul(dimensionsMulti[1]));

  // 最終的に通貨生成
  antimatter = antimatter.add(dimensions[0].mul(diff).mul(dimensionsMulti[0]).mul(upgrades[0]["effect"]));

  document.getElementById("antimatter").innerText = format(antimatter);
  document.getElementById("persec").innerText = format(dimensions[0].mul(dimensionsMulti[0]).mul(upgrades[0]["effect"]));

  for (let i = 0; i < 4; i++) {
    document.getElementById("dim" + (i + 1) + "-amount").innerText = format(dimensions[i]);
    document.getElementById("dim" + (i + 1) + "-cost").innerText = format(costs[i]);
    if (i == 0) {
      document.getElementById("dim" + (i + 1) + "-multi").innerText = format(dimensionsMulti[i].mul(upgrades[0]["effect"]));
    } else {
      document.getElementById("dim" + (i + 1) + "-multi").innerText = format(dimensionsMulti[i]);
    }
  }

  document.getElementById("upgrade" + (0 + 1) + "-cost").innerText = format(upgrades[0]["cost"]);
  document.getElementById("upgrade" + (0 + 1) + "-effect").innerText = format(upgrades[0]["effect"]);

  updateButtons();  // ← これを追加
}

setInterval(update, 50); // 0.05秒ごと更新
setInterval(save, 5000); // 5秒ごとに保存

load();