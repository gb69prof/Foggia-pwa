const APP = {
  CHATBOT_URL: "https://chat.openai.com/", // cambia qui se vuoi un altro chatbot
  INDEX_ITEMS: [
    { title: "Campi Diomedei", href: "campi.html" }
  ]
};

function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return [...root.querySelectorAll(sel)]; }

function setTheme(theme){
  document.body.dataset.theme = theme;
  localStorage.setItem("theme", theme);
}

function initTheme(selectEl){
  const saved = localStorage.getItem("theme") || "light";
  setTheme(saved);
  if(selectEl) selectEl.value = saved;
  if(selectEl){
    selectEl.addEventListener("change", () => setTheme(selectEl.value));
  }
}

function openDrawer(){
  const bd = qs("#drawerBackdrop");
  const dr = qs("#drawer");
  bd?.classList.add("open");
  dr?.classList.add("open");
}
function closeDrawer(){
  const bd = qs("#drawerBackdrop");
  const dr = qs("#drawer");
  bd?.classList.remove("open");
  dr?.classList.remove("open");
}

function renderDrawer(){
  const list = qs("#drawerList");
  if(!list) return;
  list.innerHTML = "";
  APP.INDEX_ITEMS.forEach(it => {
    const a = document.createElement("a");
    a.className = "item";
    a.href = it.href;
    a.innerHTML = `<span>${it.title}</span><small>apri</small>`;
    list.appendChild(a);
  });
}

function initPWA(){
  // SW
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(()=>{});
    });
  }
}


// AUTOBOOT_PWA_THEME
(function(){
  try {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
  } catch(e) {}
  try { initPWA(); } catch(e) {}
})();
