import Reveal from "@/components/Reveal";

export default function Footer() {
  return (
    <footer className="w-full bg-[#00B050] text-center py-16 text-white mt-20">
      <Reveal>
        <h2 className="text-5xl font-black mb-12 text-black">CONTACTS</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="flex flex-wrap justify-center gap-8 text-2xl font-black">
          <a href="#" className="hover:opacity-80">
            INSTAGRAM
          </a>
          <a href="#" className="hover:opacity-80">
            DRIBBBLE
          </a>
          <a href="#" className="hover:opacity-80">
            BEHANCE
          </a>
          <a href="#" className="hover:opacity-80">
            SPOTIFY
          </a>
        </div>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-10 text-sm font-semibold text-black">
          © ANIL EMMİLER 2025
        </p>
      </Reveal>
    </footer>
  );
}
