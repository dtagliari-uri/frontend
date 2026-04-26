
/* ════════════════════════════════════════
   1. DARK/LIGHT MODE
════════════════════════════════════════ */
const body = document.body;
const modeBtn = document.getElementById('mode-toggle');

// Load saved preference
if (localStorage.getItem('showcase-theme') === 'light') {
  body.classList.add('light');
  modeBtn.textContent = '☀️';
}

modeBtn.addEventListener('click', () => {
  body.classList.toggle('light');
  const isLight = body.classList.contains('light');
  modeBtn.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('showcase-theme', isLight ? 'light' : 'dark');
});

/* ════════════════════════════════════════
   2. SCROLL PROGRESS + BACK TO TOP
════════════════════════════════════════ */
const scrollBar = document.getElementById('scroll-bar');
const backTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
  scrollBar.style.width = pct + '%';

  // Back to top visibility
  if (window.scrollY > 400) backTop.classList.add('visible');
  else backTop.classList.remove('visible');

  // Navbar active link
  updateActiveNav();
  updateBreakpoints();
}, { passive: true });

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ════════════════════════════════════════
   3. SCROLL REVEAL (IntersectionObserver)
════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.07 });

document.querySelectorAll('.showcase-section').forEach(s => revealObserver.observe(s));

/* ════════════════════════════════════════
   4. ACTIVE NAVBAR LINK
════════════════════════════════════════ */
function updateActiveNav() {
  const sections = document.querySelectorAll('.showcase-section');
  const navLinks = document.querySelectorAll('.navbar-nav a');

  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 100 && rect.bottom >= 100) {
      navLinks.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.navbar-nav a[href="#${sec.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}

/* ════════════════════════════════════════
   5. MOBILE NAV
════════════════════════════════════════ */
function toggleMobileNav() {
  const nav = document.getElementById('navbar-nav');
  const btn = document.getElementById('hamburger');
  const isOpen = nav.classList.toggle('mobile-open');
  btn.textContent = isOpen ? '✕' : '☰';
  btn.setAttribute('aria-expanded', isOpen.toString());
}

// Close mobile nav on link click
document.querySelectorAll('.navbar-nav a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navbar-nav').classList.remove('mobile-open');
    document.getElementById('hamburger').textContent = '☰';
    document.getElementById('hamburger').setAttribute('aria-expanded', 'false');
  });
});

/* ════════════════════════════════════════
   6. RESPONSIVE BREAKPOINT INDICATOR
════════════════════════════════════════ */
function updateBreakpoints() {
  const w = window.innerWidth;
  document.getElementById('bp-xs').classList.toggle('active', w < 480);
  document.getElementById('bp-sm').classList.toggle('active', w >= 480 && w < 768);
  document.getElementById('bp-md').classList.toggle('active', w >= 768 && w < 1024);
  document.getElementById('bp-lg').classList.toggle('active', w >= 1024);
}

window.addEventListener('resize', updateBreakpoints);
updateBreakpoints();

