/* ==========================================================================
   ATITUS EDUCAÇÃO • CIÊNCIA DA COMPUTAÇÃO — SCRIPT INTERATIVO PBL
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initLiveDigitalMirror();
  initScenarioSimulator();
  initSelfDefenseChecklist();
  initQuiz();
});

/* 1. MENU MOBILE */
function initMobileNav() {
  const btn = document.getElementById("mobile-menu-btn");
  const nav = document.getElementById("nav-links");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(isOpen));
    btn.textContent = isOpen ? "✕" : "☰";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = "☰";
    });
  });
}

/* 2. ESPELHO DIGITAL AO VIVO (100% LOCAL NO NAVEGADOR COM GPU E MÉTRICAS AVANÇADAS) */
function initLiveDigitalMirror() {
  const ua = navigator.userAgent || "";

  // 1. Detectar Sistema Operacional
  let osName = "Sistema Desconhecido";
  if (/iPhone|iPad|iPod/i.test(ua)) osName = "Apple iOS (iPhone/iPad)";
  else if (/Android/i.test(ua)) osName = "Google Android";
  else if (/Win/i.test(ua)) osName = "Microsoft Windows";
  else if (/Mac/i.test(ua)) osName = "Apple macOS";
  else if (/Linux/i.test(ua)) osName = "Linux";

  // 2. Detectar Navegador
  let browserName = "Navegador Web";
  if (/Edg\//i.test(ua)) browserName = "Microsoft Edge";
  else if (/OPR\//i.test(ua)) browserName = "Opera";
  else if (/Chrome\//i.test(ua)) browserName = "Google Chrome";
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browserName = "Apple Safari";
  else if (/Firefox\//i.test(ua)) browserName = "Mozilla Firefox";

  const setField = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setField("scan-device", `${osName} • ${browserName}`);

  // 3. GPU / Placa Gráfica via WebGL Unmasked Info
  function detectGPU() {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return "WebGL indisponível";
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (renderer) {
          let clean = renderer
            .replace(/^ANGLE \((.+)\)$/i, "$1")
            .replace(/Direct3D\d+.*$/i, "")
            .replace(/vs_\d+_\d+.*$/i, "")
            .trim();
          return clean || renderer;
        }
      }
      return gl.getParameter(gl.RENDERER) || "GPU Genérica";
    } catch (e) {
      return "Restrito pelo navegador";
    }
  }
  const gpuInfo = detectGPU();
  setField("scan-gpu", gpuInfo);

  // 4. Tela, Densidade e Estimativa de Refresh Rate (Hz)
  const w = window.screen.width;
  const h = window.screen.height;
  const dpr = window.devicePixelRatio || 1;
  setField("scan-screen", `${w} × ${h} px (${dpr}x) • Calculando Hz...`);

  function estimateHz() {
    let frames = 0;
    const start = performance.now();
    function step() {
      frames++;
      const elapsed = performance.now() - start;
      if (elapsed < 350) {
        requestAnimationFrame(step);
      } else {
        const rawHz = Math.round((frames * 1000) / elapsed);
        let hz = rawHz;
        const standards = [60, 75, 90, 120, 144, 165, 240];
        for (const s of standards) {
          if (Math.abs(rawHz - s) <= 4) {
            hz = s;
            break;
          }
        }
        setField("scan-screen", `${w} × ${h} px (${dpr}x) • ~${hz} Hz`);
      }
    }
    requestAnimationFrame(step);
  }
  estimateHz();

  // 5. Processador e Memória
  const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} núcleos lógicos` : "Núcleos protegidos";
  const mem = navigator.deviceMemory ? ` • ~${navigator.deviceMemory} GB RAM` : "";
  setField("scan-hardware", `${cores}${mem}`);

  // 6. Sensor de Bateria (Battery Status API)
  if (navigator.getBattery) {
    navigator.getBattery().then((battery) => {
      const updateBat = () => {
        const level = Math.round(battery.level * 100);
        const st = battery.charging ? "⚡ Carregando" : "🔋 Na bateria";
        setField("scan-battery", `${level}% (${st})`);
      };
      updateBat();
      battery.addEventListener("levelchange", updateBat);
      battery.addEventListener("chargingchange", updateBat);
    }).catch(() => {
      setField("scan-battery", "API restrita pelo SO");
    });
  } else {
    setField("scan-battery", "Oculto por privacidade (iOS/Safari)");
  }

  // 7. Dispositivo de Entrada (Touch vs Mouse)
  const touchPoints = navigator.maxTouchPoints || 0;
  const touchDesc = touchPoints > 0 ? `Touchscreen (${touchPoints} ${touchPoints === 1 ? "ponto" : "pontos"})` : "Mouse & Teclado (Desktop)";
  setField("scan-touch", touchDesc);

  // 8. Região, Fuso e Idioma
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Fuso Padrão";
  const lang = navigator.language || "pt-BR";
  setField("scan-region", `${tz} (${lang})`);

  // 9. Perfil de Conexão
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  let netInfo = "Banda larga / Wi-Fi";
  if (conn && conn.effectiveType) {
    netInfo = `Rede ${conn.effectiveType.toUpperCase()}${conn.downlink ? ` (~${conn.downlink} Mbps)` : ""}`;
  }
  setField("scan-network", netInfo);

  // 10. Cálculo Matemático do Hash de Fingerprinting (Determinístico)
  function computeFingerprintHash() {
    const rawData = [
      osName,
      browserName,
      gpuInfo,
      `${w}x${h}x${dpr}`,
      cores,
      touchPoints,
      tz,
      lang
    ].join("||");

    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < rawData.length; i++) {
      const ch = rawData.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    const p1 = (h1 >>> 0).toString(16).toUpperCase().padStart(8, "0");
    const p2 = (h2 >>> 0).toString(16).toUpperCase().padStart(8, "0");
    return `FPR-${p1.slice(0, 4)}-${p2.slice(0, 4)}-${p1.slice(4, 8)}`;
  }
  setField("scan-fingerprint-id", computeFingerprintHash());

  // 11. Cronômetro de Tempo de Atenção (Dwell Time)
  const dwellEl = document.getElementById("scan-dwell");
  let seconds = 0;
  let maxScroll = 0;

  window.addEventListener(
    "scroll",
    () => {
      const scrollTop = window.scrollY;
      const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const pct = Math.min(100, Math.round((scrollTop / docHeight) * 100));
      if (pct > maxScroll) maxScroll = pct;
    },
    { passive: true }
  );

  setInterval(() => {
    seconds++;
    if (dwellEl) {
      dwellEl.textContent = `${seconds}s ativo • ${maxScroll}% lido`;
    }
  }, 1000);
}

/* 3. SIMULADOR DE CASOS DO DIA A DIA */
const SCENARIOS = {
  tenis: {
    quote: "“Eu só comentei com meu primo no churrasco que precisava de um tênis de corrida novo. Não digitei nada! Dez minutos depois, o anúncio apareceu no meu Instagram!”",
    tag: "Sensação comum: 'Certeza absoluta que o microfone gravou nossa conversa.'",
    steps: [
      {
        title: "Pesquisa Prévia no Grafo Social",
        desc: "Seu primo (que já corre) pesquisou esse exato modelo de tênis na noite anterior pelo celular dele."
      },
      {
        title: "Cruzamento de Localização e Mesmo Wi-Fi",
        desc: "No churrasco, os celulares de vocês usaram o mesmo Wi-Fi (mesmo IP público) e ficaram parados lado a lado por 2 horas via GPS/Bluetooth."
      },
      {
        title: "Perfil Semelhante (Lookalike Audience)",
        desc: "O algoritmo sabe que vocês têm idade parecida, amigos em comum e interesses próximos. Logo, o que seu primo buscou tem alta chance de interessar você."
      },
      {
        title: "Disparo + Ilusão de Frequência",
        desc: "O anúncio foi entregue antes ou logo após a conversa. Você ignorou outros 40 anúncios no dia, mas ficou chocado com o único que coincidiu com o papo!"
      }
    ]
  },
  colchao: {
    quote: "“Acordei reclamando de dor nas costas em voz alta sozinho no quarto. Na hora do almoço, meu feed estava cheio de propagandas de colchão ortopédico!”",
    tag: "Sensação comum: 'Nem tinha mais ninguém perto, só pode ter sido o microfone!'",
    steps: [
      {
        title: "Alteração no Padrão de Sono",
        desc: "Os sensores de movimento e tela mostraram que você pegou o celular às 3h15 e às 4h40 da madrugada — sinal clássico de noite mal dormida."
      },
      {
        title: "Tempo de Pausa na Tela (Dwell Time)",
        desc: "Dias antes, você parou o dedo por apenas 3,5 segundos em um vídeo de alongamento postural (mesmo sem curtir nem comentar)."
      },
      {
        title: "Pixels de Rastreamento em Sites",
        desc: "Na semana passada você abriu uma notícia sobre ergonomia no trabalho; o site tinha um 'Pixel' invisível que avisou sua rede social."
      },
      {
        title: "Inferência Preditiva de Compra",
        desc: "Somando insônia recente + interesse em postura + faixa etária, a Inteligência Artificial classificou você como comprador quente de colchões."
      }
    ]
  },
  viagem: {
    quote: "“Eu apenas PENSEI em viajar para Gramado no inverno e comecei a ver pacotes de hotéis na Serra Gaúcha. Agora o celular lê pensamentos?!”",
    tag: "Sensação comum: 'Eu juro que nem falei em voz alta dessa vez!'",
    steps: [
      {
        title: "Sazonalidade + Clima Local",
        desc: "Frente fria chegando na sua região: historicamente, pessoas do seu perfil buscam destinos de serra exatamente nessa semana do ano."
      },
      {
        title: "Microinterações Esquecidas",
        desc: "Você viu os Stories de uma conhecida tomando chocolate quente em Gramado por alguns segundos a mais que o normal."
      },
      {
        title: "Gatilho Inconsciente Reverso",
        desc: "Muitas vezes você já tinha passado por 2 anúncios sutis de inverno ontem sem reparar — foram eles que plantaram a vontade de viajar na sua cabeça!"
      },
      {
        title: "Confirmação Imediata",
        desc: "Quando a ideia ficou consciente para você hoje, o 3º anúncio da campanha apareceu e pareceu 'leitura mental'."
      }
    ]
  }
};

function initScenarioSimulator() {
  const tabs = document.querySelectorAll(".scenario-tab");
  const quoteEl = document.getElementById("scenario-quote");
  const tagEl = document.getElementById("scenario-tag");
  const listEl = document.getElementById("scenario-steps");

  if (!tabs.length || !quoteEl || !listEl) return;

  function renderScenario(key) {
    const data = SCENARIOS[key];
    if (!data) return;

    quoteEl.textContent = data.quote;
    tagEl.textContent = data.tag;
    listEl.innerHTML = data.steps
      .map(
        (s, idx) => `
        <li>
          <span class="step-num">${idx + 1}</span>
          <div>
            <strong>${s.title}</strong>
            <span>${s.desc}</span>
          </div>
        </li>`
      )
      .join("");
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderScenario(tab.dataset.scenario);
    });
  });

  renderScenario("tenis");
}

/* 4. GUIA DE AUTODEFESA DIGITAL (ANDROID / iOS + BARRA DE BLINDAGEM) */
const OS_PATHS = {
  android: [
    "Configurações ➔ Segurança e privacidade ➔ Privacidade ➔ Gerenciador de permissões ➔ Microfone / Câmera",
    "Configurações ➔ Local ➔ Permissões de local do app ➔ Mude para 'Permitir apenas durante o uso'",
    "Configurações ➔ Segurança e privacidade ➔ Mais configurações de privacidade ➔ Anúncios ➔ Excluir ID de publicidade",
    "Configurações ➔ Segurança e privacidade ➔ Painel de privacidade (veja quem usou sensores nas últimas 24h)",
    "No navegador Chrome ➔ Configurações ➔ Configurações do site ➔ Cookies de terceiros ➔ Bloquear"
  ],
  ios: [
    "Ajustes ➔ Privacidade e Segurança ➔ Microfone (e depois Câmera) ➔ Desmarque apps desnecessários",
    "Ajustes ➔ Privacidade e Segurança ➔ Serviços de Localização ➔ Escolha o app ➔ 'Durante o Uso' e desative 'Localização Precisa'",
    "Ajustes ➔ Privacidade e Segurança ➔ Rastreamento ➔ Desative 'Permitir Solicitações para Rastrear'",
    "Ajustes ➔ Privacidade e Segurança ➔ Relatório de Privacidade dos Apps (veja todos os acessos e domínios contatados)",
    "Ajustes ➔ Apps ➔ Safari ➔ Ative 'Impedir Rastreamento Entre Sites'"
  ]
};

function initSelfDefenseChecklist() {
  const osBtns = document.querySelectorAll(".os-btn");
  const pathEls = document.querySelectorAll(".os-path");
  const checkboxes = document.querySelectorAll(".defense-check");
  const meterFill = document.getElementById("shield-meter-fill");
  const meterPct = document.getElementById("shield-meter-pct");

  function setOS(os) {
    osBtns.forEach((b) => b.classList.toggle("active", b.dataset.os === os));
    const paths = OS_PATHS[os] || OS_PATHS.android;
    pathEls.forEach((el, i) => {
      if (paths[i]) el.textContent = paths[i];
    });
  }

  // Auto-detecta iPhone vs Android para facilitar quem escaneou o QR Code!
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent || "")) {
    setOS("ios");
  } else {
    setOS("android");
  }

  osBtns.forEach((btn) => {
    btn.addEventListener("click", () => setOS(btn.dataset.os));
  });

  function updateProgress() {
    const total = checkboxes.length;
    let checked = 0;
    checkboxes.forEach((cb) => {
      const card = cb.closest(".check-card");
      if (cb.checked) {
        checked++;
        if (card) card.classList.add("completed");
      } else if (card) {
        card.classList.remove("completed");
      }
    });

    const pct = total ? Math.round((checked / total) * 100) : 0;
    if (meterFill) meterFill.style.width = `${pct}%`;
    if (meterPct) {
      meterPct.textContent = pct === 100 ? "100% Blindado! 🛡️" : `${pct}% Concluído`;
    }
  }

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", updateProgress);
  });

  // Permite clicar nos links de fontes pequenas sem desmarcar o checkbox
  document.querySelectorAll(".check-card .micro-source a").forEach((link) => {
    link.addEventListener("click", (e) => e.stopPropagation());
  });
}

/* 5. QUIZ MITO OU VERDADE */
function initQuiz() {
  const cards = document.querySelectorAll(".quiz-card");
  cards.forEach((card) => {
    const answer = card.dataset.answer; // "mito" ou "verdade"
    const buttons = card.querySelectorAll(".quiz-btn");
    const feedback = card.querySelector(".quiz-feedback");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const choice = btn.dataset.choice;
        buttons.forEach((b) => (b.disabled = true));

        if (choice === answer) {
          btn.classList.add("correct");
        } else {
          btn.classList.add("wrong");
          buttons.forEach((b) => {
            if (b.dataset.choice === answer) b.classList.add("correct");
          });
        }

        if (feedback) feedback.classList.add("visible");
      });
    });
  });
}
