/**
 * ============================================================================
 * LUMILASH STUDIO — WEBHOOK PARA BOT DE INSTAGRAM (META GRAPH API / NODE.JS)
 * ============================================================================
 * Regla de Negocio Implementada:
 * - Todos los sets cuestan $600 MXN: Clásico, Híbrido, Efecto Rímel y Wispy.
 * - Si 2 personas preguntan en Instagram qué horarios hay y reciben "11:00 AM",
 *   la PRIMERA que envíe su confirmación asegura las 11:00 AM.
 * - Cuando llega la confirmación de la SEGUNDA persona para las 11:00 AM,
 *   el bot detecta que ya está apartado y le responde automáticamente:
 *   "Bueno, tenemos a las 11:30 AM porque ya captamos la otra agendada."
 */

const express = require('express');
const app = express();
app.use(express.json());

// Catálogo único ($600 MXN cualquier set)
const LASH_CATALOG = ['Clásico', 'Híbrido', 'Efecto Rímel', 'Wispy'];
const FLAT_PRICE_MXN = 600;

// Agenda en memoria con bloqueo atómico por horario (bloques de 30 min)
const dailySchedule = [
  { time: '11:00', label: '11:00 AM', bookedBy: null, set: null, bookedAt: null },
  { time: '11:30', label: '11:30 AM', bookedBy: null, set: null, bookedAt: null },
  { time: '12:00', label: '12:00 PM', bookedBy: null, set: null, bookedAt: null },
  { time: '12:30', label: '12:30 PM', bookedBy: null, set: null, bookedAt: null },
  { time: '13:00', label: '1:00 PM',  bookedBy: null, set: null, bookedAt: null },
  { time: '16:00', label: '4:00 PM',  bookedBy: null, set: null, bookedAt: null }
];

// Sugerencia pendiente por usuario cuando su horario original fue ganado por alguien más
const pendingFallbackByUser = new Map();

/**
 * Encuentra el siguiente bloque disponible (+30 min) después de la hora pedida.
 */
function getNextAvailableSlot(requestedTime) {
  const index = dailySchedule.findIndex(s => s.time === requestedTime);
  if (index !== -1) {
    for (let i = index + 1; i < dailySchedule.length; i++) {
      if (!dailySchedule[i].bookedBy) {
        return dailySchedule[i];
      }
    }
  }
  return dailySchedule.find(s => !s.bookedBy) || null;
}

/**
 * Procesa el mensaje entrante de Instagram Direct y devuelve la respuesta del Bot.
 */
function processInstagramDM(senderIgId, messageText) {
  const lower = (messageText || '').toLowerCase();

  // 1. Detectar si menciona una hora (ej. 11:00 o 11:30) o acepta la sugerencia previa
  let requestedTime = null;
  if (lower.includes('11:30')) requestedTime = '11:30';
  else if (lower.includes('11:00') || /\b11\b/.test(lower)) requestedTime = '11:00';
  else if (lower.includes('12:00') || /\b12\b/.test(lower)) requestedTime = '12:00';
  else if (lower.includes('12:30')) requestedTime = '12:30';
  else if (
    pendingFallbackByUser.has(senderIgId) &&
    (lower.includes('si') || lower.includes('sí') || lower.includes('ok') || lower.includes('va'))
  ) {
    requestedTime = pendingFallbackByUser.get(senderIgId);
  }

  // 2. Detectar efecto elegido ($600 todos)
  let chosenSet = 'Clásico';
  if (lower.includes('wispy')) chosenSet = 'Wispy';
  else if (lower.includes('rimel') || lower.includes('rímel')) chosenSet = 'Efecto Rímel';
  else if (lower.includes('hibrid') || lower.includes('híbrid')) chosenSet = 'Híbrido';

  // Si pregunta por horarios o precios:
  if (!requestedTime) {
    const freeLabels = dailySchedule.filter(s => !s.bookedBy).map(s => s.label).join(', ');
    return `¡Hola hermosa! ✨ Cualquier set (${LASH_CATALOG.join(', ')}) está en $${FLAT_PRICE_MXN} MXN. Hoy tenemos disponible a las: ${freeLabels}. ¿Cuál horario te gustaría confirmar?`;
  }

  // Si intenta confirmar un horario específico:
  const targetSlot = dailySchedule.find(s => s.time === requestedTime);
  if (!targetSlot) {
    return `Ese horario no está disponible, hermosa. Escríbenos cuál prefieres de nuestra lista.`;
  }

  // CASO 1: ¡Es la primera persona en confirmar ese horario!
  if (!targetSlot.bookedBy) {
    targetSlot.bookedBy = senderIgId;
    targetSlot.set = chosenSet;
    targetSlot.bookedAt = Date.now();
    pendingFallbackByUser.delete(senderIgId);

    return `¡Listo hermosa! 🎉 Fuiste la primera en confirmar y ya tienes tu cita agendada a las ${targetSlot.label} para tu Set ${chosenSet} ($${FLAT_PRICE_MXN} MXN).`;
  }

  // CASO 2: Otra persona confirmó milisegundos antes -> Ofrecer automáticamente +30 min (ej. 11:30 AM)
  const fallbackSlot = getNextAvailableSlot(requestedTime);
  if (fallbackSlot) {
    pendingFallbackByUser.set(senderIgId, fallbackSlot.time);
    return `¡Hola hermosa! 💕 Bueno, tenemos disponible a las ${fallbackSlot.label} porque ya captamos la otra cita agendada a las ${targetSlot.label}. Recuerda que cualquier set está en $${FLAT_PRICE_MXN} MXN. ¿Te agendamos a las ${fallbackSlot.label}?`;
  }

  return `¡Lo sentimos hermosa! El horario de las ${targetSlot.label} ya fue agendado y por hoy se llenaron todos los espacios.`;
}

// Endpoint Webhook para Instagram / Meta Graph API
app.post('/webhook/instagram', (req, res) => {
  const { senderId, text } = req.body;
  const reply = processInstagramDM(senderId || '@clienta_ig', text || '');
  res.json({ ok: true, reply, schedule: dailySchedule });
});

module.exports = { app, processInstagramDM, dailySchedule };
