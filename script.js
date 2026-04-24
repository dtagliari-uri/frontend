// ── CLOCK ─────────────────────────────────────
(function () {
    function padZ(n) { return String(n).padStart(2, '0'); }
    function tickLocal() {
        const t = document.getElementById('brasilia-time');
        if (!t || t.textContent === '--:--:--') return;
        let [h, m, s] = t.textContent.split(':').map(Number);
        s++; if (s >= 60) { s = 0; m++; } if (m >= 60) { m = 0; h++; } if (h >= 24) h = 0;
        t.textContent = padZ(h) + ':' + padZ(m) + ':' + padZ(s);
    }
    async function fetchTime() {
        const t = document.getElementById('brasilia-time');
        const d = document.getElementById('brasilia-date');
        try {
            const r = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=America/Sao_Paulo');
            const data = await r.json();
            if (t) t.textContent = padZ(data.hour) + ':' + padZ(data.minute) + ':' + padZ(data.seconds);
            if (d) d.textContent = data.date;
        } catch {
            if (t) t.textContent = padZ(new Date().getHours()) + ':' + padZ(new Date().getMinutes()) + ':' + padZ(new Date().getSeconds());
        }
    }
    fetchTime();
    setInterval(fetchTime, 30000);
    setInterval(tickLocal, 1000);
})();

// ── SIDEBAR ACTIVE LINK ───────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.sidebar-menu li a');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(a => a.classList.remove('active'));
            const link = document.querySelector('.sidebar-menu li a[href="#' + entry.target.id + '"]');
            if (link) link.classList.add('active');
        }
    });
}, { threshold: 0.35 });
sections.forEach(s => observer.observe(s));

// ── MOBILE TOGGLE ─────────────────────────────
document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});
document.getElementById('pageContent').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
});

// ── SMOOTH SCROLL + CLOSE SIDEBAR ────────────
document.querySelectorAll('.sidebar-menu li a').forEach(a => {
    a.addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('open');
    });
});

// ── JS SECTION: HOUR BUTTON ───────────────────
document.getElementById('btnHoras').addEventListener('click', () => {
    document.getElementById('js-clock-display').textContent = new Date().toString();
});

// ── JS SECTION: FORM ──────────────────────────
document.getElementById('demoForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const nome = document.getElementById('formNome').value;
    const email = document.getElementById('formEmail').value;
    document.getElementById('js-form-output').textContent =
        '✅ Recebido! Nome: ' + nome + ' | E-mail: ' + email;
    this.reset();
});

// ── JS COURSE EXERCISES ──────────────────────
function testarNomeCompleto() {
    const nome = document.getElementById('fnNome').value;
    const sobrenome = document.getElementById('fnSobrenome').value;
    alert("Nome Completo: " + nome + " " + sobrenome);
}

function testarCalcularIdade() {
    const ano = parseInt(document.getElementById('fnAnoIdade').value);
    if (!ano) return;
    const anoAtual = new Date().getFullYear();
    alert("Idade: " + (anoAtual - ano) + " anos");
}

function testarFezAniversario() {
    const dia = parseInt(document.getElementById('fnDiaNiver').value);
    const mes = parseInt(document.getElementById('fnMesNiver').value);
    if (!dia || !mes) return;

    const hoje = new Date();
    const diaAtual = hoje.getDate();
    const mesAtual = hoje.getMonth() + 1;

    let fez = false;
    if (mesAtual > mes || (mesAtual === mes && diaAtual >= dia)) {
        fez = true;
    }
    alert(fez ? "Sim, já fez aniversário este ano!" : "Ainda não fez aniversário.");
}

function testarDiasParaAniversario() {
    const dia = parseInt(document.getElementById('fnDiaFalta').value);
    const mes = parseInt(document.getElementById('fnMesFalta').value);
    if (!dia || !mes) return;

    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    let proximoAniversario = new Date(anoAtual, mes - 1, dia);

    if (proximoAniversario < hoje) {
        proximoAniversario = new Date(anoAtual + 1, mes - 1, dia);
    }
    const diff = proximoAniversario - hoje;
    const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
    alert("Faltam " + dias + " dias para o seu aniversário.");
}

