const screens = [...document.querySelectorAll('.screen')];
const statusText = document.getElementById('window-status');
const progress = document.querySelector('.progress');
const loveScreen = document.getElementById('love');
const loveButton = document.getElementById('love-button');
const runaway = document.getElementById('runaway');
const runawaySlot = document.getElementById('runaway-slot');
const dateForm = document.getElementById('date-form');
const dateInput = document.getElementById('date');
const dateSummary = document.getElementById('date-summary');
const copyStatus = document.getElementById('copy-status');
const copyFallback = document.getElementById('copy-fallback');
let sacramentoPlan = '';
const mailEntrance = document.getElementById('mail-entrance');
const mailOpen = document.getElementById('mail-open');
const dateDesktop = document.getElementById('date-desktop');
const mailNotice = document.getElementById('mail-notice');
const openInbox = document.getElementById('open-inbox');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const soundToggle = document.getElementById('date-sound');
const music = document.getElementById('date-music');
const volumeSlider = document.getElementById('date-volume');
const volumeValue = document.getElementById('date-volume-value');
const melodies = {
  mail: [523.25, 659.25, 783.99, 1046.5],
  open: [392, 587.33, 783.99],
  flip: [783.99, 987.77, 1174.66],
  reveal: [523.25, 659.25, 783.99, 1046.5, 1318.51],
  tap: [659.25],
  love: [659.25, 880, 1046.5],
};
let audioContext;
let soundGain;
let muted = false;

function playEffect(effect) {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (muted || !Audio) return;
  try {
    if (!audioContext) {
      audioContext = new Audio();
      soundGain = audioContext.createGain();
      soundGain.connect(audioContext.destination);
    }
    if (audioContext.state === 'suspended') void audioContext.resume().catch(() => {});
    const start = audioContext.currentTime + .015;
    melodies[effect].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const note = audioContext.createGain();
      const time = start + index * .083;
      oscillator.type = effect === 'tap' ? 'sine' : 'triangle';
      oscillator.frequency.value = frequency;
      note.gain.setValueAtTime(.001, time);
      note.gain.exponentialRampToValueAtTime(effect === 'tap' ? .025 : .055, time + .018);
      note.gain.exponentialRampToValueAtTime(.001, time + .19);
      oscillator.connect(note).connect(soundGain);
      oscillator.start(time);
      oscillator.stop(time + .2);
    });
  } catch {
    // The invitation remains usable if audio is unavailable.
  }
}

function syncSound() {
  const label = muted ? 'Unmute sound' : 'Mute sound';
  soundToggle.setAttribute('aria-label', label);
  soundToggle.title = label;
  soundToggle.setAttribute('aria-pressed', String(muted));
  music.muted = muted;
  music.volume = Number(volumeSlider.value) / 100;
  if (soundGain) soundGain.gain.value = muted ? 0 : 1;
  volumeValue.textContent = `${muted ? 0 : volumeSlider.value}%`;
}

function startDateMusic() {
  if (!muted && music.paused) void music.play().catch(() => {});
}

soundToggle.addEventListener('click', () => {
  muted = !muted;
  if (!muted && Number(volumeSlider.value) === 0) volumeSlider.value = '35';
  syncSound();
  startDateMusic();
  if (!muted) playEffect('tap');
});
volumeSlider.addEventListener('input', () => {
  muted = Number(volumeSlider.value) === 0;
  syncSound();
  startDateMusic();
});
syncSound();
startDateMusic();
document.addEventListener('click', startDateMusic);
document.addEventListener('keydown', startDateMusic);