/* ════════════════════════════════════════
   7. HTTP REQUEST ANIMATION
════════════════════════════════════════ */
async function animarRequisicao() {
  const reqArrow = document.getElementById('req-arrow');
  const resArrow = document.getElementById('res-arrow');
  const log = document.getElementById('req-log');
  const btn = document.getElementById('req-btn');

  btn.disabled = true;

  // Step 1 — client sends request
  reqArrow.style.opacity = '1';
  log.textContent = '① Cliente envia: GET /index.html HTTP/1.1';
  await sleep(1200);

  // Step 2 — server processes
  reqArrow.style.opacity = '0.3';
  log.textContent = '② Servidor processa a requisição... (DNS → TCP → HTTP)';
  await sleep(900);

  // Step 3 — response
  resArrow.style.opacity = '1';
  log.textContent = '③ Servidor responde: HTTP/1.1 200 OK + HTML payload';
  await sleep(1200);

  // Step 4 — render
  log.textContent = '④ Browser recebe o HTML e renderiza a página. ✓ Completo!';
  await sleep(1800);

  // Reset
  reqArrow.style.opacity = '0';
  resArrow.style.opacity = '0';
  log.textContent = '';
  btn.disabled = false;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ════════════════════════════════════════
   8. HTML TAG EXPLORER
════════════════════════════════════════ */
const tagContent = {
  semantic: `<div>
        <p style="font-size:0.82rem;color:var(--mode-txt2);margin-bottom:1rem;">Tags semânticas transmitem significado ao browser e ao SEO:</p>
        <div style="display:flex;flex-direction:column;gap:0.5rem;">
          ${['header', 'nav', 'main', 'section', 'article', 'aside', 'footer'].map(t => `
          <div style="display:flex;align-items:center;gap:0.75rem;padding:0.6rem;background:var(--mode-bg2);border-radius:8px;border:1px solid var(--mode-border);">
            <code style="color:var(--blue);font-family:'Fira Code',monospace;font-size:0.82rem;min-width:90px;">&lt;${t}&gt;</code>
            <span style="font-size:0.82rem;color:var(--mode-txt2);">${{ header: 'Cabeçalho da página ou seção', nav: 'Bloco de links de navegação', main: 'Conteúdo principal (único)', section: 'Seção temática com heading', article: 'Conteúdo autônomo', aside: 'Conteúdo lateral/complementar', footer: 'Rodapé da página' }[t]}</span>
          </div>`).join('')}
        </div></div>`,

  form: `<form onsubmit="event.preventDefault()" style="display:flex;flex-direction:column;gap:0.75rem;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
          <input type="text" placeholder="&lt;input type=text&gt;" style="padding:0.5rem;background:var(--mode-bg2);border:1px solid var(--mode-border);border-radius:6px;color:var(--mode-txt);">
          <input type="email" placeholder="&lt;input type=email&gt;" style="padding:0.5rem;background:var(--mode-bg2);border:1px solid var(--mode-border);border-radius:6px;color:var(--mode-txt);">
          <input type="password" placeholder="&lt;input type=password&gt;" style="padding:0.5rem;background:var(--mode-bg2);border:1px solid var(--mode-border);border-radius:6px;color:var(--mode-txt);">
          <input type="number" placeholder="&lt;input type=number&gt;" style="padding:0.5rem;background:var(--mode-bg2);border:1px solid var(--mode-border);border-radius:6px;color:var(--mode-txt);">
          <input type="date" style="padding:0.5rem;background:var(--mode-bg2);border:1px solid var(--mode-border);border-radius:6px;color:var(--mode-txt);">
          <select style="padding:0.5rem;background:var(--mode-bg2);border:1px solid var(--mode-border);border-radius:6px;color:var(--mode-txt);"><option>&lt;select&gt;</option><option>Opção 1</option></select>
        </div>
        <textarea rows="2" placeholder="&lt;textarea&gt; — campo de texto longo" style="padding:0.5rem;background:var(--mode-bg2);border:1px solid var(--mode-border);border-radius:6px;color:var(--mode-txt);"></textarea>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <label style="display:flex;align-items:center;gap:0.4rem;font-size:0.82rem;"><input type="radio" name="rg"> Radio 1</label>
          <label style="display:flex;align-items:center;gap:0.4rem;font-size:0.82rem;"><input type="radio" name="rg"> Radio 2</label>
          <label style="display:flex;align-items:center;gap:0.4rem;font-size:0.82rem;"><input type="checkbox"> Checkbox A</label>
          <label style="display:flex;align-items:center;gap:0.4rem;font-size:0.82rem;"><input type="checkbox"> Checkbox B</label>
        </div>
        <button type="submit" style="padding:0.6rem;background:linear-gradient(135deg,var(--blue),var(--purple));color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;">&lt;button type="submit"&gt;</button>
      </form>`,

  table: `<table style="width:100%;border-collapse:collapse;font-size:0.82rem;">
        <caption style="text-align:left;font-size:0.78rem;color:var(--mode-txt2);margin-bottom:0.5rem;">&lt;table&gt; com thead, tbody, tfoot</caption>
        <thead><tr style="border-bottom:2px solid var(--mode-border);">
          <th style="padding:0.75rem;text-align:left;color:var(--blue);">Tag</th>
          <th style="padding:0.75rem;text-align:left;color:var(--blue);">Finalidade</th>
          <th style="padding:0.75rem;text-align:left;color:var(--blue);">Obrigatório?</th>
        </tr></thead>
        <tbody>
          ${[['&lt;thead&gt;', 'Cabeçalho da tabela', 'Recomendado'], ['&lt;tbody&gt;', 'Corpo de dados', 'Recomendado'], ['&lt;tr&gt;', 'Linha de dados', 'Sim'], ['&lt;th&gt;', 'Célula de cabeçalho', 'Sim (em thead)'], ['&lt;td&gt;', 'Célula de dado', 'Sim'], ['&lt;caption&gt;', 'Descrição da tabela', 'WCAG A11Y']].map((r, i) => `
          <tr style="border-bottom:1px solid rgba(255,255,255,0.05);background:${i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'};">
            <td style="padding:0.6rem;font-family:'Fira Code',monospace;color:var(--cyan);">${r[0]}</td>
            <td style="padding:0.6rem;color:var(--mode-txt2);">${r[1]}</td>
            <td style="padding:0.6rem;color:${r[2] === 'Sim' ? 'var(--green)' : 'var(--mode-txt2)'};">${r[2]}</td>
          </tr>`).join('')}
        </tbody>
      </table>`,

  media: `<div style="display:flex;flex-direction:column;gap:1rem;">
        <div>
          <p style="font-size:0.75rem;color:var(--mode-txt2);margin-bottom:0.4rem;">&lt;audio controls&gt; — Player de áudio nativo:</p>
          <audio controls style="width:100%;" aria-label="Demonstração de audio HTML5">
            <source src="https://www.soundjay.com/buttons/beep-01a.mp3" type="audio/mpeg">
            Seu navegador não suporta &lt;audio&gt;.
          </audio>
        </div>
        <div>
          <p style="font-size:0.75rem;color:var(--mode-txt2);margin-bottom:0.4rem;">&lt;video controls&gt; — Player de vídeo nativo:</p>
          <video controls width="100%" style="border-radius:8px;max-height:200px;" aria-label="Demonstração de video HTML5">
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
            Seu navegador não suporta &lt;video&gt;.
          </video>
        </div>
        <div>
          <p style="font-size:0.75rem;color:var(--mode-txt2);margin-bottom:0.4rem;">&lt;iframe&gt; — Conteúdo externo embutido:</p>
          <iframe src="https://info.cern.ch" title="Primeiro website do mundo — CERN" width="100%" height="150" style="border:1px solid var(--mode-border);border-radius:8px;background:#fff;" loading="lazy"></iframe>
        </div>
      </div>`,

  'meta-demo': `<div style="display:flex;flex-direction:column;gap:0.75rem;">
        <p style="font-size:0.82rem;color:var(--mode-txt2);">Meta tags no &lt;head&gt; controlam charset, viewport, SEO e redes sociais:</p>
        ${[
      ['charset', 'UTF-8', 'Codificação de caracteres. Sempre UTF-8.'],
      ['viewport', 'width=device-width, initial-scale=1.0', 'Controla escala em dispositivos móveis. Obrigatório para responsive.'],
      ['description', 'Texto até 155 chars...', 'Snippet exibido nos resultados do Google (SEO crítico).'],
      ['og:title', 'Título para redes sociais', 'OpenGraph — compartilhamento no Facebook, LinkedIn, WhatsApp.'],
      ['og:image', 'URL da imagem', 'Imagem exibida quando o link é compartilhado nas redes.'],
    ].map(([n, v, d]) => `
        <div style="background:var(--mode-bg2);border:1px solid var(--mode-border);border-radius:8px;padding:0.75rem;">
          <code style="font-family:'Fira Code',monospace;font-size:0.76rem;color:var(--blue);">&lt;meta name="${n}" content="${v}"&gt;</code>
          <p style="font-size:0.78rem;color:var(--mode-txt2);margin-top:0.25rem;">${d}</p>
        </div>`).join('')}
      </div>`
};

function showTag(key) {
  document.getElementById('tag-display').innerHTML = tagContent[key];
  document.querySelectorAll('.layout-tab').forEach((t, i) => {
    const keys = ['semantic', 'form', 'table', 'media', 'meta-demo'];
    t.classList.toggle('active', keys[i] === key);
    t.setAttribute('aria-pressed', (keys[i] === key).toString());
  });
}

// Init HTML explorer
showTag('semantic');

/* ════════════════════════════════════════
   9. FORM VALIDATION
════════════════════════════════════════ */
function validateField(id, check, okMsg, errMsg) {
  const el = document.getElementById(id);
  const msg = document.getElementById(id + '-msg');
  if (!el || !msg) return true;
  const valid = check(el.value);
  el.classList.toggle('valid', valid);
  el.classList.toggle('invalid', !valid && el.value.length > 0);
  if (el.value.length === 0) { msg.textContent = ''; msg.className = 'field-msg'; return false; }
  msg.textContent = valid ? okMsg : errMsg;
  msg.className = 'field-msg ' + (valid ? 'ok' : 'err');
  return valid;
}

document.getElementById('f-name').addEventListener('input', () =>
  validateField('f-name', v => v.trim().length >= 3, '✓ Nome válido', '✗ Mínimo 3 caracteres'));

document.getElementById('f-email').addEventListener('input', () =>
  validateField('f-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), '✓ E-mail válido', '✗ E-mail inválido'));

document.getElementById('f-pass').addEventListener('input', () =>
  validateField('f-pass', v => v.length >= 8, '✓ Senha forte', '✗ Mínimo 8 caracteres'));

document.getElementById('f-age').addEventListener('input', () =>
  validateField('f-age', v => !v || (Number(v) >= 1 && Number(v) <= 120), '✓ Idade válida', '✗ Entre 1 e 120'));

function handleFormSubmit(e) {
  e.preventDefault();
  const nameOk = validateField('f-name', v => v.trim().length >= 3, '✓ OK', '✗ Mínimo 3 caracteres');
  const emailOk = validateField('f-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), '✓ OK', '✗ E-mail inválido');
  const passOk = validateField('f-pass', v => v.length >= 8, '✓ OK', '✗ Mínimo 8 caracteres');

  // Advanced Validation: Radio & Checkbox
  const levelSelected = document.querySelector('input[name="level"]:checked');
  const levelMsg = document.getElementById('f-level-msg');
  if (!levelSelected) {
    levelMsg.textContent = '✗ Selecione seu nível';
    levelMsg.className = 'field-msg err';
  } else {
    levelMsg.textContent = '✓ OK';
    levelMsg.className = 'field-msg ok';
  }

  const techSelected = document.querySelectorAll('input[name="tech"]:checked');
  const techMsg = document.getElementById('f-tech-msg');
  if (techSelected.length === 0) {
    techMsg.textContent = '✗ Selecione ao menos uma tecnologia';
    techMsg.className = 'field-msg err';
  } else {
    techMsg.textContent = '✓ OK';
    techMsg.className = 'field-msg ok';
  }

  const result = document.getElementById('form-result');
  result.style.display = 'block';

  if (nameOk && emailOk && passOk && levelSelected && techSelected.length > 0) {
    result.style.background = 'rgba(52,211,153,0.12)';
    result.style.border = '1px solid rgba(52,211,153,0.3)';
    result.style.color = 'var(--green)';
    result.textContent = '✓ Formulário enviado com sucesso! (simulação — nenhum dado foi enviado)';
  } else {
    result.style.background = 'rgba(248,113,113,0.12)';
    result.style.border = '1px solid rgba(248,113,113,0.3)';
    result.style.color = 'var(--red)';
    result.textContent = '✗ Corrija os campos em vermelho antes de continuar.';
  }
}

function resetForm() {
  document.getElementById('form-result').style.display = 'none';
  document.querySelectorAll('#showcase-form .field-msg').forEach(m => { m.textContent = ''; m.className = 'field-msg'; });
  document.querySelectorAll('#showcase-form input').forEach(i => { i.classList.remove('valid', 'invalid'); });
}

/* ════════════════════════════════════════
   10. CSS PLAYGROUND
════════════════════════════════════════ */
const cssState = { shadow: false, radius: false, gradient: false, rotate: false, scale: false, blur: false, opacity: false };

function toggleCSS(prop) {
  cssState[prop] = !cssState[prop];
  const tog = document.getElementById('tog-' + prop);
  tog.classList.toggle('on', cssState[prop]);
  tog.setAttribute('aria-checked', cssState[prop].toString());

  const el = document.getElementById('preview-el');
  const rules = [];
  if (cssState.shadow) rules.push('box-shadow: 0 0 40px rgba(79,142,247,0.7)');
  if (cssState.radius) rules.push('border-radius: 50%');
  if (cssState.gradient) el.style.backgroundSize = '200% 200%';
  if (cssState.rotate) rules.push('transform: rotate(45deg)');
  if (cssState.scale) rules.push('transform: ' + (cssState.rotate ? 'rotate(45deg) scale(1.5)' : 'scale(1.5)'));
  if (cssState.blur) rules.push('filter: blur(3px)');
  if (cssState.opacity) rules.push('opacity: 0.3');

  let combined = {};
  rules.forEach(r => {
    const [k, v] = r.split(/: (.+)/);
    combined[k.trim()] = v.trim();
  });

  el.style.boxShadow = cssState.shadow ? '0 0 40px rgba(79,142,247,0.7)' : '';
  el.style.borderRadius = cssState.radius ? '50%' : '12px';
  el.style.filter = cssState.blur ? 'blur(3px)' : '';
  el.style.opacity = cssState.opacity ? '0.3' : '';

  let transform = '';
  if (cssState.rotate) transform += 'rotate(45deg) ';
  if (cssState.scale) transform += 'scale(1.5)';
  el.style.transform = transform.trim();

  // Update code display
  const activeRules = Object.entries(cssState).filter(([, v]) => v).map(([k]) => k);
  const codeLines = [
    `.preview-target {`,
    `  background: linear-gradient(135deg, #4f8ef7, #a855f7);`,
    `  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);`,
    ...(cssState.shadow ? [`  box-shadow: 0 0 40px rgba(79,142,247, 0.7);`] : []),
    ...(cssState.radius ? [`  border-radius: 50%;`] : []),
    ...(cssState.rotate ? [`  transform: rotate(45deg);`] : []),
    ...(cssState.scale ? [`  transform: scale(1.5);`] : []),
    ...(cssState.blur ? [`  filter: blur(3px);`] : []),
    ...(cssState.opacity ? [`  opacity: 0.3;`] : []),
    `}`,
  ];
  document.getElementById('css-code-display').textContent = codeLines.join('\n');
}

/* ════════════════════════════════════════
   11. LAYOUT DEMO (FLEX/GRID/POSITION)
════════════════════════════════════════ */
let currentLayout = 'flex';
let flexDir = 'row';
let flexJustify = 'center';
let flexAlign = 'center';
let flexWrap = 'nowrap';
let gridCols = 3;

function setLayout(type) {
  currentLayout = type;
  document.querySelectorAll('.layout-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-pressed', 'false');
  });
  document.getElementById('lt-' + type).classList.add('active');
  document.getElementById('lt-' + type).setAttribute('aria-pressed', 'true');
  renderLayoutDemo();
}

function renderLayoutDemo() {
  const container = document.getElementById('layout-children');
  const controls = document.getElementById('layout-controls');
  const codeEl = document.getElementById('layout-code');
  const label = document.getElementById('layout-label');

  const children = Array.from({ length: 4 }, (_, i) => `<div class="demo-child">Item ${i + 1}</div>`).join('');

  if (currentLayout === 'flex') {
    label.textContent = 'Flexbox Demo';
    container.style.cssText = `display:flex;flex-direction:${flexDir};justify-content:${flexJustify};align-items:${flexAlign};flex-wrap:${flexWrap};gap:10px;height:100%;min-height:180px;`;
    container.innerHTML = children;
    controls.innerHTML = `
          <select onchange="flexDir=this.value;renderLayoutDemo()" aria-label="flex-direction" style="padding:0.4rem;background:var(--mode-bg2);border:1px solid var(--mode-border);border-radius:6px;color:var(--mode-txt);">
            ${['row', 'column', 'row-reverse', 'column-reverse'].map(v => `<option ${v === flexDir ? 'selected' : ''}>${v}</option>`).join('')}
          </select>
          <select onchange="flexJustify=this.value;renderLayoutDemo()" aria-label="justify-content" style="padding:0.4rem;background:var(--mode-bg2);border:1px solid var(--mode-border);border-radius:6px;color:var(--mode-txt);">
            ${['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'].map(v => `<option ${v === flexJustify ? 'selected' : ''}>${v}</option>`).join('')}
          </select>
          <select onchange="flexAlign=this.value;renderLayoutDemo()" aria-label="align-items" style="padding:0.4rem;background:var(--mode-bg2);border:1px solid var(--mode-border);border-radius:6px;color:var(--mode-txt);">
            ${['flex-start', 'center', 'flex-end', 'stretch', 'baseline'].map(v => `<option ${v === flexAlign ? 'selected' : ''}>${v}</option>`).join('')}
          </select>
          <select onchange="flexWrap=this.value;renderLayoutDemo()" aria-label="flex-wrap" style="padding:0.4rem;background:var(--mode-bg2);border:1px solid var(--mode-border);border-radius:6px;color:var(--mode-txt);">
            ${['nowrap', 'wrap', 'wrap-reverse'].map(v => `<option ${v === flexWrap ? 'selected' : ''}>${v}</option>`).join('')}
          </select>`;
    codeEl.textContent = `.container {\n  display: flex;\n  flex-direction: ${flexDir};\n  justify-content: ${flexJustify};\n  align-items: ${flexAlign};\n  flex-wrap: ${flexWrap};\n  gap: 10px;\n}`;

  } else if (currentLayout === 'grid') {
    label.textContent = 'CSS Grid Demo';
    container.style.cssText = `display:grid;grid-template-columns:repeat(${gridCols},1fr);gap:10px;`;
    container.innerHTML = children;
    controls.innerHTML = `
          <label style="font-size:0.82rem;color:var(--mode-txt2)">Colunas:
          <input type="range" min="1" max="5" value="${gridCols}" oninput="gridCols=+this.value;this.nextSibling.textContent=this.value;renderLayoutDemo()" style="margin:0 0.5rem;vertical-align:middle;"><span>${gridCols}</span>
          </label>`;
    codeEl.textContent = `.container {\n  display: grid;\n  grid-template-columns: repeat(${gridCols}, 1fr);\n  gap: 10px;\n}`;

  } else {
    label.textContent = 'Position Demo';
    container.style.cssText = 'position:relative;height:180px;';
    container.innerHTML = `
          <div class="demo-child" style="position:static;height:40px;flex:none;width:auto;min-width:0;padding:0.5rem 1rem;font-size:0.78rem;">static</div>
          <div class="demo-child" style="position:relative;top:10px;left:10px;height:40px;flex:none;width:auto;min-width:0;padding:0.5rem 1rem;font-size:0.78rem;">relative (top:10,left:10)</div>
          <div class="demo-child" style="position:absolute;top:0;right:0;height:40px;flex:none;width:auto;min-width:0;padding:0.5rem 1rem;font-size:0.78rem;background:linear-gradient(135deg,var(--green),var(--cyan));">absolute (top:0,right:0)</div>`;
    controls.innerHTML = '<span style="font-size:0.8rem;color:var(--mode-txt2)">Demonstração de position: static, relative e absolute</span>';
    codeEl.textContent = `.parent { position: relative; }\n.static   { position: static; }\n.relative { position: relative; top: 10px; left: 10px; }\n.absolute { position: absolute; top: 0; right: 0; }`;
  }
}

renderLayoutDemo();

/* ════════════════════════════════════════
   12. JS FUNDAMENTALS DEMOS
════════════════════════════════════════ */

// Template literals & variables
function updateGreeting() {
  const name = document.getElementById('js-name-in').value;
  const year = parseInt(document.getElementById('js-year-in').value);
  const out = document.getElementById('js-greeting-out');

  if (!name && !year) { out.textContent = '// Saída aparecerá aqui'; return; }

  const currentYear = new Date().getFullYear();
  const age = year ? currentYear - year : '?';
  out.textContent = `const nome = "${name || 'Anônimo'}";\nconst idade = ${age};\nconsole.log(\`Olá, ${name || 'Anônimo'}! Você tem ${age} anos.\`);`;
}

// Array methods
const sampleArr = [3, 7, 12, 1, 45, 8, 23, 6];

function runArrayDemo(method) {
  const codeOut = document.getElementById('array-code-out');
  const resOut = document.getElementById('array-result-out');
  const arr = sampleArr;

  const demos = {
    map: {
      code: `const arr = [${arr}];\narr.map(x => x * 2);\n// Multiplica cada elemento por 2`,
      result: `→ [${arr.map(x => x * 2).join(', ')}]`
    },
    filter: {
      code: `const arr = [${arr}];\narr.filter(x => x > 10);\n// Mantém apenas os maiores que 10`,
      result: `→ [${arr.filter(x => x > 10).join(', ')}]`
    },
    reduce: {
      code: `const arr = [${arr}];\narr.reduce((acc, x) => acc + x, 0);\n// Soma todos os elementos`,
      result: `→ ${arr.reduce((a, b) => a + b, 0)} (soma total)`
    },
    foreach: {
      code: `const arr = [${arr}];\narr.forEach(x => console.log(x * x));\n// Eleva ao quadrado (efeito colateral)`,
      result: `→ ${arr.map(x => x * x).join(', ')}`
    }
  };

  codeOut.textContent = demos[method].code;
  resOut.textContent = demos[method].result;
}

// DOM manipulation
let domCounter = 0;

function domAddItem() {
  const list = document.getElementById('dom-list');
  domCounter++;
  const li = document.createElement('li');
  li.style.cssText = 'display:flex;align-items:center;gap:0.5rem;padding:0.5rem 0.75rem;background:var(--mode-surface);border:1px solid var(--mode-border);border-radius:8px;font-size:0.83rem;animation:slideIn 0.3s ease;';
  li.innerHTML = `<span style="color:var(--blue);font-family:'Fira Code',monospace;font-size:0.72rem;min-width:28px;">#${domCounter}</span>
        <span style="color:var(--mode-txt);">Elemento criado dinamicamente</span>
        <button onclick="this.parentElement.remove()" style="margin-left:auto;background:none;border:none;color:var(--red);cursor:pointer;font-size:0.8rem;" aria-label="Remover item">✕</button>`;
  list.appendChild(li);
}

function domClearItems() { document.getElementById('dom-list').innerHTML = ''; domCounter = 0; }

// Loop demo
function runLoop() {
  const n = parseInt(document.getElementById('loop-n').value) || 5;
  const out = document.getElementById('loop-out');
  out.innerHTML = '';
  const colors = ['var(--blue)', 'var(--purple)', 'var(--cyan)', 'var(--green)', 'var(--pink)'];
  for (let i = 1; i <= n; i++) {
    const el = document.createElement('div');
    el.style.cssText = `width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;color:#fff;background:${colors[(i - 1) % 5]};animation:fadeUp 0.3s ease ${(i - 1) * 0.05}s both;`;
    el.textContent = i;
    el.setAttribute('aria-label', `Item ${i}`);
    out.appendChild(el);
  }
}

/* ════════════════════════════════════════
   13. CALCULATOR
════════════════════════════════════════ */
let calcExpr = '';
let calcResult = false;

function calcInput(val) {
  const disp = document.getElementById('calc-display');

  if (val === 'C') { calcExpr = ''; calcResult = false; disp.textContent = '0'; return; }

  if (val === '=') {
    try {
      // Replace display chars with JS operators
      const sanitized = calcExpr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
      if (!sanitized) return;
      const res = Function('"use strict";return (' + sanitized + ')')();
      disp.textContent = parseFloat(res.toFixed(10)).toString();
      calcExpr = disp.textContent;
      calcResult = true;
    } catch { disp.textContent = 'Erro'; calcExpr = ''; }
    return;
  }

  if (val === '±') {
    if (calcExpr.startsWith('-')) calcExpr = calcExpr.slice(1);
    else calcExpr = '-' + calcExpr;
    disp.textContent = calcExpr || '0';
    return;
  }

  if (val === '%') {
    try {
      const v = Function('"use strict";return (' + calcExpr.replace(/×/g, '*').replace(/÷/g, '/') + ')')();
      calcExpr = (v / 100).toString();
      disp.textContent = calcExpr;
    } catch { }
    return;
  }

  if (calcResult && /[0-9.]/.test(val)) { calcExpr = ''; calcResult = false; }

  calcExpr += val;
  disp.textContent = calcExpr;
}

/* ════════════════════════════════════════
   14. TO-DO LIST
════════════════════════════════════════ */
let todos = [];

function addTodo() {
  const inp = document.getElementById('todo-in');
  const text = inp.value.trim();
  if (!text) return;
  todos.push({ id: Date.now(), text, done: false });
  inp.value = '';
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  renderTodos();
}

function renderTodos() {
  const list = document.getElementById('todo-list');
  const count = document.getElementById('todo-count');
  list.innerHTML = todos.map(t => `
        <li class="todo-item ${t.done ? 'done' : ''}" role="listitem">
          <div class="todo-check" onclick="toggleTodo(${t.id})" role="checkbox" aria-checked="${t.done}" tabindex="0" aria-label="${t.done ? 'Desmarcar' : 'Marcar'}: ${t.text}">${t.done ? '✓' : ''}</div>
          <span class="todo-text">${t.text}</span>
          <button class="todo-del" onclick="deleteTodo(${t.id})" aria-label="Remover tarefa: ${t.text}">✕</button>
        </li>`).join('');
  count.textContent = `${todos.length} tarefa${todos.length !== 1 ? 's' : ''} · ${todos.filter(t => t.done).length} concluída${todos.filter(t => t.done).length !== 1 ? 's' : ''}`;
}

// Init with sample todos
todos = [
  { id: 1, text: 'Estudar HTML5 semântico', done: true },
  { id: 2, text: 'Praticar Flexbox e Grid', done: false },
  { id: 3, text: 'Fazer quiz de revisão', done: false }
];
renderTodos();

/* ════════════════════════════════════════
   15. COUNTDOWN TIMER
════════════════════════════════════════ */
let timerInterval = null;
let timerSeconds = 0;

function timerStart() {
  if (timerInterval) return;
  const m = parseInt(document.getElementById('timer-min').value) || 0;
  const s = parseInt(document.getElementById('timer-sec').value) || 0;
  if (timerSeconds === 0) timerSeconds = m * 60 + s;
  if (timerSeconds <= 0) return;

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      document.getElementById('timer-display').textContent = '🔔 Tempo!';
      document.getElementById('timer-display').classList.remove('urgent');
    }
  }, 1000);
}

