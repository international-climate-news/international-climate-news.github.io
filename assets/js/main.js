document.addEventListener("click", function (e) {
  const btn = e.target.closest(".copy-btn");
  if (!btn) return;
  const target = document.querySelector(btn.dataset.copyTarget);
  if (!target) return;
  navigator.clipboard.writeText(target.innerText.trim()).then(function () {
    const original = btn.textContent;
    btn.textContent = "Copied";
    setTimeout(function () { btn.textContent = original; }, 1500);
  });
});