function sparkleBurst(origin, count = 18) {
  if (motionPreference.matches) return;
  const bounds = origin.getBoundingClientRect();
  const burst = document.createElement('div');
  burst.className = 'mail-burst';
  burst.setAttribute('aria-hidden', 'true');
  burst.style.left = `${bounds.left + bounds.width / 2}px`;
  burst.style.top = `${bounds.top + bounds.height / 2}px`;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    const angle = i / count * Math.PI * 2;
    const distance = 44 + Math.random() * 95;
    particle.textContent = i % 3 === 0 ? '♥' : '✦';
    particle.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
    particle.style.setProperty('--size', `${8 + Math.random() * 11}px`);
    particle.style.animationDelay = `${i % 4 * 28}ms`;
    burst.append(particle);
  }
  document.body.append(burst);
  setTimeout(() => burst.remove(), 1150);
}

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button || button.disabled || [openInbox, mailOpen, soundToggle, loveButton].includes(button)) return;
  playEffect('tap');
}, true);
dateForm.addEventListener('change', () => playEffect('tap'));

openInbox.addEventListener('click', () => {
  playEffect('mail');
  sparkleBurst(openInbox, 14);
  openInbox.disabled = true;
  const showEnvelope = () => {
    mailNotice.hidden = true;
    mailEntrance.hidden = false;
    mailOpen.focus({ preventScroll: true });
  };
  if (motionPreference.matches) {
    showEnvelope();
    return;
  }
  mailEntrance.inert = true;
  mailEntrance.hidden = false;
  mailNotice.classList.add('inbox-opening');
  setTimeout(() => {
    mailEntrance.inert = false;
    showEnvelope();
  }, 460);
}, { once: true });

mailOpen.addEventListener('click', () => {
  playEffect('open');
  const letter = mailOpen.querySelector('.mail-letter');
  sparkleBurst(mailOpen.querySelector('.mail-seal'), 16);
  mailOpen.disabled = true;
  const reveal = () => {
    dateDesktop.hidden = false;
    dateDesktop.classList.add('arriving');
    mailEntrance.classList.add('leaving');
  };
  const finish = () => {
    mailEntrance.hidden = true;
    dateDesktop.inert = false;
    document.getElementById('start-button').focus({ preventScroll: true });
  };
  if (motionPreference.matches) {
    reveal();
    finish();
    return;
  }
  dateDesktop.inert = true;
  mailEntrance.classList.add('opening');
  setTimeout(() => { playEffect('flip'); sparkleBurst(letter, 22); }, 1380);
  setTimeout(() => { playEffect('reveal'); sparkleBurst(letter, 26); reveal(); }, 2410);
  setTimeout(finish, 3010);
}, { once: true });

function showScreen(id, step, label) {
  const screen = document.getElementById(id);
  for (const item of screens) item.hidden = item !== screen;
  statusText.textContent = label;
  progress.setAttribute('aria-label', `Step ${step} of 3`);
  [...progress.children].forEach((dot, index) => dot.classList.toggle('active', index < step));
  screen.querySelector('h2')?.focus({ preventScroll: true });
}

progress.firstElementChild.classList.add('active');
document.getElementById('start-button').addEventListener('click', () => showScreen('love', 2, 'A little love note'));
loveButton.addEventListener('click', () => {
  playEffect('love');
  sparkleBurst(loveButton, 15);
  showScreen('plan', 3, 'Choose your date');
});

let dodgeAnimation;

