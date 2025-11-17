# 🎨 Anıl Emmiler - Portfolio Website

Modern, responsive portfolio website built with Next.js 14, Tailwind CSS, Framer Motion, and Sanity CMS.

![Portfolio Preview](https://via.placeholder.com/1200x600?text=Portfolio+Screenshot)

## ✨ Features

- 🎯 **Modern Design** - Clean, minimal, and professional
- 📱 **Fully Responsive** - Works on all devices
- 🎭 **Smooth Animations** - Framer Motion powered
- 🖼️ **Image Lightbox** - Full-screen image viewer with navigation
- 🎨 **Work Showcase** - Filterable portfolio grid
- 📝 **CMS Integration** - Easy content management with Sanity
- 🚀 **Fast Performance** - Optimized with Next.js 14

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **CMS:** Sanity.io
- **Language:** TypeScript
- **Deployment:** Vercel (recommended)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Sanity account

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. **Install dependencies:**
```bash
npm install --legacy-peer-deps
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

4. **Add profile icon:**

Place your profile icon image as `profile-icon.png` in the `/public` folder.

5. **Run development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

6. **Run Sanity Studio (optional):**
```bash
npm run studio
```

Studio will be available at [http://localhost:3333](http://localhost:3333)

## 📁 Project Structure
```
portfolio/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page
│   │   ├── about/
│   │   │   └── page.tsx          # About page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Parallax.tsx
│   │   ├── Reveal.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── sanity.ts             # Sanity client
│   │   └── queries.ts            # GROQ queries
│   └── types/
├── schemas/                      # Sanity schemas
├── public/
│   └── profile-icon.png          # Profile icon
├── .env.local                    # Environment variables (not in git)
├── .env.example                  # Example env file
└── package.json
```

## 🎨 Customization

### Colors

Main brand color: `#00B050` (Green)

To change colors, update:
- `src/app/globals.css`
- Tailwind classes in components

### Content

All content is managed through Sanity CMS:

1. **Works:** Add portfolio items
2. **About:** Update profile, skills, experience, education
3. **Profile Image:** Upload in Sanity Studio

## 📝 Sanity Schemas

### Work Schema
```typescript
{
  title: string
  slug: string
  category: "illustration" | "design" | "music"
  featured: boolean
  image: image
  images: array<image>
  description: text
}
```

### About Schema
```typescript
{
  profileImage: image
  name: string
  title: string
  email: string
  thingsIDo: array<string>
  toolsIUse: array<string>
  experience: array<object>
  education: array<object>
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy
```bash
vercel
```

### Environment Variables for Production

Add these to your hosting platform:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Anıl Emmiler**
- Website: [Your Website]
- Email: anilemmiler@gmail.com
- Location: Istanbul, Turkey

## 🙏 Acknowledgments

- Design inspiration from modern portfolio websites
- Built with love and coffee ☕

---

**⭐ If you like this project, please give it a star!**