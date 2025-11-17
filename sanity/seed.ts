import dotenv from "dotenv"
import { createClient } from "@sanity/client"

// ✅ .env.local dosyasını yükle
dotenv.config({ path: ".env.local" })

// ✅ Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2023-05-03",
  token: process.env.SANITY_WRITE_TOKEN!, // WRITE token gerekli
  useCdn: false,
})

// ✅ Seed data
const works = [
  {
    _id: "work-1",
    _type: "work",
    title: "Dreamy Landscape",
    description:
      "A colorful digital painting inspired by surreal landscapes and dreamlike vibes.",
    images: [],
  },
  {
    _id: "work-2",
    _type: "work",
    title: "Minimal Poster",
    description:
      "A minimalistic poster design exploring typography and layout balance.",
    images: [],
  },
  {
    _id: "work-3",
    _type: "work",
    title: "Character Concept Art",
    description:
      "Concept art for an original character design, focused on vibrant colors and storytelling.",
    images: [],
  },
]

async function seed() {
  try {
    console.log("🌱 Seeding Sanity with sample works...")

    for (const work of works) {
      await client.createIfNotExists(work)
      console.log(`✔️  Created: ${work.title}`)
    }

    console.log("✅ Seeding finished.")
  } catch (error) {
    console.error("❌ Error seeding data:", error)
  }
}

seed()