function dodge(event) {
  if (loveScreen.hidden || dodgeAnimation?.playState === 'running') return;
  const button = runaway.getBoundingClientRect();
  const buffer = 60;
  if (event.clientX < button.left - buffer || event.clientX > button.right + buffer ||
      event.clientY < button.top - buffer || event.clientY > button.bottom + buffer) return;

  const bounds = loveScreen.getBoundingClientRect();
  const padding = 8;
  const left = Math.max(padding, padding - bounds.left);
  const top = Math.max(padding, padding - bounds.top);
  const right = Math.min(bounds.width, innerWidth - bounds.left) - button.width - padding;
  const bottom = Math.min(bounds.height, innerHeight - bounds.top) - button.height - padding;
  if (right <= left || bottom <= top) return;

  let x = Math.min(right, Math.max(left, button.left - bounds.left));
  let y = Math.min(bottom, Math.max(top, button.top - bounds.top));
  const angle = Math.atan2(button.top + button.height / 2 - event.clientY,
    button.left + button.width / 2 - event.clientX) + (Math.random() - .5) * 1.4;
  let vx = Math.cos(angle) * 13;
  let vy = Math.sin(angle) * 13;
  const frames = [{ left: x + 'px', top: y + 'px' }];
  const safeButton = loveButton.getBoundingClientRect();
  let landing = 0;
  const steps = 18 + Math.floor(Math.random() * 12);

  for (let i = 0; i < steps; i++) {
    x += vx;
    y += vy;
    if (x < left || x > right) {
      x = Math.max(left, Math.min(right, x));
      vx *= -1;
    }
    if (y < top || y > bottom) {
      y = Math.max(top, Math.min(bottom, y));
      vy *= -1;
    }
    frames.push({ left: x + 'px', top: y + 'px' });
    const pageX = bounds.left + x;
    const pageY = bounds.top + y;
    const clearsButton = pageX + button.width + 8 < safeButton.left || pageX > safeButton.right + 8 ||
      pageY + button.height + 8 < safeButton.top || pageY > safeButton.bottom + 8;
    const clearsCursor = event.clientX < pageX - buffer || event.clientX > pageX + button.width + buffer ||
      event.clientY < pageY - buffer || event.clientY > pageY + button.height + buffer;
    if (clearsButton && clearsCursor) landing = i + 1;
  }
  if (!landing) return;

  if (!runaway.classList.contains('moving')) {
    runawaySlot.style.width = button.width + 'px';
    runawaySlot.style.height = button.height + 'px';
    runaway.classList.add('moving');
  }
  Object.assign(runaway.style, frames[landing]);
  if (!motionPreference.matches) {
    dodgeAnimation = runaway.animate(frames.slice(0, landing + 1), { duration: landing * 15 });
  }
}

document.addEventListener('pointermove', dodge);
document.addEventListener('pointerdown', dodge, true);
window.addEventListener('resize', () => {
  dodgeAnimation?.cancel();
  runaway.classList.remove('moving');
  runaway.style.removeProperty('left');
  runaway.style.removeProperty('top');
  runawaySlot.style.removeProperty('width');
  runawaySlot.style.removeProperty('height');
});

const perthZone = 'Australia/Perth';
const sacramentoZone = 'America/Los_Angeles';
const perthToday = new Intl.DateTimeFormat('en-CA', {
  timeZone: perthZone, year: 'numeric', month: '2-digit', day: '2-digit',
}).formatToParts(new Date());
const todayParts = Object.fromEntries(perthToday.map(({ type, value }) => [type, value]));
const today = new Date(Date.UTC(Number(todayParts.year), Number(todayParts.month) - 1, Number(todayParts.day)));
const calendar = document.getElementById('calendar');
const calendarTrigger = document.getElementById('open-calendar');
const calendarDays = document.getElementById('calendar-days');
const dateError = document.getElementById('date-error');
const previousMonth = document.getElementById('previous-month');
const nextMonth = document.getElementById('next-month');
const monthFormat = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' });
const dayFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'full', timeZone: 'UTC' });
const timeField = document.getElementById('time-field');
const timeOptions = document.getElementById('time-options');
const timeError = document.getElementById('time-error');
const activityField = document.getElementById('activity-field');
const activityError = document.getElementById('activity-error');
activityField.addEventListener('change', () => { activityError.hidden = true; });
const localFormats = Object.fromEntries([perthZone, sacramentoZone].map(zone => [
  zone, new Intl.DateTimeFormat('en-US', {
    timeZone: zone, weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }),
]));

function dateInstant(day, hour) {
  // Perth stays on AWST (UTC+08:00). Sacramento's offset depends on the date.
  return new Date(day + 'T' + String(hour).padStart(2, '0') + ':00:00+08:00');
}