function timerPause() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function timerReset() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerSeconds = 0;
  document.getElementById('timer-display').textContent = '00:00';
  document.getElementById('timer-display').classList.remove('urgent');
}

function updateTimerDisplay() {
  const m = Math.floor(timerSeconds / 60);
  const s = timerSeconds % 60;
  const disp = document.getElementById('timer-display');
  disp.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  disp.classList.toggle('urgent', timerSeconds <= 10 && timerSeconds > 0);
}

/* ════════════════════════════════════════
   16. DYNAMIC PRODUCT CARDS
════════════════════════════════════════ */
const productsData = [
  { name: 'Notebook Pro', cat: 'tech', emoji: '💻', price: 'R$ 4.299', desc: 'I7 + 16GB RAM' },
  { name: 'Fone Noise Cancelling', cat: 'tech', emoji: '🎧', price: 'R$ 799', desc: 'Bluetooth 5.3' },
  { name: 'Smartwatch Ultra', cat: 'tech', emoji: '⌚', price: 'R$ 1.599', desc: 'GPS integrado' },
  { name: 'Café Especial', cat: 'food', emoji: '☕', price: 'R$ 49', desc: 'Arábica 250g' },
  { name: 'Kit Granola Premium', cat: 'food', emoji: '🥣', price: 'R$ 35', desc: 'Sem adição de açúcar' },
  { name: 'Whey Protein', cat: 'food', emoji: '💪', price: 'R$ 129', desc: 'Chocolate 900g' },
  { name: 'Clean Code', cat: 'book', emoji: '📗', price: 'R$ 89', desc: 'Robert C. Martin' },
  { name: 'You Don\'t Know JS', cat: 'book', emoji: '📘', price: 'R$ 79', desc: 'Kyle Simpson' },
  { name: 'Design Patterns', cat: 'book', emoji: '📙', price: 'R$ 99', desc: 'Gang of Four' },
];

