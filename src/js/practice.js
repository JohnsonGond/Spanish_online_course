import './course-data.js';
import './main.js';

// Simple shadowing controller (graceful even if TTS fails)
const startBtn = document.getElementById('shadow-start');
const stopBtn = document.getElementById('shadow-stop');
const pauseInput = document.getElementById('shadow-pause');
const slowChk = document.getElementById('shadow-slow');
const lines = Array.from(document.querySelectorAll('#shadowing-list .shadowing-line'));
let timer = null, index = 0;

function clearCurrent() {
    lines.forEach(l => l.classList.remove('shadowing-current'));
}
function playCurrent() {
    clearCurrent();
    const line = lines[index];
    if (!line) return;
    line.classList.add('shadowing-current');
    const toClick = line.querySelector(slowChk.checked ? '.speak-icon-slow' : '.speak-icon');
    if (toClick) toClick.click();
}
function scheduleNext() {
    const pauseMs = Math.max(1, parseInt(pauseInput.value || '3', 10)) * 1000;
    timer = setTimeout(() => {
        index = (index + 1) % lines.length;
        playCurrent();
        scheduleNext();
    }, pauseMs);
}
function start() {
    if (timer) return;
    index = 0;
    playCurrent();
    scheduleNext();
}
function stop() {
    clearTimeout(timer);
    timer = null;
    clearCurrent();
}
startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
window.addEventListener('beforeunload', stop);

// Simple cloze checker (on blur)
document.querySelectorAll('[data-answer]').forEach((inp) => {
    inp.addEventListener('blur', () => {
        const ans = (inp.getAttribute('data-answer') || '').trim().toLowerCase();
        const val = (inp.value || '').trim().toLowerCase();
        if (!ans) return;
        if (val === ans) {
            inp.style.borderColor = '#28a745';
        } else {
            inp.style.borderColor = '#dc3545';
        }
    });
});

// Email generator
const genName = document.getElementById('gen-name');
const genPurpose = document.getElementById('gen-purpose');
const genDeadline = document.getElementById('gen-deadline');
const genClosing = document.getElementById('gen-closing');
const genBuild = document.getElementById('gen-build');
const genCopy = document.getElementById('gen-copy');
const genOutput = document.getElementById('gen-output');
const GEN_KEY = 'practiceEmailDraft';
const loadDraft = () => {
    try { return JSON.parse(localStorage.getItem(GEN_KEY)) || {}; } catch { return {}; }
};
const saveDraft = (data) => localStorage.setItem(GEN_KEY, JSON.stringify(data));

function buildEmail() {
    const name = (genName.value || '').trim();
    const purpose = (genPurpose.value || '').trim();
    const deadline = (genDeadline.value || '').trim();
    const closing = (genClosing.value || '').trim();
    const greet = 'Buenos días,';
    const bodyParts = [];
    if (purpose) bodyParts.push(`¿Podrías ${purpose}?`);
    if (deadline) bodyParts.push(`Es ${deadline}.`);
    const signoff = closing || 'Quedo atento/a.';
    const signature = name ? `
${name}` : '';
    const full = `${greet}
${bodyParts.join(' ')}
${signoff}${signature}`;
    genOutput.innerHTML = `<pre><code>${full.replace(/[&<>]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</code></pre>`;
    saveDraft({ name, purpose, deadline, closing });
}
genBuild?.addEventListener('click', buildEmail);
genCopy?.addEventListener('click', async () => {
    const text = genOutput.textContent || '';
    try { await navigator.clipboard.writeText(text); genCopy.textContent = '已复制'; setTimeout(() => genCopy.textContent = '复制', 1200); } catch {}
});
const draft = loadDraft();
if (draft) {
    if (draft.name) genName.value = draft.name;
    if (draft.purpose) genPurpose.value = draft.purpose;
    if (draft.deadline) genDeadline.value = draft.deadline;
    if (draft.closing) genClosing.value = draft.closing;
    buildEmail();
}
