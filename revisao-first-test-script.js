

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


/* ═══════════════════════════════════════
   2. SCROLL PROGRESS + BACK TO TOP
═══════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';
  const bt = document.getElementById('back-top');
  window.scrollY > 400 ? bt.classList.add('visible') : bt.classList.remove('visible');
}, { passive: true });

document.getElementById('back-top').addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ═══════════════════════════════════════
   3. STUDY TIMER (POMODORO)
═══════════════════════════════════════ */
let timerSec = 0, timer = null;

function timerStart() {
  if (timer) return;
  if (timerSec === 0) {
    const mins = parseInt(document.getElementById('tk-min').value) || 10;
    timerSec = mins * 60;
  }
  timer = setInterval(() => {
    timerSec--;
    updateTimerDisplay();
    if (timerSec <= 0) {
      clearInterval(timer); timer = null;
      document.getElementById('td').textContent = '⏰ DONE!';
      document.getElementById('td').classList.remove('urgent');
    }
  }, 1000);
}

function timerPause() { clearInterval(timer); timer = null; }

function timerReset() {
  clearInterval(timer); timer = null; timerSec = 0;
  document.getElementById('td').textContent = '00:00';
  document.getElementById('td').classList.remove('urgent');
}

function updateTimerDisplay() {
  const m = Math.floor(timerSec / 60), s = timerSec % 60;
  document.getElementById('td').textContent =
    String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  document.getElementById('td').classList.toggle('urgent', timerSec <= 60 && timerSec > 0);
}

/* ═══════════════════════════════════════
   4. ACCORDION
═══════════════════════════════════════ */
document.querySelectorAll('.accordion-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.accordion-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
  });
});

/* ═══════════════════════════════════════
   5. DNS SIMULATION
═══════════════════════════════════════ */
let dnsRunning = false;

async function runDNS() {
  if (dnsRunning) return;
  dnsRunning = true;
  document.getElementById('dns-btn').disabled = true;
  resetDNS();
  for (let i = 0; i <= 6; i++) {
    const el = document.getElementById('dns-' + i);
    el.classList.add('active');
    await sleep(700);
    el.classList.remove('active');
    el.classList.add('done');
  }
  dnsRunning = false;
  document.getElementById('dns-btn').disabled = false;
}