function filterProducts(cat) {
  document.querySelectorAll('#sec-components .layout-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-pressed', 'false');
  });
  event.target.classList.add('active');
  event.target.setAttribute('aria-pressed', 'true');

  const filtered = cat === 'all' ? productsData : productsData.filter(p => p.cat === cat);
  renderProducts(filtered);
}

function renderProducts(data) {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = data.map(p => `
        <article class="product-card" aria-label="Produto: ${p.name}">
          <span class="product-emoji" aria-hidden="true">${p.emoji}</span>
          <div class="product-name">${p.name}</div>
          <div class="product-cat">${p.cat}</div>
          <div style="font-size:0.78rem;color:var(--mode-txt2);margin-bottom:0.4rem;">${p.desc}</div>
          <div class="product-price">${p.price}</div>
          <button class="product-btn" onclick="alert('${p.name} adicionado ao carrinho! 🛒')" aria-label="Adicionar ${p.name} ao carrinho">+ Carrinho</button>
        </article>`).join('');
}

renderProducts(productsData);

/* ════════════════════════════════════════
   17. MINI QUIZ
════════════════════════════════════════ */
const miniQuizData = [
  {
    q: 'Em que ano Tim Berners-Lee criou o World Wide Web?',
    opts: ['1969', '1983', '1991', '1995'],
    correct: 2,
    explain: '1991 — no CERN, com o primeiro website em info.cern.ch'
  },
  {
    q: 'Qual verbo HTTP é usado para CRIAR um novo recurso?',
    opts: ['GET', 'PUT', 'POST', 'DELETE'],
    correct: 2,
    explain: 'POST — retorna geralmente 201 Created'
  },
  {
    q: 'Qual propriedade CSS cria um layout bidimensional (linhas E colunas)?',
    opts: ['display: flex', 'display: grid', 'display: block', 'display: inline'],
    correct: 1,
    explain: 'CSS Grid é 2D — controla linhas e colunas simultaneamente'
  }
];

