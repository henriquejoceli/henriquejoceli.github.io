# 💻 Portfólio — Henrique B Joceli

> Terminal interativo com suporte a múltiplos idiomas e temas, construído com HTML, CSS e JavaScript puro.

---

## ✨ Funcionalidades

- **Terminal interativo** — navegação por comandos, como um terminal real
- **3 idiomas** — Português 🇧🇷, Inglês 🇺🇸 e Espanhol 🇪🇸
- **3 temas visuais** — Gruvbox, Dracula e Solarized Dark
- **Histórico de comandos** — navegue com ↑ ↓ entre comandos anteriores
- **Links clicáveis** — LinkedIn e GitHub abrem direto no navegador
- **Tecnologias com ícones** — lista visual das stacks utilizadas
- **Preferências salvas** — tema e idioma persistem via `localStorage`
- **Responsivo** — funciona em desktop e mobile

---

## 🗂️ Estrutura do Projeto

```
meu-portfolio/
├── index.html
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    ├── lang/
    │   ├── pt.json
    │   ├── en.json
    │   └── es.json
    └── data/
        ├── contact.json
        ├── stacks.json
        ├── colors.json
        ├── projects/
        │   ├── projects-pt.json
        │   ├── projects-en.json
        │   └── projects-es.json
        └── certifications/
            ├── certifications-pt.json
            ├── certifications-en.json
            └── certifications-es.json
```

---

## 🖥️ Comandos disponíveis no terminal

| Comando (PT) | Comando (EN) | Comando (ES) | Ação |
|---|---|---|---|
| `sobre mim` | `about me` | `sobre mí` | Exibe apresentação pessoal |
| `contato` | `contact` | `contacto` | Exibe informações de contato |
| `projetos` | `projects` | `proyectos` | Lista os projetos |
| `certificações` | `certifications` | `certificaciones` | Lista certificações |
| `tecnologias` | `stacks` | `tecnologías` | Exibe as stacks utilizadas |
| `alterar tema <nome>` | `change theme <name>` | `cambiar tema <nombre>` | Troca o tema |
| `alterar idioma <código>` | `change language <code>` | `cambiar idioma <código>` | Troca o idioma |
| `ajuda` | `help` | `ayuda` | Lista todos os comandos |
| `limpar` | `clear` | `limpiar` | Limpa o terminal |

---

## ⚙️ Como personalizar

### Dados pessoais
Edite `assets/data/contact.json`:
```json
{
    "fullName": "Seu Nome",
    "email": "seu@email.com",
    "currentCompany": "Empresa",
    "position": "Cargo",
    "linkedin": "https://linkedin.com/in/seu-perfil",
    "github": "https://github.com/seu-usuario"
}
```

### Projetos
Edite os arquivos em `assets/data/projects/` (um por idioma):
```json
[
    {
        "name": "Nome do Projeto",
        "description": "Descrição do projeto.",
        "stacks": ["Java", "Spring Boot"],
        "gitHubLink": "https://github.com/...",
        "gif": ""
    }
]
```

### Tecnologias
Edite `assets/data/stacks.json`. O campo `icon` aceita classes do [Devicon](https://devicon.dev/):
```json
[
    { "name": "Java 21", "icon": "devicon-java-plain colored" },
    { "name": "Spring Boot", "icon": "devicon-spring-plain colored" }
]
```




## 🛠️ Tecnologias

- HTML5 · CSS3 · JavaScript (ES2020+)
- [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) — Google Fonts
- [Devicon](https://devicon.dev/) — ícones de tecnologias

---

## 📄 Licença

Projeto pessoal. Sinta-se livre para usar como inspiração. 😄