function resetDNS() {
  for (let i = 0; i <= 6; i++) {
    const el = document.getElementById('dns-' + i);
    el.classList.remove('active', 'done');
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ═══════════════════════════════════════
   6. FIX THE HTML
═══════════════════════════════════════ */
function showFix(id) {
  const el = document.getElementById(id);
  el.classList.toggle('visible');
  const btn = el.previousElementSibling.querySelector('button:last-child');
  if (btn) btn.textContent = el.classList.contains('visible') ? '▲ Ocultar' : 'Ver Correção';
}

function validateFTH(idx) {
  const editor = document.getElementById('fth-editor-' + idx);
  const fb = document.getElementById('fth-fb-' + idx);
  const code = editor.innerText;
  const parser = new DOMParser();
  const doc = parser.parseFromString(code, 'text/html');

  fb.classList.remove('ok', 'err');
  fb.classList.add('visible');

  let errors = [];
  const raw = code.toLowerCase();

  if (idx === 1) {
    const a = doc.querySelector('a');
    if (!a || !a.getAttribute('href')) errors.push('Link &lt;a&gt; precisa de um href válido.');
    const img = doc.querySelector('img');
    if (!img || !img.hasAttribute('alt')) errors.push('Imagem &lt;img&gt; precisa do atributo alt.');
    if (!raw.includes('</h1>')) errors.push('Tag &lt;h1&gt; deve ser fechada corretamente com &lt;/h1&gt;.');
  }

  if (idx === 2) {
    if (raw.includes('type="txt"') || raw.includes("type='txt'")) errors.push('O tipo correto é "text", não "txt".');
    if (!raw.includes('required')) errors.push('Campos obrigatórios devem ter o atributo required.');
    if (doc.querySelectorAll('label').length < 2) errors.push('Use tags &lt;label&gt; para acessibilidade.');
    const form = doc.querySelector('form');
    if (!form || !form.hasAttribute('action') || !form.hasAttribute('method')) errors.push('O formulário precisa de action e method.');
    const inputs = doc.querySelectorAll('input:not([type="submit"])');
    inputs.forEach(i => { if (!i.name) errors.push(`Input ${i.type} precisa do atributo name.`); });
  }

  if (idx === 3) {
    if (raw.includes('<div id="header"') || raw.includes('<div id="main"')) errors.push('Substitua divs genéricas por tags semânticas.');
    if (!doc.querySelector('header')) errors.push('Use &lt;header&gt; para o topo.');
    if (!doc.querySelector('nav')) errors.push('Use &lt;nav&gt; para links de navegação.');
    if (!doc.querySelector('main')) errors.push('Use &lt;main&gt; para o conteúdo principal.');
    if (!doc.querySelector('article')) errors.push('Use &lt;article&gt; para o conteúdo do artigo.');
  }

  if (errors.length === 0) {
    fb.innerHTML = '<strong>✓ Excelente!</strong> Você corrigiu todos os erros deste trecho.';
    fb.classList.add('ok');
  } else {
    fb.innerHTML = '<strong>⚠ Quase lá:</strong><br>• ' + errors.join('<br>• ');
    fb.classList.add('err');
  }
}

/* ═══════════════════════════════════════
   7. WRITTEN ANSWERS
═══════════════════════════════════════ */
function showModel(id) {
  const el = document.getElementById(id);
  el.classList.toggle('visible');
}
function clearAnswer(id) { document.getElementById(id).value = ''; }

/* ═══════════════════════════════════════
   8. FLASHCARDS
═══════════════════════════════════════ */
const fcCSS = [
  { term: 'display: flex', cat: 'Layout', answer: 'Ativa o Flexbox. Filhos se tornam flex items alinhados em linha. Use justify-content e align-items para posicionamento.' },
  { term: 'display: grid', cat: 'Layout', answer: 'Ativa o CSS Grid — layout bidimensional. Use grid-template-columns e grid-template-rows para definir a estrutura.' },
  { term: 'position: sticky', cat: 'Posição', answer: 'O elemento se comporta como relative até atingir um threshold de scroll, onde "gruda" como fixed. Essencial para navbars.' },
  { term: 'transition: all 0.3s ease', cat: 'Animação', answer: 'Aplica transição suave em todas as propriedades que mudarem. Duração: 0.3s. Timing function: ease (começa rápido, desacelera).' },
  { term: 'z-index: 100', cat: 'Empilhamento', answer: 'Controla a ordem de sobreposição. Maior z-index = na frente. Só funciona em elementos com position diferente de static.' },
  { term: 'clamp(1rem, 4vw, 2rem)', cat: 'Responsivo', answer: 'Tipografia fluida: valor mínimo de 1rem, ideal de 4% da viewport, máximo de 2rem. Escala automaticamente com a tela.' },
  { term: 'box-sizing: border-box', cat: 'Box Model', answer: 'Calcula largura/altura incluindo padding e border. Evita que padding "inche" o elemento além do esperado. Padrão recomendado.' },
  { term: '@media (max-width: 768px)', cat: 'Responsive', answer: 'Aplica estilos apenas em telas menores que 768px (tablets e celulares). Abordagem CSS-first (desktop default).' },
  { term: 'background: linear-gradient()', cat: 'Visual', answer: 'Cria gradiente linear. Ex: linear-gradient(135deg, #4f8ef7, #a855f7) — diagonal do azul ao roxo.' },
  { term: 'opacity: 0.5', cat: 'Visual', answer: 'Torna o elemento 50% transparente. Diferente de visibility: hidden (que oculta) ou display: none (remove do fluxo).' },
];

const fcHTTP = [
  { term: 'GET', cat: 'Leitura', answer: 'Busca/lê dados sem modificar. Idempotente. Dados na URL (query). Retorna 200 OK. Ex: GET /usuarios → lista completa.' },
  { term: 'POST', cat: 'Criação', answer: 'Cria novo recurso. Dados no body (JSON/form). Não idempotente. Retorna 201 Created com o recurso criado.' },
  { term: 'PUT', cat: 'Atualização', answer: 'Substitui o recurso COMPLETO. Idempotente. Dados no body. Retorna 200 OK. Se não existir, pode criar (upsert).' },
  { term: 'PATCH', cat: 'Atualização', answer: 'Atualiza parcialmente o recurso. Só envia os campos que mudaram no body. Mais eficiente que PUT para alterações pontuais.' },
  { term: 'DELETE', cat: 'Remoção', answer: 'Remove o recurso identificado pela URL. Retorna 200 OK (com body) ou 204 No Content (sem body). Idempotente.' },
];

let fcCSSIdx = 0, fcHTTPIdx = 0;

function flipCard(sceneId) {
  document.getElementById(sceneId).classList.toggle('flipped');
}

function nextCard(type) {
  if (type === 'css') {
    document.getElementById('fc-css-scene').classList.remove('flipped');
    fcCSSIdx = (fcCSSIdx + 1) % fcCSS.length;
    updateCSScards();
  } else {
    document.getElementById('fc-http-scene').classList.remove('flipped');
    fcHTTPIdx = (fcHTTPIdx + 1) % fcHTTP.length;
    updateHTTPcards();
  }
}

function prevCard(type) {
  if (type === 'css') {
    document.getElementById('fc-css-scene').classList.remove('flipped');
    fcCSSIdx = (fcCSSIdx - 1 + fcCSS.length) % fcCSS.length;
    updateCSScards();
  } else {
    document.getElementById('fc-http-scene').classList.remove('flipped');
    fcHTTPIdx = (fcHTTPIdx - 1 + fcHTTP.length) % fcHTTP.length;
    updateHTTPcards();
  }
}

function updateCSScards() {
  const c = fcCSS[fcCSSIdx];
  document.getElementById('fc-css-term').textContent = c.term;
  document.getElementById('fc-css-answer').textContent = c.answer;
  document.getElementById('fc-css-counter').textContent = `${fcCSSIdx + 1} / ${fcCSS.length}`;
}

function updateHTTPcards() {
  const c = fcHTTP[fcHTTPIdx];
  document.getElementById('fc-http-term').textContent = c.term;
  document.getElementById('fc-http-cat').textContent = c.cat;
  document.getElementById('fc-http-answer').textContent = c.answer;
  document.getElementById('fc-http-counter').textContent = `${fcHTTPIdx + 1} / ${fcHTTP.length}`;
}

// Keyboard support for flashcards
document.querySelectorAll('.flashcard-scene').forEach(s => {
  s.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); s.classList.toggle('flipped'); }
  });
});

/* ═══════════════════════════════════════
   9. LIVE CHALLENGE PLAYGROUND
═══════════════════════════════════════ */
const challengeTasks = [
  { id: 'has_head', label: 'Tags estruturais configuradas (&lt;html&gt;, &lt;head&gt;, &lt;body&gt;)' },
  { id: 'has_title', label: 'Título definido na tag &lt;title&gt;' },
  { id: 'has_meta', label: 'Meta charset="UTF-8" e meta viewport configurados' },
  { id: 'has_style', label: 'Bloco de CSS criado na página (tag &lt;style&gt;)' },
  { id: 'has_nav', label: 'Tag &lt;header&gt; contendo &lt;nav&gt; com as âncoras de menu' },
  { id: 'has_main', label: 'Tag &lt;main&gt; com conteúdo principal' },
  { id: 'has_h1', label: 'Heading &lt;h1&gt; com nome do produto' },
  { id: 'has_img_alt', label: 'Uma imagem &lt;img&gt; do produto contendo atributo alt descritivo' },
  { id: 'has_button', label: 'Botão com tag &lt;button&gt; para a ação de compra' },
  { id: 'has_footer', label: 'Tag &lt;footer&gt; de rodapé na página' }
];

