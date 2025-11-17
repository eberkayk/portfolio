"use client";

import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24">
      {/* Başlık */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-center mb-16"
      >
        Get in Touch
      </motion.h1>

      {/* Açıklama */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-center text-gray-600 mb-12"
      >
        I’m always open to discussing new projects, creative ideas, or
        opportunities to be part of your visions.
      </motion.p>

      {/* İletişim Formu */}
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-6 bg-gray-50 dark:bg-gray-900/40 p-8 rounded-xl shadow-lg"
      >
        {/* İsim */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Your full name"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Your email address"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
        </div>

        {/* Mesaj */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            placeholder="Write your message..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          ></textarea>
        </div>

        {/* Gönder Butonu */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Send Message
        </motion.button>
      </motion.form>

      {/* Sosyal Linkler */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex justify-center gap-6 mt-12"
      >
        <a
          href="https://github.com/yourusername"
          target="_blank"
          className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/yourusername"
          target="_blank"
          className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
        >
          LinkedIn
        </a>
        <a
          href="mailto:yourmail@example.com"
          className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
        >
          Email
        </a>
      </motion.div>
    </section>
  );
}