let miniQ = 0, miniScore = 0, miniAnswered = false;

function renderMiniQuiz() {
  const wrap = document.getElementById('mini-quiz-wrap');
  if (miniQ >= miniQuizData.length) {
    wrap.innerHTML = `<div style="text-align:center;padding:1.5rem;">
          <div style="font-size:2.5rem;font-weight:900;background:linear-gradient(90deg,var(--blue),var(--purple));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">${miniScore}/${miniQuizData.length}</div>
          <p style="color:var(--mode-txt2);margin:0.5rem 0 1rem;">Quiz concluído! ${miniScore === miniQuizData.length ? '🏆 Perfeito!' : ''}</p>
          <button class="btn btn-primary" onclick="miniQ=0;miniScore=0;miniAnswered=false;renderMiniQuiz()">↺ Repetir</button>
        </div>`;
    return;
  }

  const q = miniQuizData[miniQ];
  wrap.innerHTML = `
        <div class="quiz-card">
          <div style="font-size:0.72rem;color:var(--mode-txt2);margin-bottom:0.75rem;">Questão ${miniQ + 1} de ${miniQuizData.length} · Pontos: ${miniScore}</div>
          <p class="quiz-q-text">${q.q}</p>
          <div class="quiz-opts">
            ${q.opts.map((o, i) => `<button class="quiz-opt-btn" id="mq-opt-${i}" onclick="answerMini(${i})" aria-label="Resposta: ${o}">${o}</button>`).join('')}
          </div>
          <div id="mini-fb" style="font-size:0.82rem;min-height:1rem;margin-top:0.75rem;" aria-live="polite"></div>
          <button id="mini-next" class="btn btn-primary" onclick="miniQ++;miniAnswered=false;renderMiniQuiz()" style="margin-top:1rem;display:none;" aria-label="Próxima questão">Próxima →</button>
        </div>`;
}

