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
    cost *= 1.01;
  }
}

function update() {
  antimatter += dimension * 0.01;

  document.getElementById("persec").innerText = dimension.toFicxed(1);

  document.getElementById("antimatter").innerText = antimatter.toFixed(1);
  document.getElementById("dim1-amount").innerText = dimension.toFixed(1);
  document.getElementById("dim1-cost").innerText = cost.toFixed(1);

  updateButtons();  // ← これを追加
}

setInterval(update, 50); // 0.1秒ごと更新
