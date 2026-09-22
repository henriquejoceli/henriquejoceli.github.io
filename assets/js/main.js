/* =============================================
   ESTADO GLOBAL
   ============================================= */
let currentLanguage = "pt";
let currentTheme = "gruvbox";
let currentTranslations = {};
let currentContact = {};
let currentProjects = [];
let currentStacks = [];
let currentCertifications = [];

const commandHistoryList = [];
let commandHistoryIndex = -1;

const VALID_THEMES = ["dracula", "gruvbox", "solarized"];
const VALID_LANGUAGES = ["pt", "en", "es"];

// Palavras-chave de clear em todos os idiomas (não dependem do JSON carregado)
const CLEAR_KEYWORDS = ["clear", "limpar", "limpiar"];

/* =============================================
   CARREGAMENTO INICIAL DE DADOS
   ============================================= */
async function loadData() {
    try {
        const [contactRes, stacksRes] = await Promise.all([
            fetch('assets/data/contact.json'),
            fetch('assets/data/stacks.json'),
        ]);
        currentContact = await contactRes.json();
        currentStacks = await stacksRes.json();
    } catch (e) {
        console.error("Erro ao carregar dados:", e);
    }
}

async function loadLanguageData(lang) {
    try {
        const [langRes, projectsRes, certsRes] = await Promise.all([
            fetch(`assets/lang/${lang}.json`),
            fetch(`assets/data/projects/projects-${lang}.json`),
            fetch(`assets/data/certifications/certifications-${lang}.json`),
        ]);
        currentTranslations = await langRes.json();
        currentProjects = await projectsRes.json();
        currentCertifications = await certsRes.json();
    } catch (e) {
        console.error("Erro ao carregar idioma:", e);
    }
}

/* =============================================
   APLICAR TRADUÇÕES (data-translate)
   ============================================= */
function applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(function (el) {
        const key = el.getAttribute('data-translate');
        if (currentTranslations[key] !== undefined) {
            el.textContent = currentTranslations[key];
        }
    });
}

/* =============================================
   APLICAR TEMA
   ============================================= */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem('portfolio-theme', theme);
}

/* =============================================
   LIMPAR TERMINAL
   ============================================= */
function clearTerminal() {
    const container = document.querySelector('.container-terminal-history');
    // Remove todos os filhos dinâmicos (output-command e output-response)
    // mantendo os blocos estáticos do HTML (start, intro, list)
    container.querySelectorAll('.output-command, .output-response').forEach(el => el.remove());
    container.scrollTop = 0;
}

/* =============================================
   RENDERIZAÇÃO NO TERMINAL — texto simples
   ============================================= */
function renderCommandResult(command, responseText) {
    const container = document.querySelector('.container-terminal-history');

    const echoEl = document.createElement('div');
    echoEl.className = 'output-command';
    echoEl.textContent = "visitor@portfolio:~$ " + command;

    const responseEl = document.createElement('div');
    responseEl.className = 'output-response';
    responseEl.textContent = responseText;

    container.appendChild(echoEl);
    container.appendChild(responseEl);

    container.scrollTop = container.scrollHeight;
}

/* =============================================
   RENDERIZAÇÃO NO TERMINAL — HTML rico
   ============================================= */
function renderNodeResult(command, node) {
    const container = document.querySelector('.container-terminal-history');

    const echoEl = document.createElement('div');
    echoEl.className = 'output-command';
    echoEl.textContent = "visitor@portfolio:~$ " + command;

    const responseEl = document.createElement('div');
    responseEl.className = 'output-response';
    responseEl.appendChild(node);

    container.appendChild(echoEl);
    container.appendChild(responseEl);

    container.scrollTop = container.scrollHeight;
}

/* =============================================
   RESOLUÇÃO DE COMANDOS
   ============================================= */