function answerMini(idx) {
  if (miniAnswered) return;
  miniAnswered = true;
  const q = miniQuizData[miniQ];
  const fb = document.getElementById('mini-fb');
  const next = document.getElementById('mini-next');

  document.querySelectorAll('.quiz-opt-btn').forEach((b, i) => {
    b.disabled = true;
    if (i === q.correct) b.classList.add('correct');
    else if (i === idx) b.classList.add('wrong');
  });

  if (idx === q.correct) {
    miniScore++;
    fb.style.color = 'var(--green)';
    fb.textContent = `✓ Correto! ${q.explain}`;
  } else {
    fb.style.color = 'var(--red)';
    fb.textContent = `✗ Incorreto. ${q.explain}`;
  }
  next.style.display = 'inline-flex';
}

renderMiniQuiz();

/* ════════════════════════════════════════
   18. FETCH API DEMO
════════════════════════════════════════ */
async function loadFetchData(type) {
  // Update active tab
  document.querySelectorAll('.fetch-tabs .layout-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-pressed', 'false');
  });
  document.getElementById('fetch-tab-' + type).classList.add('active');
  document.getElementById('fetch-tab-' + type).setAttribute('aria-pressed', 'true');

  const status = document.getElementById('fetch-status');
  const content = document.getElementById('fetch-content');

  // Loading state
  status.style.display = 'block';
  status.className = 'fetch-status loading';
  status.textContent = '⟳ Buscando dados de jsonplaceholder.typicode.com...';
  content.innerHTML = '<div class="spinner"></div>';

  try {
    const limit = type === 'posts' ? 6 : 8;
    const res = await fetch(`https://jsonplaceholder.typicode.com/${type}?_limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    status.className = 'fetch-status success';
    status.textContent = `✓ ${data.length} ${type} carregados com sucesso!`;

    if (type === 'posts') {
      content.innerHTML = `<div class="posts-list">${data.map(p => `
            <div class="post-card" role="article" aria-label="Post: ${p.title}">
              <h4>#${p.id} — ${p.title}</h4>
              <p>${p.body}</p>
            </div>`).join('')}</div>`;
    } else {
      content.innerHTML = `<div class="posts-list">${data.map(u => `
            <div class="user-card" role="article" aria-label="Usuário: ${u.name}">
              <div class="user-avatar" aria-hidden="true">${u.name.charAt(0)}</div>
              <div class="user-info">
                <h4>${u.name}</h4>
                <p>📧 ${u.email} · 🌐 ${u.website}</p>
              </div>
            </div>`).join('')}</div>`;
    }
  } catch (err) {
    status.className = 'fetch-status error';
    status.textContent = `✗ Erro: ${err.message}`;
    content.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--red);">
          <div style="font-size:2rem;margin-bottom:0.5rem;">⚠️</div>
          <p style="font-weight:700;">Falha na requisição</p>
          <p style="font-size:0.82rem;color:var(--mode-txt2);margin-top:0.25rem;">${err.message}</p>
        </div>`;
  }
}