function testarMensagem() {
    const nome = document.getElementById('fnNomeMsg').value;
    const ano = parseInt(document.getElementById('fnAnoMsg').value);
    if (!nome || !ano) return;

    const idade = new Date().getFullYear() - ano;
    alert("Olá " + nome + ", você tem " + idade + " anos.");
}

function testarAnosParaCem() {
    const nome = document.getElementById('fnNomeCem').value;
    const ano = parseInt(document.getElementById('fnAnoCem').value);
    if (!nome || !ano) return;

    const idade = new Date().getFullYear() - ano;
    const falta = 100 - idade;

    if (falta > 0) {
        alert(nome + ", faltam " + falta + " anos para você completar 100 anos.");
    } else if (falta === 0) {
        alert(nome + ", você completou 100 anos este ano!");
    } else {
        alert(nome + ", você já passou dos 100 anos!");
    }
}

// ── NAVIGATOR APIs ────────────────────────────
let coords = '';
function salvarNome() {
    const nome = document.getElementById('nomeInput').value.trim();
    if (!nome) return;
    localStorage.setItem('nome', nome);
    document.getElementById('nav-welcome').textContent = '👋 Bem-vindo, ' + nome + '!';
    if (navigator.vibrate) navigator.vibrate(100);
}
(function () {
    const salvo = localStorage.getItem('nome');
    if (salvo) document.getElementById('nav-welcome').textContent = '👋 Bem-vindo de volta, ' + salvo + '!';
})();
function pegarLocalizacao() {
    const el = document.getElementById('geo-result');
    el.textContent = 'Aguardando…';
    navigator.geolocation.getCurrentPosition(pos => {
        coords = pos.coords.latitude + ', ' + pos.coords.longitude;
        el.textContent = '📍 ' + coords;
        if (navigator.vibrate) navigator.vibrate(100);
    }, () => { el.textContent = '❌ Permissão negada'; });
}
function copiarLocalizacao() {
    if (!coords) { alert('Busque a localização primeiro!'); return; }
    navigator.clipboard.writeText(coords).then(() => alert('✅ Localização copiada!'));
    if (navigator.vibrate) navigator.vibrate(100);
}
function notificar() {
    if (navigator.vibrate) navigator.vibrate(100);
    Notification.requestPermission().then(p => {
        if (p === 'granted') new Notification('🔔 Notificações ativadas na URI Web!');
        else alert('Permissão negada para notificações.');
    });
}
function telaCheia() {
    document.documentElement.requestFullscreen();
    if (navigator.vibrate) navigator.vibrate(100);
}
function mudarPagina() {
    history.pushState({}, '', '/pagina2');
    alert('URL alterada para /pagina2 (sem recarregar)!');
    if (navigator.vibrate) navigator.vibrate(100);
}

// ── VIBRAÇÃO ──────────────────────────────────
function vibrarCurto() {
    const el = document.getElementById('vibrate-result');
    if (navigator.vibrate) {
        navigator.vibrate(100);
        el.textContent = '📳 Vibração curta acionada!';
    } else {
        el.textContent = '❌ Não suportado neste dispositivo.';
    }
}
function vibrarPadrao() {
    const el = document.getElementById('vibrate-result');
    if (navigator.vibrate) {
        // Padrão SOS: ... --- ...
        navigator.vibrate([100, 50, 100, 50, 100, 200, 200, 50, 200, 50, 200, 200, 100, 50, 100, 50, 100]);
        el.textContent = '📳 Padrão SOS enviado!';
    } else {
        el.textContent = '❌ Não suportado neste dispositivo.';
    }
}