// Readonly checklist logic. State is evaluated dynamically directly from code parsing.
let currentChallengeState = {};

function renderChallenge() {
  const grid = document.getElementById('challenge-grid');
  grid.innerHTML = '';

  challengeTasks.forEach((task) => {
    const done = !!currentChallengeState[task.id];
    const div = document.createElement('div');
    div.className = 'challenge-check' + (done ? ' done' : '');
    div.style.cursor = 'default';
    div.innerHTML = `<span class="cc-box">${done ? '✓' : ''}</span><span class="cc-text">${task.label}</span>`;
    grid.appendChild(div);
  });

  updateChallengeScore();
}

function updateChallengeScore() {
  const done = Object.values(currentChallengeState).filter(Boolean).length;
  const total = challengeTasks.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  document.getElementById('challenge-pct').textContent = pct + '%';
  document.getElementById('challenge-bar').style.width = pct + '%';

  let msg;
  if (pct === 100) msg = '🏆 Código 100% Validado! Você construiu uma página completa!';
  else if (pct >= 80) msg = '👍 Quase lá! Encontre os detalhes estruturais que faltam.';
  else if (pct >= 40) msg = '💪 Mão na massa! A estrutura está tomando forma.';
  else msg = '🚀 Comece a codar abaixo e clique em Validar quando quiser verificar!';
  document.getElementById('challenge-msg').textContent = msg;
}

function updateLivePreview() {
  const editor = document.getElementById('pg-editor');
  const iframe = document.getElementById('pg-preview');
  iframe.srcdoc = editor.value;
}

document.getElementById('pg-editor').addEventListener('input', () => {
  clearTimeout(window.previewTimeout);
  window.previewTimeout = setTimeout(updateLivePreview, 300);
});

function validatePlayground() {
  const code = document.getElementById('pg-editor').value;
  const parser = new DOMParser();
  const doc = parser.parseFromString(code, 'text/html');

  // Helper because DOMParser auto-injects html/head/body even if missing from raw
  const rawCode = code.toLowerCase();

  const state = {};
  state.has_head = rawCode.includes('<html') && rawCode.includes('<head') && rawCode.includes('<body');
  state.has_title = !!doc.querySelector('title') && doc.querySelector('title').textContent.trim() !== '';
  state.has_meta = !!doc.querySelector('meta[charset="UTF-8"], meta[charset="utf-8"]') && !!doc.querySelector('meta[name="viewport"]');
  state.has_style = !!doc.querySelector('style') && doc.querySelector('style').textContent.trim().length > 5;

  const header = doc.querySelector('header');
  state.has_nav = !!header && !!header.querySelector('nav') && !!header.querySelector('nav a');

  state.has_main = !!doc.querySelector('main');

  const img = doc.querySelector('img');
  state.has_img_alt = !!img && img.hasAttribute('alt') && img.getAttribute('alt').trim() !== '';

  state.has_h1 = !!doc.querySelector('h1');
  state.has_button = !!doc.querySelector('button');
  state.has_footer = !!doc.querySelector('footer');

  currentChallengeState = state;
  renderChallenge();
}

renderChallenge();
updateLivePreview();

/* ═══════════════════════════════════════
   10. QUIZ ENGINE (generic)
═══════════════════════════════════════ */
function createQuizEngine(questions, prefix) {
  let currentQ = 0, score = 0, answered = false;

  function render() {
    const q = questions[currentQ];
    const pct = ((currentQ + 1) / questions.length) * 100;

    document.getElementById(prefix + '-counter').textContent =
      `Questão ${currentQ + 1} de ${questions.length}`;
    document.getElementById(prefix + '-bar').style.width = pct + '%';
    document.getElementById(prefix + '-q').textContent = q.q;
    document.getElementById(prefix + '-fb').textContent = '';
    document.getElementById(prefix + '-fb').className = 'qz-feedback';
    document.getElementById(prefix + '-next').disabled = true;
    answered = false;

    const opts = document.getElementById(prefix + '-opts');
    opts.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.opts.forEach((opt, i) => {
      const safeOpt = opt.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const btn = document.createElement('button');
      btn.className = 'qz-opt';
      btn.innerHTML = `<span class="opt-badge">${letters[i]}</span>${safeOpt}`;
      btn.addEventListener('click', () => selectAnswer(i));
      opts.appendChild(btn);
    });
  }

  function selectAnswer(idx) {
    if (answered) return;
    answered = true;
    const q = questions[currentQ];
    const opts = document.querySelectorAll('#' + prefix + '-opts .qz-opt');
    const fb = document.getElementById(prefix + '-fb');

    opts.forEach((b, i) => {
      b.disabled = true;
      if (i === q.correct) b.classList.add('correct');
      else if (i === idx) b.classList.add('wrong');
    });

    if (idx === q.correct) {
      score++;
      fb.textContent = '✓ Correto! ' + q.explain;
      fb.className = 'qz-feedback ok';
    } else {
      fb.textContent = '✗ Incorreto. ' + q.explain;
      fb.className = 'qz-feedback err';
    }

    document.getElementById(prefix + '-score').textContent = '✓ ' + score;
    document.getElementById(prefix + '-next').disabled = false;
  }

  function next() {
    currentQ++;
    if (currentQ < questions.length) { render(); }
    else {
      document.getElementById(prefix + '-area').style.display = 'none';
      const res = document.getElementById(prefix + '-result');
      res.classList.remove('hidden');
      const pct = Math.round(score / questions.length * 100);
      document.getElementById(prefix + '-big').textContent = score + '/' + questions.length;
      let msg;
      if (pct >= 90) msg = '🏆 Excelente! Você domina este tópico!';
      else if (pct >= 70) msg = '👍 Bom! Revise os que errou.';
      else if (pct >= 50) msg = '📚 Continue estudando — releia o conteúdo acima.';
      else msg = '💪 Pratique mais! Use os flashcards e o módulo de revisão.';
      document.getElementById(prefix + '-msg').textContent = msg;
      document.getElementById(prefix + '-restart').style.display = 'inline-flex';
    }
  }

  function restart() {
    currentQ = 0; score = 0; answered = false;
    document.getElementById(prefix + '-area').style.display = 'block';
    document.getElementById(prefix + '-result').classList.add('hidden');
    document.getElementById(prefix + '-score').textContent = '✓ 0';
    document.getElementById(prefix + '-restart').style.display = 'none';
    render();
  }

  render();
  return { next, restart };
}

