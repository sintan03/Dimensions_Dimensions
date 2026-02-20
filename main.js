let antimatter = 10;
let dimension = 0;
let cost = 10;

function openTab(name) {
  document.getElementById("dimensions").style.display = "none";
  document.getElementById("upgrades").style.display = "none";
  document.getElementById(name).style.display = "block";
}

function buyDimension() {
  if (antimatter >= cost) {
    antimatter -= cost;
    dimension++;
    cost *= 1.01;
  }
}

function update() {
  antimatter += dimension * 0.1;

  document.getElementById("antimatter").innerText = antimatter.toFixed(1);
  document.getElementById("cost").innerText = cost.toFixed(1);
}

setInterval(update, 100); // 0.1秒ごと更新
