<p align="center">
  <a href="http://careerskills.sjp.ac.lk/">
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
│   ├── api
│   │   ├── register
│   │   |   ├── ...
│   ├── awards
│   │   ├── page.tsx
│   │   └── awards-card.tsx
│   ├── hall-of-fame
│   │   ├── page.tsx
│   │   └── hall-of-fame.tsx
│   ├── register
│   │   ├── page.tsx
│   │   ├── ...
│   ├── terms
│   │   ├── page.tsx
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
│   └── error.tsx
│   └── sitemap.ts
│   └── fonts.ts
├── components
│   ├── ui
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ...
│   ├── animated
│   │   ├── blur-in.tsx
│   └── ├── ...
│   ├── navbar.tsx
│   └── ...
├── constants
│   └── awards.ts
│   └── form.ts
│   └── ...
├── models
├── public
│   └── fonts
│   └── images
├── lib
│   └── utils.ts
│   └── mongodb.ts
├── bun.lockb
├── .env.example
├── components.json
├── LICENSE.md
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

## Built with:

### JavaScript frameworks:

- <a href="https://react.dev/">React</a>
- <a href="https://nextjs.org/">Next.js 14</a>

### UI frameworks :

- <a href="https://www.radix-ui.com/">Radix UI</a>
- <a href="https://ui.shadcn.com/">shadcn UI</a>
- <a href="https://tailwindcss.com/">Tailwind CSS</a>
- <a href="https://ui.aceternity.com/">Aceternity UI</a>
- <a href="https://magicui.design/">Magic UI</a>

### Animations

- <a href="https://www.framer.com/motion/animation/">Framer Motion</a>

### Icons

- <a href="https://lucide.dev/icons/">Lucide</a>

### Analytics

- <a href="https://analytics.google.com/">Google Analytics GA4</a>

### Data Validation

- <a href="https://zod.dev/">Zod</a>

### Database & Object Modeling

- <a href="https://www.mongodb.com/">MongoDB</a>
- <a href="https://mongoosejs.com/">mongoose</a>

### Deployment

- <a href="https://vercel.com">Vercel</a>

## Authors

- [Pruthivi Thejan](https://links.pruthivithejan.me)
- [Sonal Jayasinghe](https://github.com/SonalJayasinghe)
- [Yasitha Renuk](https://github.com/YasithaRenuk)
- [Kasun Rathnayaka](https://github.com/kasun-m-rathnayaka)