/* ═══════════════════════════════════════
   11. QUIZ DATA & ENGINES
═══════════════════════════════════════ */

// HTML Quiz
const htmlQuestions = [
  { q: 'Qual tag HTML é usada para criar um link (hyperlink)?', opts: ['<link>', '<a>', '<href>', '<nav>'], correct: 1, explain: 'A tag <a> (anchor) com atributo href cria hyperlinks. <link> é usada no head para recursos externos.' },
  { q: 'Qual atributo é OBRIGATÓRIO em imagens para acessibilidade e SEO?', opts: ['title', 'src', 'alt', 'class'], correct: 2, explain: 'O atributo alt descreve a imagem para leitores de tela e buscadores. Sem alt, imagens são invisíveis para SEO e inacessíveis.' },
  { q: 'Qual tag HTML define o conteúdo PRINCIPAL de uma página (deve ser único)?', opts: ['<section>', '<div>', '<main>', '<body>'], correct: 2, explain: '<main> contém o conteúdo principal e deve aparecer apenas uma vez por documento. Essencial para acessibilidade.' },
  { q: 'Como criar um link que abre em uma nova aba?', opts: ['<a href="#" newpage>', '<a href="#" target="_blank">', '<a href="#" open="new">', '<a href="#" tab="new">'], correct: 1, explain: 'O atributo target="_blank" instrui o browser a abrir o link em uma nova aba ou janela.' },
  { q: 'Qual a tag correta para o campo de envio de um formulário HTML?', opts: ['<input type="send">', '<button type="submit">', '<form-submit>', '<a class="submit">'], correct: 1, explain: '<button type="submit"> (ou <input type="submit">) submete o formulário. <button> é mais flexível pois aceita HTML interno.' },
  { q: 'Qual heading representa o MENOR nível de importância?', opts: ['<h1>', '<h3>', '<h5>', '<h6>'], correct: 3, explain: 'A hierarquia vai de <h1> (mais importante, único por página) até <h6> (menor importância). Não pule níveis.' },
  { q: 'Qual atributo define o texto alternativo de um input para leitores de tela?', opts: ['placeholder', 'name', 'aria-label', 'class'], correct: 2, explain: 'aria-label fornece uma descrição acessível para elementos sem rótulo visual visível — fundamental para A11Y.' },
  { q: 'Qual tag HTML5 é mais adequada para uma barra de navegação?', opts: ['<div id="nav">', '<ul class="nav">', '<nav>', '<menu>'], correct: 2, explain: 'A tag semântica <nav> é específica para blocos de navegação. Melhora acessibilidade e SEO versus <div>.' },
];

const htmlEngine = createQuizEngine(htmlQuestions, 'qh');
function htmlQuizNext() { htmlEngine.next(); }
function htmlQuizRestart() { htmlEngine.restart(); }

// Internet Quiz
const internetQuestions = [
  { q: 'O que significa a sigla DNS?', opts: ['Domain Name System', 'Digital Network Service', 'Data Node Server', 'Domain Numeric Service'], correct: 0, explain: 'DNS (Domain Name System) é o sistema que converte nomes de domínio (ex: google.com) em endereços IP numéricos.' },
  { q: 'No modelo cliente-servidor, quem inicia a comunicação?', opts: ['O servidor', 'O DNS', 'O cliente (navegador)', 'O roteador'], correct: 2, explain: 'Sempre o cliente (browser/app) inicia enviando uma requisição. O servidor apenas responde a requisições recebidas.' },
  { q: 'Qual protocolo garante comunicação criptografada na web?', opts: ['HTTP', 'FTP', 'HTTPS (HTTP + TLS)', 'UDP'], correct: 2, explain: 'HTTPS adiciona a camada TLS ao HTTP, criptografando a comunicação. Identificado pelo cadeado no navegador.' },
  { q: 'O que é comutação de pacotes (packet switching)?', opts: ['Enviar dados em um único bloco contínuo', 'Dividir dados em pacotes que viajam por rotas diferentes e são remontados no destino', 'Conectar dois computadores diretamente', 'Compressão de dados antes do envio'], correct: 1, explain: 'A internet usa packet switching: dados são fragmentados em pacotes, cada um pode seguir rotas diferentes, e são reorganizados no destino.' },
  { q: 'Qual o papel do endereço IP na internet?', opts: ['Identificar o protocolo usardo', 'Identificar unicamente cada dispositivo na rede', 'Criptografar a comunicação', 'Armazenar o histórico de navegação'], correct: 1, explain: 'O IP (Internet Protocol) address identifica unicamente cada dispositivo na rede, similar a um endereço postal.' },
  { q: 'O que acontece quando você digita uma URL no navegador? Qual é o primeiro passo técnico?', opts: ['O browser carrega o CSS', 'O servidor processa a lógica', 'O browser faz uma consulta DNS para resolver o domínio', 'O HTML é baixado imediatamente'], correct: 2, explain: 'Antes de qualquer coisa, o browser resolve o nome do domínio em IP via DNS. Só então abre a conexão TCP com o servidor.' },
  { q: 'O HTTP/3 usa qual protocolo de transporte diferente dos anteriores?', opts: ['TCP', 'UDP via QUIC', 'FTP', 'WebSocket'], correct: 1, explain: 'HTTP/3 usa QUIC, baseado em UDP (ao invés de TCP). Isso reduz latência, especialmente em redes móveis e instáveis.' },
  { q: 'Qual código de status HTTP indica que um recurso não foi encontrado?', opts: ['200', '301', '404', '500'], correct: 2, explain: '404 Not Found: o servidor não encontrou o recurso na URL solicitada. Erro do cliente (4xx). 500 seria erro do servidor.' },
];