function renderTimeOptions() {
  const previous = timeOptions.querySelector(':checked')?.value;
  timeOptions.replaceChildren();
  for (let hour = 0; hour < 24; hour++) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'time';
    input.value = String(hour);
    input.checked = input.value === previous;
    input.setAttribute('aria-describedby', 'time-error');
    const text = document.createElement('span');
    text.textContent = String(hour).padStart(2, '0') + ':00';
    label.append(input, text);
    timeOptions.append(label);
  }
}
timeOptions.addEventListener('change', () => { timeError.hidden = true; });
let selectedDay;
let shownMonth;

function renderCalendar() {
  const year = shownMonth.getUTCFullYear();
  const month = shownMonth.getUTCMonth();
  document.getElementById('calendar-title').textContent = monthFormat.format(shownMonth);
  previousMonth.disabled = new Date(Date.UTC(year, month, 0)) < today;
  calendarDays.replaceChildren();

  for (let i = 0; i < shownMonth.getUTCDay(); i++) {
    calendarDays.append(document.createElement('span'));
  }
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  for (let day = 1; day <= days; day++) {
    const date = new Date(Date.UTC(year, month, day));
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = day;
    button.disabled = date < today;
    button.setAttribute('aria-label', dayFormat.format(date));
    button.setAttribute('aria-pressed', String(date.getTime() === selectedDay?.getTime()));
    if (date.getTime() === today.getTime()) button.setAttribute('aria-current', 'date');
    button.addEventListener('click', () => {
      selectedDay = date;
      dateInput.value = [year, String(month + 1).padStart(2, '0'), String(day).padStart(2, '0')].join('-');
      calendarTrigger.textContent = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: 'UTC' }).format(date);
      calendarTrigger.removeAttribute('aria-invalid');
      dateError.hidden = true;
      renderTimeOptions();
      timeField.hidden = false;
      calendar.close();
    });
    calendarDays.append(button);
  }
}

calendarTrigger.addEventListener('click', () => {
  const date = selectedDay || today;
  shownMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  renderCalendar();
  calendar.showModal();
  (calendarDays.querySelector('[aria-pressed="true"]') || calendarDays.querySelector('button:not(:disabled)'))?.focus();
});
document.getElementById('close-calendar').addEventListener('click', () => calendar.close());
previousMonth.addEventListener('click', () => changeMonth(-1));
nextMonth.addEventListener('click', () => changeMonth(1));
function changeMonth(amount) {
  shownMonth = new Date(Date.UTC(shownMonth.getUTCFullYear(), shownMonth.getUTCMonth() + amount, 1));
  renderCalendar();
  if (previousMonth.disabled && amount < 0) nextMonth.focus();
}

dateForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!dateInput.value) {
    dateError.hidden = false;
    calendarTrigger.setAttribute('aria-invalid', 'true');
    calendarTrigger.focus();
    return;
  }
  const form = new FormData(dateForm);
  const activity = form.get('activity');
  if (!activity) {
    activityError.hidden = false;
    activityField.querySelector('input').focus();
    return;
  }
  const time = form.get('time');
  if (!time) {
    timeError.hidden = false;
    timeOptions.querySelector('input').focus();
    return;
  }
  const instant = dateInstant(form.get('date'), Number(time));
  dateSummary.textContent = activity + ' · ' + localFormats[perthZone].format(instant) + ' (Perth time).';
  sacramentoPlan = activity + ' · ' + localFormats[sacramentoZone].format(instant) + ' (Sacramento time).';
  copyFallback.hidden = true;
  copyStatus.textContent = '';
  showScreen('done', 3, 'Date picked');
});

document.getElementById('edit-date').addEventListener('click', () => showScreen('plan', 3, 'Choose your date'));
document.getElementById('copy-date').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(sacramentoPlan);
    copyFallback.hidden = true;
    copyStatus.textContent = 'Copied! Send it to me when you’re ready.';
  } catch {
    copyStatus.textContent = 'Copy the plan below to send it.';
    copyFallback.value = sacramentoPlan;
    copyFallback.hidden = false;
    copyFallback.select();
  }
});