function resolveCommand(input) {
    const normalized = input.trim().toLowerCase().replace(/\s+/g, ' ');

    // Verifica match exato com algum valor do JSON de tradução
    for (const key of Object.keys(currentTranslations)) {
        if (currentTranslations[key].toLowerCase() === normalized) {
            return { key, args: [] };
        }
    }

    // Verifica comandos com argumento: "alterar tema dracula"
    const parts = normalized.split(' ');
    if (parts.length >= 3) {
        const base = parts.slice(0, -1).join(' ');
        const arg = parts[parts.length - 1];

        for (const key of Object.keys(currentTranslations)) {
            if (currentTranslations[key].toLowerCase() === base) {
                return { key, args: [arg] };
            }
        }
    }

    return null;
}

/* =============================================
   HANDLER DE COMANDOS
   ============================================= */
function handleCommand(normalizedInput) {
    const result = resolveCommand(normalizedInput);

    if (!result) {
        renderCommandResult(normalizedInput, currentTranslations["commandNotFound"] || "Comando não reconhecido.");
        return;
    }

    const { key, args } = result;

    switch (key) {
        /* ── sobre mim ── */
        case "aboutMe": {
            renderCommandResult(normalizedInput, currentTranslations["aboutMeText"]);
            break;
        }

        /* ── contato ── */
        case "contact": {
            const t = currentTranslations;
            const c = currentContact;

            const frag = document.createDocumentFragment();

            function addLine(label, value, isLink = false) {
                const line = document.createElement('div');
                line.appendChild(document.createTextNode(label));
                if (isLink && value) {
                    const a = document.createElement('a');
                    a.href = value;
                    a.textContent = value;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.className = 'terminal-link';
                    line.appendChild(a);
                } else {
                    line.appendChild(document.createTextNode(value || ''));
                }
                frag.appendChild(line);
            }

            addLine(t["contactNameLabel"],     c.fullName);

            // E-mail: montado em runtime para não expor o endereço em texto puro
            if (c.emailUser && c.emailDomain) {
                const emailLine = document.createElement('div');
                emailLine.appendChild(document.createTextNode(t["contactEmailLabel"]));
                const emailLink = document.createElement('a');
                emailLink.className = 'terminal-link';
                emailLink.textContent = c.emailUser + '\u0040' + c.emailDomain;
                emailLink.addEventListener('click', function () {
                    window.location.href = 'mailto:' + c.emailUser + '\u0040' + c.emailDomain;
                });
                emailLine.appendChild(emailLink);
                frag.appendChild(emailLine);
            }

            addLine(t["contactCompanyLabel"],  c.currentCompany);
            addLine(t["contactPositionLabel"], c.position);
            addLine(t["contactLinkedinLabel"], c.linkedin, true);
            addLine(t["contactGithubLabel"],   c.github,   true);

            renderNodeResult(normalizedInput, frag);
            break;
        }

        /* ── projetos ── */
        case "projects": {
            const t = currentTranslations;
            let projectsText = "";
            currentProjects.forEach(function (p) {
                if (!p.name) return;
                projectsText +=
                    t["projectTitleLabel"] + p.name + "\n"
                    + t["projectDescriptionLabel"] + p.description + "\n"
                    + t["projectTechLabel"] + (p.stacks || []).join(', ') + "\n"
                    + t["projectGithubLabel"] + p.gitHubLink
                    + "\n\n";
            });
            renderCommandResult(normalizedInput, projectsText.trim() || t["projectsEmpty"]);
            break;
        }

        /* ── certificações ── */
        case "certifications": {
            const t = currentTranslations;
            let certsText = "";
            currentCertifications.forEach(function (c) {
                if (!c.name) return;
                certsText +=
                    t["certNameLabel"] + c.name + "\n"
                    + t["certDescriptionLabel"] + c.description + "\n"
                    + t["certLinkLabel"] + c.link
                    + "\n\n";
            });
            renderCommandResult(normalizedInput, certsText.trim() || t["certificationsEmpty"]);
            break;
        }

        /* ── stacks / tecnologias ── */
        case "stacks": {
            if (!currentStacks.length) {
                renderCommandResult(normalizedInput, currentTranslations["stacksEmpty"]);
                break;
            }
            const ul = document.createElement('ul');
            ul.className = 'stacks-list';
            currentStacks.forEach(function (s) {
                const li = document.createElement('li');
                if (s.icon) {
                    const icon = document.createElement('i');
                    icon.className = s.icon;
                    li.appendChild(icon);
                }
                li.appendChild(document.createTextNode(s.name));
                ul.appendChild(li);
            });
            renderNodeResult(normalizedInput, ul);
            break;
        }

        /* ── alterar tema ── */
        case "themeChange": {
            if (args.length === 0) {
                // sem argumento: mostra opções
                renderCommandResult(normalizedInput, currentTranslations["themeChangeText"]);
            } else {
                const theme = args[0];
                if (VALID_THEMES.includes(theme)) {
                    applyTheme(theme);
                    renderCommandResult(normalizedInput, currentTranslations["themeChangeSuccess"] + theme + "!");
                } else {
                    renderCommandResult(normalizedInput, currentTranslations["themeChangeError"]);
                }
            }
            break;
        }

        /* ── alterar idioma ── */
        case "languageChange": {
            if (args.length === 0) {
                renderCommandResult(normalizedInput, currentTranslations["languageChangeText"]);
            } else {
                const lang = args[0];
                if (VALID_LANGUAGES.includes(lang)) {
                    loadLanguageData(lang).then(function () {
                        currentLanguage = lang;
                        localStorage.setItem('portfolio-lang', lang);
                        document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
                        clearTerminal();
                        applyTranslations();
                    });
                } else {
                    renderCommandResult(normalizedInput, currentTranslations["languageChangeError"]);
                }
            }
            break;
        }

        /* ── ajuda ── */
        case "help": {
            const t = currentTranslations;
            const commandList = [
                t["aboutMe"], t["contact"], t["projects"],
                t["certifications"], t["stacks"],
                t["themeChange"], t["languageChange"], t["help"], t["clear"]
            ].join('\n  ');
            renderCommandResult(normalizedInput, t["helpText"] + "\n  " + commandList);
            break;
        }

        /* ── clear via resolveCommand (key encontrada no JSON) ── */
        case "clear": {
            clearTerminal();
            break;
        }

        default: {
            renderCommandResult(normalizedInput, currentTranslations["commandNotFound"] || "Comando não reconhecido.");
        }
    }
}