const internetEngine = createQuizEngine(internetQuestions, 'qi');
function internetQuizNext() { internetEngine.next(); }
function internetQuizRestart() { internetEngine.restart(); }

// Domains Quiz
const domainsQuestions = [
  { q: 'Qual órgão é responsável por REGISTRAR domínios .br no Brasil?', opts: ['CGI.br', 'ANATEL', 'Registro.br (NIC.br)', 'SERPRO'], correct: 2, explain: 'O Registro.br, serviço do NIC.br, é o responsável pelo registro e gerenciamento de nomes de domínio .br.' },
  { q: 'O CGI.br é responsável por:', opts: ['Fiscalizar provedores de internet', 'Coordenar e integrar as iniciativas de uso da Internet no Brasil', 'Vender domínios .com', 'Monitorar velocidade de conexão'], correct: 1, explain: 'O CGI.br (Comitê Gestor da Internet no Brasil) coordena políticas e promove uso da internet no país. O NIC.br executa suas decisões.' },
  { q: 'Qual sufixo de domínio é destinado a empresas comerciais no Brasil?', opts: ['.gov.br', '.edu.br', '.com.br', '.mil.br'], correct: 2, explain: '.com.br é para empresas comerciais. .gov.br para governo, .edu.br para educação, .org.br para organizações sem fins lucrativos.' },
  { q: 'O NIC.br está subordinado a qual organização?', opts: ['ANATEL', 'CGI.br', 'Google Brasil', 'Internet Society'], correct: 1, explain: 'O NIC.br (Núcleo de Informação e Coordenação do Ponto BR) é vinculado e executa as decisões do CGI.br.' },
  { q: 'O domínio .gov.br é destinado para:', opts: ['Qualquer empresa brasileira', 'Órgãos do governo federal, estadual e municipal', 'Organizações sem fins lucrativos', 'Institutos educacionais privados'], correct: 1, explain: '.gov.br é exclusivo para entidades governamentais brasileiras. Apenas órgãos públicos podem registrar neste domínio.' },
];

const domainsEngine = createQuizEngine(domainsQuestions, 'qd');
function domainsQuizNext() { domainsEngine.next(); }
function domainsQuizRestart() { domainsEngine.restart(); }

// CSS Quiz
const cssQuestions = [
  { q: 'Qual propriedade CSS define a cor de fundo de um elemento?', opts: ['color', 'foreground', 'background-color', 'fill'], correct: 2, explain: 'background-color define a cor de fundo. A propriedade color define a cor do texto/conteúdo do elemento.' },
  { q: 'Para centralizar um elemento filho com Flexbox, qual combinação é usada no pai?', opts: ['text-align:center e vertical-align:middle', 'justify-content:center e align-items:center', 'margin:auto e padding:auto', 'display:block e center:true'], correct: 1, explain: 'No container flexbox: justify-content:center centraliza no eixo principal (horizontal); align-items:center no eixo cruzado (vertical).' },
  { q: 'Qual unidade CSS é RELATIVA ao tamanho de fonte do elemento raiz (<html>)?', opts: ['px', 'em', 'rem', '%'], correct: 2, explain: 'rem = root em. Refere-se ao tamanho de fonte do elemento <html>. Em refere-se ao elemento pai, criando cascata de valores.' },
  { q: 'Qual propriedade define espaçamento INTERNO (entre conteúdo e borda)?', opts: ['margin', 'padding', 'border-spacing', 'gap'], correct: 1, explain: 'padding é o espaço interno entre o conteúdo e a borda. margin é o espaço externo que separa elementos entre si.' },
  { q: 'Como aplicar um efeito ao passar o mouse sobre um elemento?', opts: ['.btn.mouse-over', '#btn:onClick', '.btn:hover', 'btn[onmouseover]'], correct: 2, explain: 'A pseudo-classe :hover é aplicada quando o cursor está sobre o elemento. .btn:hover { ... } estiliza o botão com o mouse em cima.' },
  { q: 'Qual valor de display torna um elemento invisível mas mantém seu espaço no layout?', opts: ['display:none', 'visibility:hidden', 'opacity: 0 com display:none', 'position: absolute'], correct: 1, explain: 'visibility:hidden oculta o elemento visualmente mas mantém o espaço. display:none remove do fluxo (sem espaço).' },
  { q: 'Para criar um layout com 3 colunas iguais usando Grid, qual propriedade usar?', opts: ['columns: 3', 'grid-columns: 1fr 1fr 1fr', 'grid-template-columns: repeat(3, 1fr)', 'flex: 3'], correct: 2, explain: 'grid-template-columns: repeat(3, 1fr) cria 3 colunas de tamanho igual, distribuindo o espaço disponível em frações.' },
  { q: 'Qual propriedade CSS define o tamanho da fonte?', opts: ['text-size', 'font-weight', 'font-size', 'typeface'], correct: 2, explain: 'font-size define o tamanho da fonte. font-weight define a espessura (negrito). font-family define a tipografia.' },
];