function simulateFetchError() {
  const status = document.getElementById('fetch-status');
  const content = document.getElementById('fetch-content');
  status.style.display = 'block';
  status.className = 'fetch-status loading';
  status.textContent = '⟳ Tentando conectar a URL inválida...';
  content.innerHTML = '<div class="spinner"></div>';

  setTimeout(() => {
    status.className = 'fetch-status error';
    status.textContent = '✗ Erro 404: Recurso não encontrado (simulado)';
    content.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--red);">
          <div style="font-size:2.5rem;margin-bottom:0.5rem;">❌</div>
          <p style="font-weight:700;">404 — Not Found</p>
          <p style="font-size:0.82rem;color:var(--mode-txt2);margin-top:0.25rem;">Trate sempre erros de rede com try/catch para evitar crash na UI</p>
        </div>`;
  }, 1500);
}

/* ════════════════════════════════════════
   19. A11Y LIVE REGION TEST
════════════════════════════════════════ */
const liveMessages = [
  '✓ Produto adicionado ao carrinho!',
  '📩 Mensagem enviada com sucesso!',
  '⚠️ Preencha todos os campos obrigatórios.',
  '🔔 Notificação: nova mensagem recebida.',
  '✓ Preferências salvas!'
];
let liveIdx = 0;

function testLiveRegion() {
  const el = document.getElementById('live-region-out');
  el.textContent = liveMessages[liveIdx % liveMessages.length];
  liveIdx++;
}

/* ════════════════════════════════════════
   21. NAVIGATOR APIs
════════════════════════════════════════ */
function checkBattery() {
  const fill = document.getElementById('bat-fill');
  const res = document.getElementById('bat-res');
  if (!navigator.getBattery) {
    res.textContent = 'Não suportado';
    return;
  }
  navigator.getBattery().then(bat => {
    const pct = Math.round(bat.level * 100);
    fill.style.width = pct + '%';
    res.textContent = `${pct}% (${bat.charging ? 'Carregando' : 'Bateria'})`;
  });
}

function checkGeo() {
  const res = document.getElementById('geo-res');
  res.textContent = 'Localizando...';
  navigator.geolocation.getCurrentPosition(
    pos => res.textContent = `Lat: ${pos.coords.latitude.toFixed(4)}, Lon: ${pos.coords.longitude.toFixed(4)}`,
    err => res.textContent = 'Erro: ' + err.message
  );
}

function triggerVibrate() {
  const res = document.getElementById('vib-res');
  if (navigator.vibrate) {
    navigator.vibrate(200);
    res.textContent = 'Vibrando! 📳';
  } else {
    res.textContent = 'Não suportado ❌';
  }
}

function askNotify() {
  const res = document.getElementById('not-res');
  Notification.requestPermission().then(p => {
    res.textContent = p === 'granted' ? 'Autorizado! ✅' : 'Negado ❌';
    if (p === 'granted') new Notification('Tagliari Showcase', { body: 'Notificações ativadas!' });
  });
}

function triggerShare() {
  const res = document.getElementById('share-res');
  if (navigator.share) {
    navigator.share({
      title: 'Tagliari Web Showcase',
      text: 'Confira este guia de Programação Web!',
      url: window.location.href
    }).then(() => res.textContent = 'Sucesso!')
      .catch(() => res.textContent = 'Cancelado');
  } else {
    res.textContent = 'Não suportado ❌';
  }
}

function listMedia() {
  const res = document.getElementById('media-res');
  res.innerHTML = '<li>Solicitando...</li>';
  if (!navigator.mediaDevices) {
    res.innerHTML = '<li>Não suportado ❌</li>';
    return;
  }
  navigator.mediaDevices.enumerateDevices().then(devices => {
    res.innerHTML = devices.map(d => `<li>${d.kind === 'videoinput' ? '📷' : '🎤'} ${d.label || d.kind}</li>`).join('') || '<li>Nenhum encontrado</li>';
  }).catch(err => res.innerHTML = `<li>Erro: ${err.message}</li>`);
}

/* ════════════════════════════════════════
   22. JOGO DO CLIQUE
════════════════════════════════════════ */
let gameScore = 0;
let gameTime = 5.0;
let gameInterval = null;

function startGame() {
  gameScore = 0;
  gameTime = 5.0;
  document.getElementById('game-score').textContent = '0';
  document.getElementById('game-timer').textContent = '5.0';
  document.getElementById('game-msg').textContent = 'VAI!';
  document.getElementById('btn-start-game').disabled = true;
  document.getElementById('btn-click-game').disabled = false;

  gameInterval = setInterval(() => {
    gameTime -= 0.1;
    document.getElementById('game-timer').textContent = gameTime.toFixed(1);
    if (gameTime <= 0) {
      clearInterval(gameInterval);
      document.getElementById('game-timer').textContent = '0.0';
      document.getElementById('btn-click-game').disabled = true;
      document.getElementById('btn-start-game').disabled = false;
      document.getElementById('game-msg').textContent = `Fim! Score: ${gameScore}`;
    }
  }, 100);
}

function recordClick() {
  gameScore++;
  document.getElementById('game-score').textContent = gameScore;
  if (navigator.vibrate) navigator.vibrate(50);
}

/* ════════════════════════════════════════
   23. UI LAB (Ripple)
════════════════════════════════════════ */
function createRipple(event) {
  const btn = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.pageX - btn.offsetLeft - radius}px`;
  circle.style.top = `${event.pageY - btn.offsetTop - radius}px`;
  circle.classList.add('ripple');

  const ripple = btn.getElementsByClassName('ripple')[0];
  if (ripple) ripple.remove();

  btn.appendChild(circle);
}

/* Update Network status */
window.addEventListener('online', () => { if (document.getElementById('net-res')) document.getElementById('net-res').textContent = 'Online ✅'; });
window.addEventListener('offline', () => { if (document.getElementById('net-res')) document.getElementById('net-res').textContent = 'Offline 🔴'; });

/* ════════════════════════════════════════
   24. INITIALIZATION
════════════════════════════════════════ */
updateBreakpoints();