/* ==========================================================================
   EMMY LASH STUDIO (ZAPOPAN) — MOTOR INTERACTIVO COMPLETO
   1. Logo Interactivo Viajero que desciende con nosotros al hacer scroll
   2. Renderizador Vectorial (SVG) de los 4 Efectos ($600): Clásico, Híbrido, Rímel, Wispy
   3. Bot de Instagram con Control de Colisiones (11:00 ocupado -> sugiere 11:30)
   4. Opiniones Reales 5.0★ de Google Maps con "Me gusta" y Modal para Compartir
   5. Agenda Web conectada al WhatsApp oficial de Emmy (33 2619 2669)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const EMMY_PHONE_WA = '523326192669';
  const EMMY_ADDRESS = 'Burgos Bugambilias 1350 B-planta alta, Sta Margarita, 45138 Zapopan, Jal.';

  // ==========================================================================
  // DATOS BASE: LOS 4 DISEÑOS EN $600 MXN Y HORARIOS (9:30 AM – 6:30 PM)
  // ==========================================================================
  const LASH_SETS = {
    clasico: {
      id: 'clasico',
      name: 'Efecto Clásico',
      shortName: 'Clásico',
      price: 600,
      badge: 'EFECTO CLÁSICO · 1:1',
      description: '1 extensión por pestaña natural. Elegancia limpia y sutil.'
    },
    hibrido: {
      id: 'hibrido',
      name: 'Efecto Híbrido',
      shortName: 'Híbrido',
      price: 600,
      badge: 'EFECTO HÍBRIDO · MIX',
      description: '50% Clásica + 50% abanicos suaves. Textura equilibrada.'
    },
    rimmel: {
      id: 'rimmel',
      name: 'Efecto Rímel',
      shortName: 'Efecto Rímel',
      price: 600,
      badge: 'EFECTO RÍMEL · WET LOOK',
      description: 'Fibras cerradas de alta definición tipo máscara recién puesta.'
    },
    wispy: {
      id: 'wispy',
      name: 'Efecto Wispy',
      shortName: 'Wispy',
      price: 600,
      badge: 'EFECTO WISPY · SPIKES',
      description: 'Picos estratégicos (spikes) con base sedosa y glamurosa.'
    }
  };

  const INITIAL_SLOTS = [
    { time: '09:30', label: '9:30 AM',  status: 'booked', client: 'Nataly',        set: 'Clásico',  channel: 'WhatsApp' },
    { time: '10:30', label: '10:30 AM', status: 'booked', client: 'Magic Hands',   set: 'Híbrido',  channel: 'IG Bot' },
    { time: '11:00', label: '11:00 AM', status: 'free',   client: null,            set: null,       channel: null },
    { time: '11:30', label: '11:30 AM', status: 'free',   client: null,            set: null,       channel: null },
    { time: '13:00', label: '1:00 PM',  status: 'free',   client: null,            set: null,       channel: null },
    { time: '15:30', label: '3:30 PM',  status: 'free',   client: null,            set: null,       channel: null },
    { time: '17:00', label: '5:00 PM',  status: 'free',   client: null,            set: null,       channel: null },
    { time: '18:00', label: '6:00 PM',  status: 'free',   client: null,            set: null,       channel: null }
  ];

  const state = {
    currentEffect: 'clasico',
    currentLength: 12,
    currentCurl: 'CC',
    selectedWebSlot: '11:00',
    suggestedSlot: null,
    slots: JSON.parse(JSON.stringify(INITIAL_SLOTS)),
    clientPendingSuggestion: {
      A: null,
      B: null
    }
  };

  // ==========================================================================
  // 1. LOGO INTERACTIVO QUE BAJA JUNTO A NOSOTROS AL HACER SCROLL
  // ==========================================================================
  const travelingLogo = document.getElementById('travelingLogo');
  const scrollRingFill = document.getElementById('scrollRingFill');
  const companionTitle = document.getElementById('companionTitle');
  const companionStatus = document.getElementById('companionStatus');
  const navbar = document.getElementById('navbar');

  let currentLogoY = 110;
  let targetLogoY = 110;
  let lastScrollY = window.scrollY;

  function updateScrollTarget() {
    const scrollTop = window.scrollY;
    const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollFraction = Math.min(1, Math.max(0, scrollTop / docHeight));

    if (scrollTop > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // El logo baja físicamente junto con el usuario desde arriba hasta abajo de la pantalla
    const minTop = 96;
    const maxTop = Math.max(140, window.innerHeight - 115);
    targetLogoY = minTop + scrollFraction * (maxTop - minTop);

    if (scrollRingFill) {
      const offset = 289 - (scrollFraction * 289);
      scrollRingFill.style.strokeDashoffset = offset.toFixed(1);
    }

    // Pequeño aleteo de pestañas al bajar
    const delta = Math.abs(scrollTop - lastScrollY);
    lastScrollY = scrollTop;
    const companionLashes = document.getElementById('companionLashesGroup');
    if (companionLashes && delta > 8) {
      const flutterScale = Math.max(0.75, 1 - Math.min(0.25, delta / 180));
      companionLashes.style.transform = `scaleY(${flutterScale})`;
      clearTimeout(companionLashes._flutterTimer);
      companionLashes._flutterTimer = setTimeout(() => {
        companionLashes.style.transform = 'scaleY(1)';
      }, 150);
    }

    // Actualizar mensaje del logo según la sección actual
    const sections = document.querySelectorAll('section[data-companion-title]');
    let activeSection = sections[0];
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.45) {
        activeSection = sec;
      }
    });

    if (activeSection && companionTitle && companionStatus) {
      companionTitle.textContent = activeSection.getAttribute('data-companion-title');
      companionStatus.textContent = activeSection.getAttribute('data-companion-status');
    }
  }

  function animateTravelingLogo() {
    currentLogoY += (targetLogoY - currentLogoY) * 0.14;
    if (travelingLogo) {
      travelingLogo.style.top = `${currentLogoY.toFixed(1)}px`;
    }
    requestAnimationFrame(animateTravelingLogo);
  }

  window.addEventListener('scroll', updateScrollTarget, { passive: true });
  window.addEventListener('resize', updateScrollTarget);
  updateScrollTarget();
  requestAnimationFrame(animateTravelingLogo);

  const effectOrder = ['clasico', 'hibrido', 'rimmel', 'wispy'];
  if (travelingLogo) {
    travelingLogo.addEventListener('click', () => {
      triggerEyeBlink();
      const nextIdx = (effectOrder.indexOf(state.currentEffect) + 1) % effectOrder.length;
      setGlobalLashEffect(effectOrder[nextIdx]);
      showToast(`✨ Emmy Lash Logo: Cambiado a ${LASH_SETS[state.currentEffect].name} ($600)`);
    });
  }

  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth - 0.5) * 2;
    const normY = (e.clientY / window.innerHeight - 0.5) * 2;

    const companionIris = document.getElementById('companionIris');
    const heroIris = document.getElementById('heroIrisGroup');
    const simIris = document.getElementById('simIris');

    if (companionIris) {
      companionIris.style.transform = `translate(${(normX * 3.2).toFixed(1)}px, ${(normY * 2.4).toFixed(1)}px)`;
    }
    if (heroIris) {
      heroIris.style.transform = `translate(${(normX * 7).toFixed(1)}px, ${(normY * 4.5).toFixed(1)}px)`;
    }
    if (simIris) {
      simIris.style.transform = `translate(${(normX * 6).toFixed(1)}px, ${(normY * 4).toFixed(1)}px)`;
    }
  }, { passive: true });

  function triggerEyeBlink() {
    document.body.classList.add('is-blinking');
    setTimeout(() => {
      document.body.classList.remove('is-blinking');
    }, 210);
  }

  const btnHeroBlink = document.getElementById('btnHeroBlink');
  const btnSimBlink = document.getElementById('btnSimBlink');
  const heroEmblemWrapper = document.getElementById('heroEmblemWrapper');

  if (btnHeroBlink) btnHeroBlink.addEventListener('click', triggerEyeBlink);
  if (btnSimBlink) btnSimBlink.addEventListener('click', triggerEyeBlink);
  if (heroEmblemWrapper) heroEmblemWrapper.addEventListener('click', triggerEyeBlink);

  // ==========================================================================
  // 2. RENDERIZADOR VECTORIAL DE PESTAÑAS (HERO + PROBADOR INTERACTIVO)
  // ==========================================================================
  function buildLashPathsSVG(effect, lengthMm = 12, curlType = 'CC', mode = 'hero') {
    const isHero = mode === 'hero';
    const lidLeftX = isHero ? 64 : 62;
    const lidRightX = isHero ? 296 : 358;
    const basePeakY = isHero ? 103 : 106;
    const edgeY = isHero ? 139 : 148;

    const lengthScale = 0.72 + ((lengthMm - 9) / 6) * 0.52;
    const curlLift = curlType === 'C' ? 0.88 : (curlType === 'CC' ? 1.05 : 1.24);

    const strandsCount = effect === 'clasico' ? 15 : (effect === 'hibrido' ? 17 : (effect === 'rimmel' ? 15 : 16));
    let svgContent = '';

    for (let i = 0; i < strandsCount; i++) {
      const t = i / (strandsCount - 1);
      const x = lidLeftX + t * (lidRightX - lidLeftX);

      const normT = (t - 0.5) * 2;
      const y = basePeakY + Math.pow(normT, 2) * (edgeY - basePeakY);

      const anatomyFactor = 0.58 + Math.sin(t * Math.PI) * 0.52;
      const baseLen = (isHero ? 36 : 44) * lengthScale * curlLift * anatomyFactor;
      const splayX = normT * (isHero ? 22 : 26);

      if (effect === 'clasico') {
        const tipX = x + splayX;
        const tipY = y - baseLen;
        const ctrlX = x + splayX * 0.45;
        const ctrlY = y - baseLen * 0.65;
        svgContent += `<path d="M ${x.toFixed(1)} ${y.toFixed(1)} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}" stroke="#3A1B28" stroke-width="2.2" stroke-linecap="round" fill="none"/>`;
      } else if (effect === 'hibrido') {
        if (i % 2 === 0) {
          const tipX = x + splayX;
          const tipY = y - baseLen;
          svgContent += `<path d="M ${x.toFixed(1)} ${y.toFixed(1)} Q ${(x + splayX * 0.4).toFixed(1)} ${(y - baseLen * 0.65).toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}" stroke="#3A1B28" stroke-width="2.1" stroke-linecap="round" fill="none"/>`;
        } else {
          [-7, 0, 7].forEach(spread => {
            const tipX = x + splayX + spread;
            const tipY = y - baseLen * 1.04;
            svgContent += `<path d="M ${x.toFixed(1)} ${y.toFixed(1)} Q ${(x + splayX * 0.5).toFixed(1)} ${(y - baseLen * 0.68).toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}" stroke="#4A2535" stroke-width="1.5" stroke-linecap="round" opacity="0.9" fill="none"/>`;
          });
        }
      } else if (effect === 'rimmel') {
        const tipX = x + splayX;
        const tipY = y - baseLen * 1.08;
        const ctrlX = x + splayX * 0.5;
        const ctrlY = y - baseLen * 0.7;
        svgContent += `<path d="M ${(x - 1.5).toFixed(1)} ${y.toFixed(1)} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}" stroke="#2B111C" stroke-width="3.5" stroke-linecap="round" fill="none"/>`;
        svgContent += `<path d="M ${(x + 1.5).toFixed(1)} ${y.toFixed(1)} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}" stroke="#5E3447" stroke-width="1.6" stroke-linecap="round" fill="none"/>`;
      } else if (effect === 'wispy') {
        const isSpike = (i % 3 === 1);
        if (isSpike) {
          const spikeLen = baseLen * 1.32;
          const tipX = x + splayX * 1.1;
          const tipY = y - spikeLen;
          svgContent += `<path d="M ${x.toFixed(1)} ${y.toFixed(1)} Q ${(x + splayX * 0.45).toFixed(1)} ${(y - spikeLen * 0.65).toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}" stroke="#2B111C" stroke-width="3.1" stroke-linecap="round" fill="none"/>`;
        } else {
          const softLen = baseLen * 0.78;
          [-5, 0, 5].forEach(spread => {
            const tipX = x + splayX + spread;
            const tipY = y - softLen;
            svgContent += `<path d="M ${x.toFixed(1)} ${y.toFixed(1)} Q ${(x + splayX * 0.4).toFixed(1)} ${(y - softLen * 0.6).toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}" stroke="#875C6F" stroke-width="1.4" stroke-linecap="round" fill="none"/>`;
          });
        }
      }
    }

    return svgContent;
  }

  function renderAllEyeVisualizers() {
    const heroLashesGroup = document.getElementById('heroLashesDynamic');
    const simulatorLashesGroup = document.getElementById('simulatorLashesGroup');
    const setInfo = LASH_SETS[state.currentEffect];

    if (heroLashesGroup) {
      heroLashesGroup.innerHTML = buildLashPathsSVG(state.currentEffect, state.currentLength, state.currentCurl, 'hero');
    }
    if (simulatorLashesGroup) {
      simulatorLashesGroup.innerHTML = buildLashPathsSVG(state.currentEffect, state.currentLength, state.currentCurl, 'simulator');
    }

    const heroSelectedSetName = document.getElementById('heroSelectedSetName');
    if (heroSelectedSetName) heroSelectedSetName.textContent = setInfo.name;

    const canvasEffectBadge = document.getElementById('canvasEffectBadge');
    if (canvasEffectBadge) canvasEffectBadge.textContent = setInfo.badge;

    const guideMaxMm = document.getElementById('guideMaxMm');
    if (guideMaxMm) guideMaxMm.textContent = `${state.currentLength}mm`;

    const customizerSummaryText = document.getElementById('customizerSummaryText');
    if (customizerSummaryText) {
      customizerSummaryText.textContent = `${setInfo.name} · ${state.currentLength}mm · Curva ${state.currentCurl} — $600 MXN`;
    }

    document.querySelectorAll('.effect-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.effect === state.currentEffect);
    });
    document.querySelectorAll('.set-card').forEach(card => {
      card.classList.toggle('active', card.dataset.set === state.currentEffect);
    });
    document.querySelectorAll('#visualizerEffectBtns .seg-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.effect === state.currentEffect);
    });
    document.querySelectorAll('#bookingSetSelector .set-radio-card').forEach(label => {
      const isMatch = label.dataset.set === state.currentEffect;
      label.classList.toggle('active', isMatch);
      const radio = label.querySelector('input[type="radio"]');
      if (radio) radio.checked = isMatch;
    });
  }

  function setGlobalLashEffect(effectKey) {
    if (!LASH_SETS[effectKey]) return;
    state.currentEffect = effectKey;
    renderAllEyeVisualizers();
  }

  document.querySelectorAll('.effect-chip, #visualizerEffectBtns .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setGlobalLashEffect(btn.dataset.effect);
      triggerEyeBlink();
    });
  });

  document.querySelectorAll('.btn-preview-set').forEach(btn => {
    btn.addEventListener('click', () => {
      setGlobalLashEffect(btn.dataset.set);
      document.getElementById('probador').scrollIntoView({ behavior: 'smooth' });
      setTimeout(triggerEyeBlink, 450);
    });
  });

  document.querySelectorAll('.btn-select-set').forEach(btn => {
    btn.addEventListener('click', () => {
      setGlobalLashEffect(btn.dataset.set);
      document.getElementById('agenda').scrollIntoView({ behavior: 'smooth' });
      showToast(`💕 Seleccionaste ${LASH_SETS[btn.dataset.set].name} por $600 MXN`);
    });
  });

  document.querySelectorAll('#bookingSetSelector .set-radio-card').forEach(card => {
    card.addEventListener('click', () => {
      setGlobalLashEffect(card.dataset.set);
    });
  });

  const lengthRange = document.getElementById('lengthRange');
  const lengthValueLabel = document.getElementById('lengthValueLabel');
  if (lengthRange) {
    lengthRange.addEventListener('input', (e) => {
      state.currentLength = parseInt(e.target.value, 10);
      const desc = state.currentLength <= 10 ? 'Natural Sutil' : (state.currentLength <= 13 ? 'Medio Ideal' : 'Glam Intenso');
      if (lengthValueLabel) lengthValueLabel.textContent = `${state.currentLength} mm (${desc})`;
      renderAllEyeVisualizers();
    });
  }

  document.querySelectorAll('#curlPills .curl-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      state.currentCurl = pill.dataset.curl;
      document.querySelectorAll('#curlPills .curl-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderAllEyeVisualizers();
    });
  });

  // ==========================================================================
  // 3. MOTOR DE CITAS Y BOT DE INSTAGRAM (PRIORIDAD AL PRIMERO + DESVÍO 11:30)
  // ==========================================================================
  function getTimestampMs() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    return `${hh}:${mm}:${ss}.${ms}`;
  }

  function addSystemLog(text) {
    const logList = document.getElementById('systemLogList');
    if (!logList) return;
    const li = document.createElement('li');
    li.textContent = `[${getTimestampMs()}] ${text}`;
    logList.prepend(li);
  }

  function setPipelineStep(stepNumber) {
    for (let i = 1; i <= 4; i++) {
      const el = document.getElementById(`pipeStep${i}`);
      if (el) el.classList.toggle('active', i <= stepNumber);
    }
  }

  function findNextAvailableSlotAfter(requestedTime) {
    const idx = state.slots.findIndex(s => s.time === requestedTime);
    if (idx !== -1) {
      for (let i = idx + 1; i < state.slots.length; i++) {
        if (state.slots[i].status === 'free') {
          return state.slots[i];
        }
      }
    }
    return state.slots.find(s => s.status === 'free') || null;
  }

  function getFreeSlotsListText() {
    const free = state.slots.filter(s => s.status === 'free').map(s => `**${s.label}**`);
    return free.length ? free.join(', ') : 'Sin espacios hoy';
  }

  function renderScheduleEverywhere() {
    const monitorSlotsList = document.getElementById('monitorSlotsList');
    if (monitorSlotsList) {
      monitorSlotsList.innerHTML = state.slots.map(slot => {
        const isSuggested = state.suggestedSlot === slot.time && slot.status === 'free';
        const rowClass = slot.status === 'booked' ? 'is-booked' : (isSuggested ? 'is-suggested' : '');
        let pillHtml = `<span class="slot-status-pill free">DISPONIBLE</span>`;
        if (slot.status === 'booked') {
          pillHtml = `<span class="slot-status-pill taken">🔒 ${slot.client} · ${slot.set}</span>`;
        } else if (isSuggested) {
          pillHtml = `<span class="slot-status-pill next-up">⚡ SUGERIDO +30M</span>`;
        }
        return `
          <div class="monitor-slot-row ${rowClass}">
            <span class="slot-hour-mono">${slot.label}</span>
            ${pillHtml}
          </div>
        `;
      }).join('');
    }

    const nextFree = state.slots.find(s => s.status === 'free');
    const heroNextSlotText = document.getElementById('heroNextSlotText');
    if (heroNextSlotText) {
      heroNextSlotText.textContent = nextFree ? nextFree.label : 'Agenda llena hoy';
    }

    const webTimeSlotsGrid = document.getElementById('webTimeSlotsGrid');
    const selectedTimeInput = document.getElementById('selectedTimeSlot');
    if (webTimeSlotsGrid) {
      const currentSlotObj = state.slots.find(s => s.time === state.selectedWebSlot);
      if (currentSlotObj && currentSlotObj.status === 'booked') {
        const fallback = findNextAvailableSlotAfter(state.selectedWebSlot);
        if (fallback) {
          state.selectedWebSlot = fallback.time;
          if (selectedTimeInput) selectedTimeInput.value = fallback.time;
        }
      }

      webTimeSlotsGrid.innerHTML = state.slots.map(slot => {
        const isBooked = slot.status === 'booked';
        const isSelected = !isBooked && state.selectedWebSlot === slot.time;
        const isSuggested = !isBooked && state.suggestedSlot === slot.time;

        let statusSub = 'Disponible · $600';
        if (isBooked) statusSub = `Ocupado (${slot.client})`;
        else if (isSuggested) statusSub = '✨ Sugerido (+30m)';

        return `
          <button type="button"
                  class="slot-btn ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''} ${isSuggested ? 'suggested-next' : ''}"
                  data-time="${slot.time}">
            <span>${slot.label}</span>
            <small>${statusSub}</small>
          </button>
        `;
      }).join('');

      webTimeSlotsGrid.querySelectorAll('.slot-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const clickedTime = btn.dataset.time;
          const slotObj = state.slots.find(s => s.time === clickedTime);
          const alertBox = document.getElementById('webConflictAlert');
          const alertText = document.getElementById('webConflictText');

          if (slotObj && slotObj.status === 'booked') {
            const nextSlot = findNextAvailableSlotAfter(clickedTime);
            if (nextSlot) {
              state.selectedWebSlot = nextSlot.time;
              state.suggestedSlot = nextSlot.time;
              if (selectedTimeInput) selectedTimeInput.value = nextSlot.time;
              if (alertBox && alertText) {
                alertBox.classList.remove('hidden');
                alertText.innerHTML = `El horario de las <strong>${slotObj.label}</strong> ya fue agendado por <strong>${slotObj.client}</strong>. Te seleccionamos automáticamente las <strong>${nextSlot.label}</strong> ($600 MXN).`;
              }
              renderScheduleEverywhere();
            }
          } else {
            state.selectedWebSlot = clickedTime;
            if (selectedTimeInput) selectedTimeInput.value = clickedTime;
            if (alertBox) alertBox.classList.add('hidden');
            renderScheduleEverywhere();
          }
        });
      });
    }

    const confirmedList = document.getElementById('confirmedAppointmentsList');
    if (confirmedList) {
      const bookedSlots = state.slots.filter(s => s.status === 'booked');
      confirmedList.innerHTML = bookedSlots.map(s => `
        <div class="confirmed-item">
          <div>
            <strong>${s.client}</strong>
            <span style="display:block;font-size:0.76rem;color:#875C6F;">Set ${s.set} · $600 MXN (${s.channel})</span>
          </div>
          <span class="confirmed-time">${s.label}</span>
        </div>
      `).join('');
    }
  }

  function appendChatMessage(clientKey, sender, htmlText, isHighlight = false) {
    const container = document.getElementById(clientKey === 'A' ? 'chatMessagesA' : 'chatMessagesB');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender} ${isHighlight ? 'bot-highlight' : ''}`;
    const formatted = htmlText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    bubble.innerHTML = `
      <div>${formatted}</div>
      <span class="bubble-meta">${sender === 'user' ? 'Enviado' : 'Bot Emmy Lash'} · ${getTimestampMs()}</span>
    `;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  }

  function detectRequestedSet(msgText) {
    const lower = msgText.toLowerCase();
    if (lower.includes('wispy')) return 'Wispy';
    if (lower.includes('rimel') || lower.includes('rímel') || lower.includes('wet')) return 'Efecto Rímel';
    if (lower.includes('hibrid') || lower.includes('híbrid')) return 'Híbrido';
    if (lower.includes('clasic') || lower.includes('clásic')) return 'Clásico';
    return LASH_SETS[state.currentEffect].shortName;
  }

  function detectRequestedTime(msgText, clientKey) {
    const lower = msgText.toLowerCase();
    if (lower.includes('11:30') || lower.includes('11 y media') || lower.includes('once y media')) return '11:30';
    if (lower.includes('11:00') || /\b11\b/.test(lower) || lower.includes('once')) return '11:00';
    if (lower.includes('13:00') || /\b1:00\b/.test(lower) || /\b1 pm\b/.test(lower)) return '13:00';
    if (lower.includes('15:30') || lower.includes('3:30')) return '15:30';
    if (lower.includes('17:00') || /\b5:00\b/.test(lower)) return '17:00';
    if (lower.includes('18:00') || /\b6:00\b/.test(lower)) return '18:00';

    if (
      state.clientPendingSuggestion[clientKey] &&
      (lower.includes('sí') || lower.includes('si') || lower.includes('ok') || lower.includes('va') || lower.includes('perfecto') || lower.includes('agend'))
    ) {
      return state.clientPendingSuggestion[clientKey];
    }
    return null;
  }

  function handleInstagramClientMessage(clientKey, rawMessage) {
    const text = rawMessage.trim();
    if (!text) return;

    const clientHandle = clientKey === 'A' ? '@nataly.gdl' : '@sonny.lashes';
    const badgeEl = document.getElementById(clientKey === 'A' ? 'badgeClientA' : 'badgeClientB');

    appendChatMessage(clientKey, 'user', text);

    const lower = text.toLowerCase();
    const requestedTime = detectRequestedTime(text, clientKey);
    const chosenSet = detectRequestedSet(text);

    if (!requestedTime && (lower.includes('horario') || lower.includes('disponible') || lower.includes('hola') || lower.includes('precio') || lower.includes('cuánto') || lower.includes('cuanto') || lower.includes('cita'))) {
      setPipelineStep(1);
      addSystemLog(`Consulta recibida de ${clientHandle}`);

      setTimeout(() => {
        appendChatMessage(
          clientKey,
          'bot',
          `¡Hola hermosa! ✨ En **Emmy Lash Studio** cualquier set (**Clásico, Híbrido, Efecto Rímel o Wispy**) está en **$600 MXN**.\n\nHoy tenemos disponibles: ${getFreeSlotsListText()}.\n\n¿Qué horario te gustaría agendar?`
        );
      }, 260);
      return;
    }

    if (requestedTime) {
      const slotObj = state.slots.find(s => s.time === requestedTime);

      if (!slotObj) {
        setTimeout(() => {
          appendChatMessage(clientKey, 'bot', `Ese horario no está disponible hoy, hermosa. Tenemos: ${getFreeSlotsListText()}.`);
        }, 240);
        return;
      }

      if (slotObj.status === 'free') {
        slotObj.status = 'booked';
        slotObj.client = clientHandle;
        slotObj.set = chosenSet;
        slotObj.channel = 'IG Bot';

        if (state.suggestedSlot === requestedTime) {
          state.suggestedSlot = null;
        }
        state.clientPendingSuggestion[clientKey] = null;

        setPipelineStep(2);
        addSystemLog(`🔒 CITA APARTADA: ${clientHandle} ganó las ${slotObj.label} (${chosenSet} $600)`);
        if (badgeEl) {
          badgeEl.textContent = `✓ Agendada ${slotObj.label}`;
          badgeEl.className = 'client-tag locked-win';
        }

        renderScheduleEverywhere();

        setTimeout(() => {
          appendChatMessage(
            clientKey,
            'bot',
            `¡Listo hermosa! 🎉 Tu respuesta llegó primero y ya tienes agendada tu cita hoy a las **${slotObj.label}** para tu **Set ${chosenSet} ($600 MXN)** en Burgos Bugambilias 1350 B-planta alta. ¡Te esperamos! 💖`,
            true
          );
          showToast(`✅ Bot IG: ${clientHandle} agendó a las ${slotObj.label} ($600)`);
        }, 240);
      } else {
        const nextSlot = findNextAvailableSlotAfter(requestedTime);
        setPipelineStep(4);

        if (nextSlot) {
          state.suggestedSlot = nextSlot.time;
          state.clientPendingSuggestion[clientKey] = nextSlot.time;

          addSystemLog(`⚡ ${slotObj.label} OCUPADO (${clientHandle}) -> Bot ofrece ${nextSlot.label}`);
          if (badgeEl) {
            badgeEl.textContent = `Sugerido → ${nextSlot.label}`;
            badgeEl.className = 'client-tag redirected-next';
          }

          renderScheduleEverywhere();

          setTimeout(() => {
            appendChatMessage(
              clientKey,
              'bot',
              `¡Ay hermosa! 💕 Bueno, **tenemos a las ${nextSlot.label} porque ya captamos la otra cita agendada a las ${slotObj.label}**.\n\n¿Te agendamos a las **${nextSlot.label}** para tu **Set ${chosenSet} ($600 MXN)**?`,
              true
            );
            showToast(`⚡ Smart-Lock™: ${slotObj.label} ocupado → Bot ofreció ${nextSlot.label}`);
          }, 260);
        } else {
          setTimeout(() => {
            appendChatMessage(
              clientKey,
              'bot',
              `¡Lo sentimos hermosa! El horario de las **${slotObj.label}** ya se ocupó y por hoy se llenó la agenda.`
            );
          }, 260);
        }
      }
      return;
    }

    setTimeout(() => {
      appendChatMessage(
        clientKey,
        'bot',
        `¡Claro hermosa! Cualquier set (**Clásico, Híbrido, Rímel y Wispy**) cuesta **$600 MXN**. Horarios libres hoy: ${getFreeSlotsListText()}. Escríbeme por ejemplo: *"Quiero a las 11:00"* 💕`
      );
    }, 250);
  }

  function initInstagramChats() {
    const chatA = document.getElementById('chatMessagesA');
    const chatB = document.getElementById('chatMessagesB');
    if (chatA) chatA.innerHTML = '';
    if (chatB) chatB.innerHTML = '';

    appendChatMessage(
      'A',
      'bot',
      `¡Hola hermosa! Bienvenida a **Emmy Lash Studio** 🌸 (Sta. Margarita, Zapopan). Todos nuestros sets están en **$600 MXN**. Pregúntame qué horarios tenemos hoy.`
    );
    appendChatMessage(
      'B',
      'bot',
      `¡Hola hermosa! Bienvenida a **Emmy Lash Studio** 🌸 (Sta. Margarita, Zapopan). Todos nuestros sets están en **$600 MXN**. Pregúntame qué horarios tenemos hoy.`
    );
  }

  document.querySelectorAll('.ig-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      handleInstagramClientMessage(chip.dataset.client, chip.dataset.msg);
    });
  });

  document.querySelectorAll('.ig-input-bar').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const client = form.dataset.client;
      const input = form.querySelector('input');
      if (input && input.value.trim()) {
        handleInstagramClientMessage(client, input.value);
        input.value = '';
      }
    });
  });

  let demoTimeouts = [];
  function clearDemoTimeouts() {
    demoTimeouts.forEach(t => clearTimeout(t));
    demoTimeouts = [];
  }

  function resetSimulationState() {
    clearDemoTimeouts();
    state.slots = JSON.parse(JSON.stringify(INITIAL_SLOTS));
    state.suggestedSlot = null;
    state.selectedWebSlot = '11:00';
    state.clientPendingSuggestion = { A: null, B: null };

    const badgeA = document.getElementById('badgeClientA');
    const badgeB = document.getElementById('badgeClientB');
    if (badgeA) {
      badgeA.textContent = 'Lista para chatear';
      badgeA.className = 'client-tag';
    }
    if (badgeB) {
      badgeB.textContent = 'Lista para chatear';
      badgeB.className = 'client-tag';
    }

    const logList = document.getElementById('systemLogList');
    if (logList) logList.innerHTML = '';
    addSystemLog('Agenda lista (9:30 a 6:30). 11:00 AM y 11:30 AM disponibles ($600).');

    setPipelineStep(1);
    initInstagramChats();
    renderScheduleEverywhere();
  }

  const btnRunRaceDemo = document.getElementById('btnRunRaceDemo');
  const btnResetBotDemo = document.getElementById('btnResetBotDemo');

  if (btnResetBotDemo) {
    btnResetBotDemo.addEventListener('click', () => {
      resetSimulationState();
      showToast('🔄 Horarios reiniciados: 11:00 AM y 11:30 AM disponibles nuevamente');
    });
  }

  if (btnRunRaceDemo) {
    btnRunRaceDemo.addEventListener('click', () => {
      resetSimulationState();
      showToast('⚡ Simulando: 2 clientas preguntan horarios y confirman a las 11:00 AM...');

      demoTimeouts.push(setTimeout(() => {
        handleInstagramClientMessage('A', 'Hola! ¿Qué horarios tienes disponibles hoy?');
      }, 300));

      demoTimeouts.push(setTimeout(() => {
        handleInstagramClientMessage('B', 'Hola hermosa, ¿qué horarios tienes hoy?');
      }, 550));

      demoTimeouts.push(setTimeout(() => {
        handleInstagramClientMessage('A', 'Quiero confirmar a las 11:00 AM con Efecto Wispy');
      }, 1700));

      demoTimeouts.push(setTimeout(() => {
        setPipelineStep(3);
        handleInstagramClientMessage('B', 'Me quedo con las 11:00 AM con Efecto Rímel');
      }, 2500));

      demoTimeouts.push(setTimeout(() => {
        handleInstagramClientMessage('B', 'Sí! Perfecto, agéndame a las 11:30 AM entonces');
      }, 4200));
    });
  }

  // ==========================================================================
  // 4. OPINIONES DE GOOGLE MAPS (ME GUSTA + MODAL DE COMPARTIR EN IG/WA)
  // ==========================================================================
  document.querySelectorAll('.btn-like-review').forEach(btn => {
    btn.addEventListener('click', () => {
      const countEl = btn.querySelector('.like-count');
      if (!countEl) return;
      let count = parseInt(countEl.textContent, 10) || 0;
      if (btn.classList.contains('liked')) {
        btn.classList.remove('liked');
        countEl.textContent = String(count - 1);
      } else {
        btn.classList.add('liked');
        countEl.textContent = String(count + 1);
        showToast('💖 ¡Gracias por darle Me gusta a esta reseña de Emmy Lash Studio!');
      }
    });
  });

  const shareModalBackdrop = document.getElementById('shareModalBackdrop');
  const btnCloseShareModal = document.getElementById('btnCloseShareModal');
  const modalReviewQuote = document.getElementById('modalReviewQuote');
  const modalReviewAuthor = document.getElementById('modalReviewAuthor');
  const modalWhatsappShareBtn = document.getElementById('modalWhatsappShareBtn');
  const modalCopyReviewBtn = document.getElementById('modalCopyReviewBtn');

  let currentShareText = '';

  function openShareReviewModal(author, quote) {
    if (!shareModalBackdrop) return;
    if (modalReviewQuote) modalReviewQuote.textContent = `“${quote}”`;
    if (modalReviewAuthor) modalReviewAuthor.textContent = `— ${author} · Reseña 5.0★ en Google Maps`;

    currentShareText = `⭐ 5.0 en Google Maps — Emmy Lash Studio (Zapopan)\n"${quote}" — ${author}\n✨ Cualquier Set (Clásico, Híbrido, Rímel o Wispy) por $600 MXN.\n📍 ${EMMY_ADDRESS}\n📲 Citas al WhatsApp: 33 2619 2669`;

    if (modalWhatsappShareBtn) {
      modalWhatsappShareBtn.href = `https://wa.me/?text=${encodeURIComponent(currentShareText)}`;
    }
    shareModalBackdrop.classList.remove('hidden');
  }

  document.querySelectorAll('.btn-share-review').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.review-card');
      if (!card) return;
      openShareReviewModal(card.dataset.author, card.dataset.quote);
    });
  });

  const btnShareAllReviews = document.getElementById('btnShareAllReviews');
  if (btnShareAllReviews) {
    btnShareAllReviews.addEventListener('click', () => {
      openShareReviewModal(
        'Clientas de Emmy Lash Studio',
        'Calificación perfecta de 5.0★ en Google Maps. Aplicación súper detallista, limpia y pestañas duraderas por $600 MXN.'
      );
    });
  }

  if (btnCloseShareModal && shareModalBackdrop) {
    btnCloseShareModal.addEventListener('click', () => shareModalBackdrop.classList.add('hidden'));
    shareModalBackdrop.addEventListener('click', (e) => {
      if (e.target === shareModalBackdrop) shareModalBackdrop.classList.add('hidden');
    });
  }

  if (modalCopyReviewBtn) {
    modalCopyReviewBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(currentShareText).then(() => {
        showToast('📋 ¡Reseña copiada! Lista para pegar en Instagram o WhatsApp');
      });
    });
  }

  const btnShareLocation = document.getElementById('btnShareLocation');
  if (btnShareLocation) {
    btnShareLocation.addEventListener('click', () => {
      const locText = `📍 Emmy Lash Studio (5.0★)\n${EMMY_ADDRESS}\nPlus Code: PHQJ+9G Zapopan, Jalisco\n🕒 9:30 a.m. – 6:30 p.m.\n📲 Agenda al: 33 2619 2669`;
      if (navigator.share) {
        navigator.share({ title: 'Emmy Lash Studio — Ubicación', text: locText, url: window.location.href }).catch(() => {});
      } else {
        navigator.clipboard.writeText(locText).then(() => {
          showToast('📍 ¡Ubicación de Emmy Lash Studio copiada al portapapeles!');
        });
      }
    });
  }

  // ==========================================================================
  // 5. FORMULARIO DE RESERVA WEB + ENVÍO DIRECTO A WHATSAPP DE EMMY (33 2619 2669)
  // ==========================================================================
  const webBookingForm = document.getElementById('webBookingForm');
  if (webBookingForm) {
    webBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('clientName');
      const igInput = document.getElementById('clientIg');
      const clientName = nameInput ? nameInput.value.trim() : 'Clienta';
      const clientIg = igInput ? igInput.value.trim() : '@clienta';
      const chosenSetObj = LASH_SETS[state.currentEffect];
      const targetTime = state.selectedWebSlot;

      const slotObj = state.slots.find(s => s.time === targetTime);
      if (!slotObj) return;

      if (slotObj.status === 'booked') {
        const nextFree = findNextAvailableSlotAfter(targetTime);
        if (nextFree) {
          state.selectedWebSlot = nextFree.time;
          renderScheduleEverywhere();
          showToast(`⚡ ${slotObj.label} ya se ocupó. Te seleccionamos ${nextFree.label} ($600). Confirma de nuevo.`);
        } else {
          showToast('Lo sentimos, todos los horarios de hoy están ocupados.');
        }
        return;
      }

      slotObj.status = 'booked';
      slotObj.client = `${clientName} (${clientIg})`;
      slotObj.set = chosenSetObj.shortName;
      slotObj.channel = 'Web';

      addSystemLog(`🌐 Cita Web: ${clientName} agendó ${slotObj.label} (${chosenSetObj.shortName} $600)`);
      triggerEyeBlink();

      const waMessage = `¡Hola Emmy! ✨ Quiero confirmar mi cita agendada en la web de *Emmy Lash Studio*:\n\n• *Nombre:* ${clientName}\n• *Contacto:* ${clientIg}\n• *Diseño:* ${chosenSetObj.name} (${state.currentLength}mm · Curva ${state.currentCurl})\n• *Precio único:* $600 MXN\n• *Horario apartado:* Hoy a las ${slotObj.label}\n• *Ubicación:* Burgos Bugambilias 1350 B-planta alta`;

      const nextAvailable = findNextAvailableSlotAfter(targetTime);
      if (nextAvailable) {
        state.selectedWebSlot = nextAvailable.time;
      }

      renderScheduleEverywhere();
      showToast(`🎉 ¡Cita registrada a las ${slotObj.label}! Abriendo WhatsApp de Emmy (33 2619 2669)...`);

      setTimeout(() => {
        window.open(`https://wa.me/${EMMY_PHONE_WA}?text=${encodeURIComponent(waMessage)}`, '_blank');
      }, 650);

      webBookingForm.reset();
      setGlobalLashEffect(state.currentEffect);
    });
  }

  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 260);
    }, 3600);
  }

  renderAllEyeVisualizers();
  resetSimulationState();
});