const cssEngine = createQuizEngine(cssQuestions, 'qc');
function cssQuizNext() { cssEngine.next(); }
function cssQuizRestart() { cssEngine.restart(); }

// Responsive Quiz
const responsiveQuestions = [
  { q: 'O que é "mobile-first" no desenvolvimento web?', opts: ['Fazer o site apenas para mobile', 'Começar com estilos para mobile e usar min-width para adaptar telas maiores', 'Usar um framework mobile', 'Testar apenas em smartphone'], correct: 1, explain: 'Mobile-first: escreva o CSS base para mobile, depois use @media (min-width:Xpx) para adicionar estilos para telas maiores. Melhor performance.' },
  { q: 'Qual meta tag é essencial para que o responsive design funcione em dispositivos móveis?', opts: ['<meta name="mobile" content="yes">', '<meta name="viewport" content="width=device-width, initial-scale=1.0">', '<meta http-equiv="responsive">', '<meta name="screen" content="auto">'], correct: 1, explain: 'A meta viewport instrui o browser mobile a usar a largura real do dispositivo ao invés de simular uma tela desktop.' },
  { q: 'Qual media query aplica estilos SOMENTE em telas até 600px (celulares)?', opts: ['@media (min-width: 600px)', '@media (width: 600px)', '@media (max-width: 600px)', '@media screen { width: 600px }'], correct: 2, explain: '@media (max-width: 600px) aplica quando a tela tem NO MÁXIMO 600px. min-width aplica a partir de 600px.' },
  { q: 'A função CSS clamp(1rem, 4vw, 2rem) garante que a fonte:', opts: ['Seja sempre 1rem', 'Seja exatamente 4vw', 'Nunca seja menor que 1rem nem maior que 2rem', 'Seja 2rem em mobile'], correct: 2, explain: 'clamp(min, val, max): o valor ideal é 4vw, mas nunca menor que 1rem (mobile) nem maior que 2rem (desktop grande).' },
  { q: 'Em um menu responsivo, qual técnica é mais comum para esconder itens em mobile?', opts: ['display: invisible', 'position: off-screen', 'display: none com toggle via JavaScript para abrir/fechar', 'overflow: clip'], correct: 2, explain: 'Em mobile, o menu é ocultado com display:none e revelado com JavaScript (toggling de classe) ao clicar no ícone hamburguer (☰).' },
];

const respEngine = createQuizEngine(responsiveQuestions, 'qr');
function respQuizNext() { respEngine.next(); }
function respQuizRestart() { respEngine.restart(); }

// A11Y Quiz
const a11yQuestions = [
  { q: 'Qual atributo HTML descreve uma imagem para usuários com deficiência visual?', opts: ['title', 'aria-label', 'alt', 'description'], correct: 2, explain: 'alt (alternative text) é lido por screen readers e exibido quando a imagem não carrega. É obrigatório nas diretrizes WCAG.' },
  { q: 'Qual é a proporção mínima de contraste exigida pelo WCAG AA para texto normal?', opts: ['2:1', '3:1', '4.5:1', '7:1'], correct: 2, explain: 'WCAG AA exige contraste mínimo de 4.5:1 para texto normal e 3:1 para texto grande (>18pt ou >14pt em negrito).' },
  { q: 'Para que serve o atributo aria-live="polite"?', opts: ['Tornar o elemento educado visualmente', 'Anunciar mudanças dinâmicas ao screen reader sem interromper', 'Pausar animações', 'Bloquear focus automático'], correct: 1, explain: 'aria-live="polite" instrui o screen reader a anunciar atualizações de conteúdo dinâmico quando o usuário estiver disponível (não interrompe a fala atual).' },
  { q: 'Por que devemos usar <button> ao invés de <div onclick="..."> para ações clicáveis?', opts: ['Aparência melhor', '<button> é automaticamente focável, acessível via teclado e tem role semântico correta', '<div> consome mais memória', 'Não há diferença real'], correct: 1, explain: '<button> é nativo: focável via Tab, ativável com Enter/Space, tem role="button" implícito. <div> precisa de aria-role, tabindex e handlers manuais.' },
  { q: 'O que significa "skip link" em acessibilidade?', opts: ['Link para pular propagandas', 'Link no topo da página que permite pular direto ao conteúdo principal', 'Link quebrado', 'Link para página de erros'], correct: 1, explain: 'Skip links permitem que usuários de teclado/screen reader ignorem navegação repetitiva e acessem diretamente o conteúdo principal.' },
  { q: 'Qual é a finalidade do atributo aria-expanded?', opts: ['Aumentar o elemento', 'Indicar se um elemento (como acordeão ou menu) está aberto ou fechado', 'Expandir o texto', 'Definir animação CSS'], correct: 1, explain: 'aria-expanded="true/false" indica ao screen reader o estado de abertura de componentes como menus, acordeões e dropdowns.' },
];

const a11yEngine = createQuizEngine(a11yQuestions, 'qa');
function a11yQuizNext() { a11yEngine.next(); }
function a11yQuizRestart() { a11yEngine.restart(); }

