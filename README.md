<p align="center">
  <a href="https://nextjs.org">
    <picture>
      <source media="(prefers-color-scheme: dark)">
      <img src="./public/images/jesa-logo.png" height="128">
    </picture>
    <h1 align="center">Jesa</h1>
    <p align="center">✨ Leave a Star On The Repository ✨</p>
  </a>
</p>

JESA (J'pura Employability Skills Awards), the ultimate platform for honoring the accomplishments of young talents. With 13 prestigious awards exclusively dedicated to undergraduates of the University of Sri Jayewardenepura, and a new special award open to students from other universities, JESA sets a remarkable standard for recognition.

Organized by the Career Skills Development Society of the University, this highly regarded award ceremony, initiated in 2015, continues to captivate audiences. Join us this year to witness the expansion of the JESA legacy, as talented undergraduates from diverse institutions compete for the coveted Best Innovator Award.

## Contributing

Prerequisites :

- Install [Git](https://www.git-scm.com/downloads).
- Install [Nodejs](https://nodejs.org/en) or [Bun](https://bun.sh/).

Install Bun:

_Linux & macOS_

`$ curl -fsSL https://bun.sh/install | bash`

_Windows_

`> powershell -c "irm bun.sh/install.ps1 | iex"`

We recomment using Bun for faster development and runtime

- `git clone https://github.com/University-Of-Sri-Jayewardenepura/jesa`
- `cd jesa`
- `bun install` or `npm install`
- `bun run dev` or `npm run dev`

App Structure

```
├── app
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── ui
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ...
│   ├── main-nav.tsx
│   └── ...
├── lib
│   └── utils.ts
├── bun.lockb
├── components.json
├── LICENSE.md
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

## Authors
