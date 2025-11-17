"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";
import { ABOUT_PAGE } from "@/lib/queries";
import Reveal from "@/components/Reveal";
import StaggerReveal from "@/components/StaggerReveal";
import Link from "next/link";

type Exp = {
  company: string;
  role: string;
  duration: string;
  tasks: string;
  current?: boolean;
  logo?: any;
};

type Edu = {
  school: string;
  degree: string;
  duration: string;
  gpa?: string;
  logo?: any;
};

type About = {
  profileImage?: any;
  name?: string;
  title?: string;
  email?: string;
  thingsIDo?: string[];
  toolsIUse?: string[];
  experience?: Exp[];
  education?: Edu[];
};

export default function AboutPage() {
  const [data, setData] = useState<About | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const d = await client.fetch<About>(ABOUT_PAGE);
        console.log("About data:", d);
        setData(d);
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    })();
  }, []);

  if (!data) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Home Button - Modern X İkonu */}
      <Link 
        href="/"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 md:top-10 md:right-10 w-12 h-12 sm:w-14 sm:h-14 md:w-[60px] md:h-[60px] rounded-full bg-[#00B050] z-40 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer group"
      >
        <svg 
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-black group-hover:rotate-90 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </Link>

      {/* Main content */}
      <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28">
        
        {/* Profile section */}
        <div className="flex flex-col items-center mb-12 sm:mb-14 md:mb-16">
          <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-[140px] md:h-[140px] rounded-2xl sm:rounded-[20px] overflow-hidden mb-4 sm:mb-6 bg-gray-200 shadow-md">
            {data.profileImage ? (
              <Image
                src={urlFor(data.profileImage).width(300).height(300).url()}
                alt={data.name || "Profile"}
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 grid place-items-center">
                <span className="text-4xl">👤</span>
              </div>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide text-center">
            {data.name || "ANIL EMMİLER"}
          </h1>
          <p className="mt-2 text-[10px] sm:text-[11px] md:text-xs uppercase tracking-[.18em] opacity-70 text-center px-4">
            {data.title || "ISTANBUL BASED DESIGNER & ILLUSTRATOR"}
          </p>
          <p className="mt-2 text-sm sm:text-[15px] md:text-[17px] font-semibold text-[#00B050] text-center break-all px-4">
            {data.email || "anilemmiler@gmail.com"}
          </p>
        </div>

        {/* Things I Do */}
        <section className="mt-12 sm:mt-14 md:mt-16">
          <Reveal>
            <h2 className="text-xl sm:text-2xl md:text-[28px] font-extrabold text-center mb-4 sm:mb-5 md:mb-6">
              THINGS I DO
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2">
              {data.thingsIDo && data.thingsIDo.length > 0 ? (
                data.thingsIDo.map((thing, idx) => (
                  <span
                    key={idx}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#F5F5F5] rounded-full text-xs sm:text-[13px] md:text-[14px] font-medium text-gray-700"
                  >
                    {thing}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400">No data available</p>
              )}
            </div>
          </Reveal>
        </section>

        {/* Tools I Use */}
        <section className="mt-10 sm:mt-12 md:mt-14">
          <Reveal>
            <h2 className="text-xl sm:text-2xl md:text-[28px] font-extrabold text-center mb-4 sm:mb-5 md:mb-6">
              TOOLS I USE
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {data.toolsIUse && data.toolsIUse.length > 0 ? (
                data.toolsIUse.map((tool, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition"
                  >
                    <span className="text-base sm:text-lg">🛠️</span>
                    <span className="text-xs sm:text-[13px] md:text-[14px] font-medium text-gray-800">
                      {tool}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No data available</p>
              )}
            </div>
          </Reveal>
        </section>

        {/* Prior Work Experience */}
        <section className="mt-12 sm:mt-14 md:mt-16">
          <Reveal>
            <h2 className="text-xl sm:text-2xl md:text-[28px] font-extrabold text-center mb-6 sm:mb-8 md:mb-10">
              PRIOR WORK EXPERIENCE
            </h2>
          </Reveal>

          <StaggerReveal stagger={0.08}>
            <div className="space-y-4 sm:space-y-5">
              {data.experience && data.experience.length > 0 ? (
                data.experience.map((e, i) => (
                  <div
                    key={`${e.company}-${i}`}
                    className="flex gap-3 sm:gap-4 md:gap-5 items-start p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#F9F9F9] border border-gray-100 hover:border-gray-200 transition"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-[80px] md:h-[80px] rounded-lg sm:rounded-xl bg-white shadow-sm grid place-items-center overflow-hidden shrink-0">
                      {e.logo ? (
                        <Image
                          src={urlFor(e.logo).width(160).height(160).url()}
                          alt={e.company}
                          width={160}
                          height={160}
                          className="object-contain w-[65%] h-[65%]"
                        />
                      ) : (
                        <div className="w-[55%] h-[55%] bg-black/10 rounded" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {e.current && (
                        <span className="inline-block text-[9px] sm:text-[10px] px-2 sm:px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase tracking-wide mb-1">
                          Current Role
                        </span>
                      )}
                      <div className="font-bold text-sm sm:text-[15px] md:text-[16px] text-black">
                        {e.role}
                      </div>
                      <div className="text-xs sm:text-sm text-black/60 mb-0.5">
                        {e.company}
                      </div>
                      <div className="text-[11px] sm:text-[12px] text-black/50">{e.duration}</div>

                      {e.tasks && (
                        <p className="mt-2 sm:mt-3 text-xs sm:text-[13px] text-black/70 leading-5 sm:leading-6">
                          {e.tasks}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No work experience added yet</p>
                  <p className="text-xs mt-2">Add experience in Sanity Studio</p>
                </div>
              )}
            </div>
          </StaggerReveal>
        </section>

        {/* Education */}
        <section className="mt-10 sm:mt-12 md:mt-14">
          <Reveal>
            <h2 className="text-xl sm:text-2xl md:text-[28px] font-extrabold text-center mb-6 sm:mb-8 md:mb-10">
              EDUCATION
            </h2>
          </Reveal>

          <StaggerReveal stagger={0.08}>
            <div className="space-y-4 sm:space-y-5">
              {data.education && data.education.length > 0 ? (
                data.education.map((e, i) => (
                  <div
                    key={`${e.school}-${i}`}
                    className="flex gap-3 sm:gap-4 md:gap-5 items-center p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#F9F9F9] border border-gray-100 hover:border-gray-200 transition"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-[80px] md:h-[80px] rounded-lg sm:rounded-xl bg-white shadow-sm grid place-items-center overflow-hidden shrink-0">
                      {e.logo ? (
                        <Image
                          src={urlFor(e.logo).width(160).height(160).url()}
                          alt={e.school}
                          width={160}
                          height={160}
                          className="object-contain w-[65%] h-[65%]"
                        />
                      ) : (
                        <div className="w-[55%] h-[55%] bg-black/10 rounded" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm sm:text-[15px] md:text-[16px] text-black">
                        {e.degree}
                        {e.gpa && <span className="text-black/60 font-normal"> • {e.gpa}</span>}
                      </div>
                      <div className="text-xs sm:text-sm text-black/60">
                        {e.school}
                      </div>
                      <div className="text-[11px] sm:text-[12px] text-black/50">{e.duration}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No education added yet</p>
                  <p className="text-xs mt-2">Add education in Sanity Studio</p>
                </div>
              )}
            </div>
          </StaggerReveal>
        </section>
      </div>

      {/* Contacts Footer */}
      <section className="w-full bg-[#00B050] py-10 sm:py-12 md:py-14 px-6 sm:px-8 text-white text-center mt-16 sm:mt-18 md:mt-20">
        <Reveal>
          <h2 className="text-xl sm:text-2xl md:text-[28px] font-extrabold text-black mb-6 sm:mb-8 md:mb-10">
            CONTACTS
          </h2>
        </Reveal>
        <StaggerReveal stagger={0.08}>
          <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 justify-center text-sm sm:text-base md:text-lg font-black">
            <a href="#" className="hover:opacity-80 transition">INSTAGRAM</a>
            <a href="#" className="hover:opacity-80 transition">DRIBBBLE</a>
            <a href="#" className="hover:opacity-80 transition">BEHANCE</a>
            <a href="#" className="hover:opacity-80 transition">SPOTIFY</a>
          </div>
        </StaggerReveal>
        <Reveal delay={0.1}>
          <p className="mt-8 sm:mt-10 text-xs sm:text-sm font-semibold text-black">© ANIL EMMİLER 2025</p>
        </Reveal>
      </section>
    </div>
  );
}