// Frontend vs Backend Quiz
const fbQuestions = [
  { q: 'Qual tecnologia roda EXCLUSIVAMENTE no cliente (navegador)?', opts: ['PHP', 'Python Django', 'Node.js Express', 'CSS e HTML'], correct: 3, explain: 'HTML, CSS e JavaScript do lado cliente rodam no browser. PHP, Python, Node.js são tecnologias server-side (backend).' },
  { q: 'Qual é a função principal de uma API REST no contexto frontend/backend?', opts: ['Estilizar a interface', 'Intermediar a comunicação entre frontend e backend com endpoints HTTP', 'Armazenar arquivos', 'Compilar JavaScript'], correct: 1, explain: 'A API REST expõe endpoints HTTP que o frontend consome para buscar/enviar dados. É a "ponte" entre as duas camadas.' },
  { q: 'Um banco de dados (MySQL, PostgreSQL) pertence a qual camada?', opts: ['Frontend', 'Entre frontend e backend', 'Backend', 'CDN'], correct: 2, explain: 'Bancos de dados são componentes da camada backend. O frontend nunca acessa diretamente — o backend media o acesso.' },
  { q: 'O que retorna uma API REST ao buscar um usuário com GET /api/usuarios/5?', opts: ['Uma página HTML renderizada', 'Um arquivo CSS', 'Normalmente um objeto JSON com os dados do usuário', 'Um email'], correct: 2, explain: 'APIs REST retornam dados no formato JSON (ou XML). O frontend consome esse JSON e renderiza a interface dinamicamente.' },
  { q: 'React, Vue e Angular são tecnologias de qual camada?', opts: ['Backend (Node.js)', 'Frontend (roda no browser)', 'Banco de dados', 'DevOps'], correct: 1, explain: 'React, Vue e Angular são frameworks JavaScript que rodam no browser — são tecnologias frontend. Node.js é backend (mesmo sendo JS).' },
];

const fbEngine = createQuizEngine(fbQuestions, 'qfb');
function fbQuizNext() { fbEngine.next(); }
function fbQuizRestart() { fbEngine.restart(); }

/* ═══════════════════════════════════════
   12. MAIN QUIZ (10 questions — existing)
═══════════════════════════════════════ */
const mainQuizData = [
  { q: 'Em que ano a ARPANET foi criada?', opts: ['1955', '1969', '1983', '1991'], correct: 1, explain: 'A ARPANET foi criada em 1969 pelo Departamento de Defesa dos EUA.' },
  { q: 'Quem inventou o World Wide Web e em que ano?', opts: ['Steve Jobs, 1984', 'Bill Gates, 1990', 'Tim Berners-Lee, 1991', 'Linus Torvalds, 1992'], correct: 2, explain: 'Tim Berners-Lee criou a WWW em 1991 no CERN, propondo o HTTP e o HTML.' },
  { q: 'O HTTP/3 usa qual protocolo de transporte?', opts: ['TCP', 'UDP via QUIC', 'FTP', 'WebSocket'], correct: 1, explain: 'HTTP/3 usa QUIC sobre UDP, reduzindo latência e melhorando performance em redes instáveis.' },
  { q: 'Qual tag HTML deve ser única por documento e contém o conteúdo principal?', opts: ['<section>', '<div>', '<main>', '<article>'], correct: 2, explain: '<main> é única por documento e contém o conteúdo principal — fundamental para acessibilidade e SEO.' },
  { q: 'Qual propriedade CSS cria variáveis globais reutilizáveis?', opts: [':root { --variavel }', '$.variavel', '@variable', 'var()'], correct: 0, explain: 'Usando :root { --nome: valor } definimos CSS Custom Properties (variáveis) acessíveis com var(--nome).' },
  { q: 'Qual a diferença entre Flexbox e CSS Grid?', opts: ['São idênticos', 'Flexbox é 1D (linha ou coluna), Grid é 2D (linhas e colunas)', 'Grid só funciona em mobile', 'Flexbox não suporta gap'], correct: 1, explain: 'Flexbox é unidimensional. CSS Grid controla linha E colunas simultaneamente — é bidimensional.' },
  { q: 'Em JavaScript, qual é a diferença entre const e let?', opts: ['Não há diferença', 'const é global, let é local', 'const não pode ser reatribuído; let pode', 'let é mais rápido'], correct: 2, explain: 'const declara ligação constante (não reatribuível). let declara variável mutável. Ambas têm escopo de bloco.' },
  { q: 'Qual atributo HTML é usado para acessibilidade em imagens?', opts: ['title', 'aria-label', 'alt', 'description'], correct: 2, explain: 'O atributo alt fornece texto alternativo para imagens — essencial para screen readers e SEO.' },
  { q: 'Qual API JavaScript permite buscar dados sem recarregar a página?', opts: ['XMLHttpRequest apenas', 'fetch()', 'document.reload()', 'navigator.get()'], correct: 1, explain: 'A Fetch API é a forma moderna de fazer requisições HTTP assíncronas em JavaScript (async/await).' },
  { q: 'O que significa o código de status HTTP 404?', opts: ['Sucesso', 'Erro interno do servidor', 'O recurso não foi encontrado', 'Sem conteúdo'], correct: 2, explain: 'HTTP 404 (Not Found) indica que o servidor não encontrou o recurso solicitado. Erro do cliente (4xx).' },
];

let mainQ = 0, mainScore = 0, mainAnswered = false;

