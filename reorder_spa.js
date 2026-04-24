const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The new http methods section
const httpMethods = fs.readFileSync('http-methods.html', 'utf8');
const gridMatch = httpMethods.match(/<div class="methods-grid">([\s\S]*?)<\/div><!-- \/methods-grid -->/);

let gridHtml = '';
if (gridMatch) {
    gridHtml = `<div class="methods-grid">\n` + gridMatch[1] + `\n    </div>`;
    gridHtml = gridHtml.replace(/class="card /g, 'class="http-m-card ');
}

// Extract sections
const sections = {};
const sectionRegex = /<section id="([a-z0-9-]+)">([\s\S]*?)<\/section>/g;

let match;
while ((match = sectionRegex.exec(html)) !== null) {
    sections[match[1]] = `<section id="${match[1]}">${match[2]}</section>`;
}

// Build new HTTP Methods section
sections['http-methods'] = `
        <!-- ── 2. PROTOCOLO HTTP, DNS ────────────── -->
        <section id="http-methods">
            <span class="section-tag">Módulo 2</span>
            <h2>Protocolo HTTP, DNS e Modelo Cliente-Servidor</h2>
            <p class="lead">Entendendo os verbos das requisições, camadas web e fluxo de arquitetura REST.</p>
            ${gridHtml}
        </section>`;

// Update section headers according to the user sequence
sections['fundamentos'] = sections['fundamentos'].replace(/Módulo 1 · Introdução/, 'Módulo 1');
sections['fundamentos'] = sections['fundamentos'].replace(/Fundamentos Web e Internet|Fundamentos da Web e Internet/, 'Introdução à Programação Web e fundamentos da Internet');

// HTML5 comes before Deploy!
sections['sem-html'] = sections['sem-html'].replace(/Módulo 3 · Prática HTML/, 'Módulo 3');
sections['sem-html'] = sections['sem-html'].replace(/Estrutura Semântica e Elementos HTML5/, 'HTML5: Estrutura, Semântica e Boas Práticas');

sections['deploy'] = sections['deploy'].replace(/Módulo 2 · DevOps e Infra/, 'Módulo 4');
sections['deploy'] = sections['deploy'].replace(/Hospedagem, Servers e Deploy/, 'Servidores Web, Hospedagem e Deploy');

// UX/UI needs to be split!
let uxUiInner = sections['ux-ui'].replace(/<section id="ux-ui">|<\/section>/g, '');
sections['ux-ui'] = `
        <!-- ── 5. INTERFACES E DESIGN ────────────── -->
        <section id="ux-ui">
            <span class="section-tag">Módulo 5</span>
            <h2>Design de Interfaces e Usabilidade na Web</h2>
            <p class="lead">Hierarquia visual, estudo de prototipação e usabilidade essencial utilizando Wireframes, Mockups e Protótipos simulando navegação interativa na web.</p>
        </section>
        
        <!-- ── 6. ACESSIBILIDADE E FRAMEWORKS ────── -->
        <section id="acessibilidade">
            <span class="section-tag">Módulo 6</span>
            <h2>UX/UI Design, Acessibilidade e Frameworks</h2>
            <p class="lead">Padrões de consistência, testes rigorosos WCAG, otimizações de contraste e estruturação para leitores de tela em layouts modernos.</p>
            <div class="features-grid">
                <div class="feat-card">
                    <div class="feat-icon">♿</div>
                    <h3>Acessibilidade WCAG</h3>
                    <p>Regras para garantir navegação a leitores de tela, alto contraste, semáforo de acessibilidade e foco semântico para inputs.</p>
                </div>
            </div>
            ${uxUiInner.substring(uxUiInner.indexOf('<div class="theory-block">'))}
        </section>`;

sections['css3'] = sections['css3'].replace(/Módulo 5 · A Cara da Web/, 'Módulo 7');
sections['css3'] = sections['css3'].replace(/CSS3: Estilização, Layout em Grids e Media Queries/, 'CSS3: Estilização, Layout e Responsividade');

sections['javascript'] = sections['javascript'].replace(/Módulo 6 · Lógica e Programação/, 'Módulo 8');
sections['javascript'] = sections['javascript'].replace(/JavaScript & Manipulação do DOM/, 'JavaScript: Sintaxe Básica e Manipulação do DOM');

// Optional: Rename projetos-js if we keep it
if (sections['projetos-js']) {
    sections['projetos-js'] = sections['projetos-js'].replace(/Módulo 7 · Prática Dirigida/, 'Projetos e APIs');
}

// Reassemble HTML body
const newOrderKeys = ['inicio', 'fundamentos', 'http-methods', 'sem-html', 'deploy', 'ux-ui', 'css3', 'javascript', 'projetos-js'];

// Find where sections start
const firstSectionMatch = html.match(/<section id="inicio">/);
const headerHtml = html.substring(0, firstSectionMatch.index);

// Find footer
const lastSectionIndex = html.lastIndexOf('</section>');
const footerHtml = html.substring(lastSectionIndex + 10);

let newSectionsHtml = '';
for (const key of newOrderKeys) {
    if (sections[key]) {
        newSectionsHtml += '\n\n' + sections[key];
    } else if (key === 'ux-ui') {
        newSectionsHtml += '\n\n' + sections['ux-ui'];
    }
}

const finalHtml = headerHtml + newSectionsHtml + '\n\n        <!-- ── FOOTER ────────────────────────────── -->\n' + footerHtml.trim();

fs.writeFileSync('index.html', finalHtml);
console.log('Reorder and update complete!');
