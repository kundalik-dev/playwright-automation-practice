const msg = document.getElementById("success-msg");
let primaryCount = 0;
let toggleCount = 0;

document.getElementById("primary-btn").addEventListener("click", () => {
  primaryCount++;
  msg.textContent = `Primary action button clicked (${primaryCount})`;
});

document.getElementById("toggle-btn").addEventListener("click", () => {
  toggleCount++;
  msg.textContent = `Toggle button clicked (${toggleCount})`;
});