function renderMainQuestion() {
  const q = mainQuizData[mainQ];
  const pct = ((mainQ + 1) / mainQuizData.length) * 100;

  document.getElementById('quiz-counter').textContent = `Questão ${mainQ + 1} de ${mainQuizData.length}`;
  document.getElementById('quiz-bar').style.width = pct + '%';
  document.getElementById('quiz-q').textContent = q.q;
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-feedback').className = 'qz-feedback';
  document.getElementById('quiz-next').disabled = true;
  mainAnswered = false;

  const optsEl = document.getElementById('quiz-opts');
  optsEl.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.opts.forEach((opt, i) => {
    const safeOpt = opt.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const btn = document.createElement('button');
    btn.className = 'qz-opt';
    btn.innerHTML = `<span class="opt-badge">${letters[i]}</span>${safeOpt}`;
    btn.addEventListener('click', () => {
      if (mainAnswered) return;
      mainAnswered = true;
      const fb = document.getElementById('quiz-feedback');
      document.querySelectorAll('#quiz-opts .qz-opt').forEach((b, j) => {
        b.disabled = true;
        if (j === q.correct) b.classList.add('correct');
        else if (j === i) b.classList.add('wrong');
      });
      if (i === q.correct) { mainScore++; fb.textContent = '✓ Correto! ' + q.explain; fb.className = 'qz-feedback ok'; }
      else { fb.textContent = '✗ Incorreto. ' + q.explain; fb.className = 'qz-feedback err'; }
      document.getElementById('quiz-score-live').textContent = '✓ ' + mainScore;
      document.getElementById('quiz-next').disabled = false;
    });
    optsEl.appendChild(btn);
  });
}

function nextQuestion() {
  mainQ++;
  if (mainQ < mainQuizData.length) { renderMainQuestion(); }
  else {
    document.getElementById('quiz-area').style.display = 'none';
    document.getElementById('quiz-result').classList.remove('hidden');
    const pct = Math.round(mainScore / mainQuizData.length * 100);
    document.getElementById('quiz-final-score').textContent = mainScore + '/' + mainQuizData.length;
    let msg;
    if (pct >= 90) msg = '🏆 Excelente!'; else if (pct >= 70) msg = '👍 Bom resultado!'; else if (pct >= 50) msg = '📚 Continue estudando!'; else msg = '💪 Revise os módulos!';
    document.getElementById('quiz-result-msg').textContent = msg;
    document.getElementById('quiz-restart').style.display = 'inline-flex';
  }
}

function restartQuiz() {
  mainQ = 0; mainScore = 0; mainAnswered = false;
  document.getElementById('quiz-area').style.display = 'block';
  document.getElementById('quiz-result').classList.add('hidden');
  document.getElementById('quiz-score-live').textContent = '✓ 0';
  document.getElementById('quiz-restart').style.display = 'none';
  renderMainQuestion();
}

renderMainQuestion();

/* ═══════════════════════════════════════
   13. CHEAT SHEET TABS
═══════════════════════════════════════ */
function switchTab(id) {
  document.querySelectorAll('.cheat-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.cheat-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  document.getElementById('panel-' + id).classList.add('active');
  document.getElementById('tab-' + id).classList.add('active');
  document.getElementById('tab-' + id).setAttribute('aria-selected', 'true');
}

/* ═══════════════════════════════════════
   14. SELF-ASSESSMENT CHECKLIST
═══════════════════════════════════════ */
const checkItems = [
  'Sei o que foi a ARPANET e TCP/IP',
  'Entendo a diferença entre HTTP/1, 2 e 3',
  'Sei usar as tags semânticas do HTML5',
  'Entendo GET, POST, PUT, DELETE e PATCH',
  'Consigo criar formulários com validação HTML5',
  'Sei aplicar Flexbox para layouts 1D',
  'Sei usar CSS Grid para layouts 2D',
  'Consigo escrever media queries responsivas',
  'Entendo const, let e escopo de bloco no JS',
  'Sei manipular elementos com querySelector',
  'Entendo addEventListener e eventos',
  'Sei usar .map(), .filter(), .reduce()',
  'Consigo fazer uma requisição com fetch()',
  'Entendo async/await e tratamento de erros',
  'Sei usar localStorage para persistência',
  'Conheço as regras básicas do WCAG',
  'Sei aplicar aria-label e role corretamente',
  'Entendo o que é XSS e como prevenir',
  'Conheço a diferença entre VPS e Static Site',
  'Sei o fluxo básico de git add, commit e push',
  'Entendo CI/CD e deploy automatizado',
  'Conheço as Core Web Vitals (LCP, FID, CLS)',
  'Sei a diferença entre React, Vue e Angular',
  'Sei a diferença entre Frontend e Backend',
];

const CL_KEY = 'revisao_checklist';
function loadCLState() { try { return JSON.parse(localStorage.getItem(CL_KEY)) || {}; } catch { return {}; } }
function saveCLState(s) { localStorage.setItem(CL_KEY, JSON.stringify(s)); }

function renderChecklist() {
  const grid = document.getElementById('checklist-grid');
  const state = loadCLState();
  grid.innerHTML = '';

  checkItems.forEach((label, i) => {
    const isChecked = !!state[i];
    const div = document.createElement('div');
    div.className = 'check-item' + (isChecked ? ' checked' : '');
    div.setAttribute('role', 'checkbox');
    div.setAttribute('aria-checked', isChecked.toString());
    div.setAttribute('tabindex', '0');
    div.innerHTML = `<span class="check-box">${isChecked ? '✓' : ''}</span><span class="check-label">${label}</span>`;
    const toggle = () => { const s = loadCLState(); s[i] = !s[i]; saveCLState(s); renderChecklist(); };
    div.addEventListener('click', toggle);
    div.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    grid.appendChild(div);
  });

  updateCLProgress(state);
}

function updateCLProgress(state) {
  const done = Object.values(state).filter(Boolean).length;
  const total = checkItems.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  document.getElementById('check-count').textContent = done;
  document.getElementById('check-total').textContent = total;
  document.getElementById('check-bar').style.width = pct + '%';
  document.getElementById('check-stat').textContent = pct + '%';
}

renderChecklist();