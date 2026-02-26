const IMAGES = [
  "./assets/campi-diomedei-scavo-panorama.jpg",
  "./assets/campi-diomedei-ricostruzione.jpg",
  "./assets/campi-diomedei-park.jpg",
  "./assets/campi-diomedei-compound.jpg",
];

let currentIndex = 0;

function setOverlay(stage, label){
  stage.innerHTML = `<div class="overlayTag" id="stageTag">${label}</div>`;
}

function renderVideo(stage){
  setOverlay(stage, "VIDEO");
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/jQPxf3NOF0w?rel=0&modestbranding=1`;
  iframe.title = "Video - Campi Diomedei";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  stage.appendChild(iframe);
}

function renderMap(stage){
  setOverlay(stage, "MAP");
  const iframe = document.createElement("iframe");
  iframe.title = "Google Maps - Campi Diomedei";
  iframe.src = "https://www.google.com/maps?q=41.458009,15.560695&z=16&output=embed";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.allowFullscreen = true;
  stage.appendChild(iframe);

  const out = qs("#openExternal");
  if(out){
    out.href = "https://www.google.com/maps?q=41.458009,15.560695";
    out.style.display = "inline-flex";
    out.dataset.kind = "maps";
  }
}

function render3D(stage){
  setOverlay(stage, "3D");
  const iframe = document.createElement("iframe");
  iframe.title = "Villaggio Campi Diomedei - Foggia (Sketchfab)";
  iframe.src = "https://sketchfab.com/models/0a306cc6e14647f1960cd30c82fe0b2c/embed";
  iframe.allow = "autoplay; fullscreen; xr-spatial-tracking";
  iframe.setAttribute("xr-spatial-tracking","true");
  iframe.allowFullscreen = true;
  stage.appendChild(iframe);

  const out = qs("#openExternal");
  if(out){
    out.href = "https://sketchfab.com/models/0a306cc6e14647f1960cd30c82fe0b2c";
    out.style.display = "inline-flex";
    out.dataset.kind = "sketchfab";
  }
}

function updateViewer(viewer){
  const main = viewer.querySelector(".viewerMain");
  main.src = IMAGES[currentIndex];
  main.alt = "Campi Diomedei";
  viewer.querySelectorAll(".thumbBtn").forEach((b, i)=>{
    b.classList.toggle("selected", i === currentIndex);
    b.setAttribute("aria-current", i === currentIndex ? "true" : "false");
  });
}

function renderImages(stage){
  // When opening images, always start from first image (as requested)
  currentIndex = 0;

  setOverlay(stage, "IMMAGINI");

  const viewer = document.createElement("div");
  viewer.className = "imgViewer";

  const main = document.createElement("img");
  main.className = "viewerMain";
  main.src = IMAGES[currentIndex];
  main.alt = "Campi Diomedei";
  main.loading = "eager";
  viewer.appendChild(main);

  const prev = document.createElement("button");
  prev.className = "viewerNav prev";
  prev.type = "button";
  prev.textContent = "‹";
  prev.setAttribute("aria-label","Immagine precedente");
  prev.addEventListener("click", ()=>{
    currentIndex = (currentIndex - 1 + IMAGES.length) % IMAGES.length;
    updateViewer(viewer);
  });

  const next = document.createElement("button");
  next.className = "viewerNav next";
  next.type = "button";
  next.textContent = "›";
  next.setAttribute("aria-label","Immagine successiva");
  next.addEventListener("click", ()=>{
    currentIndex = (currentIndex + 1) % IMAGES.length;
    updateViewer(viewer);
  });

  viewer.appendChild(prev);
  viewer.appendChild(next);

  const strip = document.createElement("div");
  strip.className = "thumbStrip";
  IMAGES.forEach((src, i)=>{
    const b = document.createElement("button");
    b.className = "thumbBtn";
    b.type = "button";
    b.setAttribute("aria-label", `Apri immagine ${i+1}`);
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Miniatura ${i+1}`;
    img.loading = "lazy";
    b.appendChild(img);
    b.addEventListener("click", ()=>{
      currentIndex = i;
      updateViewer(viewer);
    });
    strip.appendChild(b);
  });
  viewer.appendChild(strip);

  // swipe left/right on touch
  let startX = 0;
  let startY = 0;
  let dragging = false;

  const onStart = (x, y)=>{ startX = x; startY = y; dragging = true; };
  const onEnd = (x, y)=>{
    if(!dragging) return;
    dragging = false;
    const dx = x - startX;
    const dy = y - startY;
    if(Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)){
      if(dx < 0){
        currentIndex = (currentIndex + 1) % IMAGES.length;
      }else{
        currentIndex = (currentIndex - 1 + IMAGES.length) % IMAGES.length;
      }
      updateViewer(viewer);
    }
  };

  viewer.addEventListener("touchstart", (e)=>{
    const t = e.touches[0];
    onStart(t.clientX, t.clientY);
  }, {passive:true});
  viewer.addEventListener("touchend", (e)=>{
    const t = e.changedTouches[0];
    onEnd(t.clientX, t.clientY);
  });

  stage.appendChild(viewer);
  updateViewer(viewer);

  // external button hidden in images mode
  const out = qs("#openExternal");
  if(out){ out.style.display = "none"; out.href = "#"; }
}

function setActiveTool(tool){
  qsa(".toolChip").forEach(c => c.classList.toggle("active", c.dataset.tool === tool));
  const stage = qs("#mediaStage");

  // reset external
  const out = qs("#openExternal");
  if(out){ out.style.display = "none"; out.href = "#"; }

  if(tool === "video") renderVideo(stage);
  else if(tool === "map") renderMap(stage);
  else if(tool === "immagini") renderImages(stage);
  else if(tool === "3d") render3D(stage);
  else renderVideo(stage);
}

async function loadText(){
  const box = qs("#textContent");
  try{
    const res = await fetch("./txt/Diomedei.txt", {cache:"no-cache"});
    const txt = await res.text();
    box.textContent = txt;
  }catch(e){
    box.innerHTML = `<span class="muted">Non riesco a caricare il testo (Diomedei.txt). Controlla che sia in /txt.</span>`;
  }
}

function initCampi(){
  renderDrawer();
  initTheme(qs("#themeSelect"));
  initPWA();

  qs("#btnMenu")?.addEventListener("click", openDrawer);
  qs("#drawerBackdrop")?.addEventListener("click", closeDrawer);
  qs("#btnCloseDrawer")?.addEventListener("click", closeDrawer);

  qs("#btnChat")?.addEventListener("click", ()=> window.open(APP.CHATBOT_URL, "_blank"));

  qsa(".toolChip").forEach(chip=>{
    chip.addEventListener("click", ()=> setActiveTool(chip.dataset.tool));
  });

  // hide old gallery + modal if present
  const gw = qs("#galleryWrap");
  if(gw) gw.style.display = "none";
  const modal = qs("#imgModal");
  if(modal) modal.remove();

  loadText();
  setActiveTool("video");
}

document.addEventListener("DOMContentLoaded", initCampi);