/* =============================================
   EVENTO DE SUBMIT DO FORMULÁRIO
   ============================================= */
document.querySelector('#visitor-input').addEventListener('submit', function (event) {
    event.preventDefault();

    const inputEl = document.querySelector('#command-input');
    const value = inputEl.value.trim();

    if (!value) return;

    commandHistoryList.unshift(value);
    commandHistoryIndex = -1;

    // Comando clear: tratado antes do resolveCommand (não depende do idioma carregado)
    const normalized = value.toLowerCase().replace(/\s+/g, ' ');
    if (CLEAR_KEYWORDS.includes(normalized)) {
        clearTerminal();
        inputEl.value = '';
        return;
    }

    handleCommand(normalized);

    inputEl.value = '';
});

/* =============================================
   HISTÓRICO COM SETA PARA CIMA/BAIXO
   ============================================= */
document.querySelector('#command-input').addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (commandHistoryIndex < commandHistoryList.length - 1) {
            commandHistoryIndex++;
            this.value = commandHistoryList[commandHistoryIndex];
        }
    }
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (commandHistoryIndex > 0) {
            commandHistoryIndex--;
            this.value = commandHistoryList[commandHistoryIndex];
        } else {
            commandHistoryIndex = -1;
            this.value = '';
        }
    }
});

/* =============================================
   CLIQUE NOS ITENS DA LISTA (atalho)
   ============================================= */
document.querySelectorAll('.commands-menu').forEach(function (item) {
    item.addEventListener('click', function () {
        const text = this.textContent;
        document.querySelector('#command-input').value = text;
        document.querySelector('#command-input').focus();
    });
});

/* =============================================
   INICIALIZAÇÃO
   ============================================= */
async function init() {
    // Restaura preferências salvas
    const savedTheme = localStorage.getItem('portfolio-theme') || 'gruvbox';
    const savedLang = localStorage.getItem('portfolio-lang') || 'pt';

    applyTheme(savedTheme);

    await loadData();
    await loadLanguageData(savedLang);

    currentLanguage = savedLang;
    document.documentElement.lang = savedLang === "pt" ? "pt-BR" : savedLang;
    applyTranslations();
}

init();