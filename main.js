let antimatter;
let dimensions;
let costs;

set(10);

function set(reset) {
  antimatter = new Decimal(reset);

  dimensions = [
    new Decimal(0),
    new Decimal(0),
    new Decimal(0),
    new Decimal(0)
  ];

  costs = [
    new Decimal(10),
    new Decimal(100),
    new Decimal(1e4),
    new Decimal(1e6)
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
}

function buyDimension(n) {
  const i = n - 1;

  if (antimatter.gte(costs[i])) {
    antimatter = antimatter.sub(costs[i]);
    dimensions[i] = dimensions[i].add(1);
    costs[i] = costs[i].mul(1.15);
  }
}

function save() {
  const saveData = {
    antimatter: antimatter.toString(),
    dimensions: dimensions.map(d => d.toString()),
    costs: costs.map(c => c.toString()),
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

    const offlineTime = (Date.now() - saveData.lastUpdate) / 1000;

    const steps = Math.min(offlineTime * 20, 20000);
    const dt = new Decimal(offlineTime).div(steps);

    let offlineGain = new Decimal(0);

    for (let i = 0; i < steps; i++) {
      for (let j = 3; j > 0; j--) {
        dimensions[j-1] = dimensions[j-1].add(dimensions[j].mul(dt));
      }
      offlineGain = offlineGain.add(dimensions[0]).mul(dt);
      antimatter = antimatter.add(dimensions[0].mul(dt));
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
  for (let i = 3; i > 0; i--) {
    dimensions[i - 1] = dimensions[i - 1].add(dimensions[i].mul(diff));
  }

  // 最終的に通貨生成
  antimatter = antimatter.add(dimensions[0].mul(diff));

  document.getElementById("antimatter").innerText = format(antimatter);
  document.getElementById("persec").innerText = format(dimensions[0]);

  for (let i = 0; i < 4; i++) {
    document.getElementById("dim" + (i + 1) + "-amount").innerText = format(dimensions[i]);
    document.getElementById("dim" + (i + 1) + "-cost").innerText = format(costs[i]);
  }

  updateButtons();  // ← これを追加
}

setInterval(update, 50); // 0.05秒ごと更新
setInterval(save, 5000); // 5秒ごとに保存

load();