// ── BATTERY API ───────────────────────────────
function verBateria() {
    const el = document.getElementById('battery-result');
    if (!navigator.getBattery) {
        el.innerHTML = '<span style="color:var(--accent)">❌ Battery API não suportada.</span>';
        return;
    }
    navigator.getBattery().then(bat => {
        const pct = Math.round(bat.level * 100);
        const status = bat.charging ? '⚡ Carregando' : '🔋 Descarregando';
        const bar = Math.round(pct / 10);
        el.innerHTML =
            '<div class="battery-bar"><div class="battery-fill" style="width:' + pct + '%"></div></div>' +
            '<span>' + status + ' · ' + pct + '%</span>';
    });
}

// ── ONLINE / OFFLINE ──────────────────────────
(function () {
    function atualizarStatus() {
        const badge = document.getElementById('online-status');
        const log = document.getElementById('online-log');
        if (!badge) return;
        if (navigator.onLine) {
            badge.textContent = '🟢 Online';
            badge.className = 'api-status-badge online';
        } else {
            badge.textContent = '🔴 Offline';
            badge.className = 'api-status-badge offline';
        }
        const now = new Date().toLocaleTimeString('pt-BR');
        if (log) log.textContent = 'Última verificação: ' + now;
    }
    atualizarStatus();
    window.addEventListener('online', atualizarStatus);
    window.addEventListener('offline', atualizarStatus);
})();

// ── WEB SHARE ─────────────────────────────────
function compartilhar() {
    const el = document.getElementById('share-result');
    if (!navigator.share) {
        el.textContent = '❌ Web Share não suportado neste navegador.';
        return;
    }
    navigator.share({
        title: 'Inovação Web – URI',
        text: 'Confira este portfólio de atividades de Programação Web!',
        url: window.location.href
    }).then(() => {
        el.textContent = '✅ Compartilhado com sucesso!';
    }).catch(() => {
        el.textContent = '⚠️ Compartilhamento cancelado.';
    });
}

// ── MEDIA DEVICES ─────────────────────────────
function listarDispositivos() {
    const list = document.getElementById('media-list');
    list.innerHTML = '<li style="color:var(--txt2);font-size:0.8rem">Aguardando permissão…</li>';
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        list.innerHTML = '<li style="color:var(--accent)">❌ API não suportada.</li>';
        return;
    }
    navigator.mediaDevices.enumerateDevices().then(devices => {
        list.innerHTML = '';
        const icons = { audioinput: '🎤', audiooutput: '🔊', videoinput: '📷' };
        devices.forEach(d => {
            const li = document.createElement('li');
            li.textContent = (icons[d.kind] || '📱') + ' ' + (d.label || d.kind);
            list.appendChild(li);
        });
        if (!devices.length) list.innerHTML = '<li style="color:var(--txt2)">Nenhum dispositivo encontrado.</li>';
    }).catch(() => {
        list.innerHTML = '<li style="color:var(--accent)">❌ Permissão negada.</li>';
    });
}

// ── GAME ──────────────────────────────────────
(function () {
    let score = 0, tempo = 5, jogando = false, timer = null;
    const scoreEl = document.getElementById('g-score');
    const timerEl = document.getElementById('g-timer');
    const resultEl = document.getElementById('g-result');
    const startBtn = document.getElementById('g-start');
    const clickBtn = document.getElementById('g-click');

    startBtn.addEventListener('click', () => {
        score = 0; tempo = 5; jogando = true;
        scoreEl.textContent = 0;
        timerEl.textContent = '5s';
        resultEl.textContent = '';
        clickBtn.disabled = false;
        startBtn.disabled = true;
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            tempo--;
            timerEl.textContent = tempo + 's';
            if (tempo <= 0) {
                clearInterval(timer);
                jogando = false;
                clickBtn.disabled = true;
                startBtn.disabled = false;
                resultEl.textContent = '🏁 Fim! Sua pontuação: ' + score + ' cliques em 5s';
            }
        }, 1000);
    });

    clickBtn.addEventListener('click', () => {
        if (jogando) { score++; scoreEl.textContent = score; }
    });
})();