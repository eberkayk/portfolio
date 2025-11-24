"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "@/lib/sanity";
import { ABOUT_PAGE } from "@/lib/queries";

type About = {
  profileImage?: any;
  name?: string;
  title?: string;
  email?: string;
  thingsIDo?: string[];
  toolsIUse?: Array<{
    name: string;
    logo?: any;
  }>;
  experience?: Array<{
    company: string;
    role: string;
    duration: string;
    tasks?: string[];
    current?: boolean;
    logo?: any;
  }>;
  education?: Array<{
    school: string;
    degree: string;
    duration: string;
    gpa?: string;
    logo?: any;
  }>;
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
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      {/* Home Button - Yeşil Daire + Siyah Çarpı */}
      <Link 
        href="/"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 md:top-10 md:right-10 w-12 h-12 sm:w-14 sm:h-14 md:w-[60px] md:h-[60px] rounded-full bg-[#00B050] z-40 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer group"
      >
        <span className="text-black text-2xl sm:text-3xl md:text-4xl font-light leading-none group-hover:rotate-90 transition-transform duration-300">
          ×
        </span>
      </Link>
      
      {/* Main content */}
      <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28 pb-0">
        
        {/* Profile section */}
        <div className="flex flex-col items-center mb-12 sm:mb-14 md:mb-16">
          <div className="w-[260px] h-[260px] rounded-2xl sm:rounded-[20px] overflow-hidden mb-4 sm:mb-6 bg-gray-200 shadow-md">
            {data.profileImage ? (
              <Image
                src={urlFor(data.profileImage).width(260).height(260).url()}
                alt={data.name || "Profile"}
                width={260}
                height={260}
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
        {data.thingsIDo && data.thingsIDo.length > 0 && (
          <div className="mb-10 sm:mb-12">
            <h2 className="text-[17px] sm:text-[19px] md:text-xl font-bold mb-3 sm:mb-4 uppercase tracking-wider text-center">
              THINGS I DO
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              {data.thingsIDo.map((thing, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-[#f8f8f8] text-black text-xs sm:text-sm md:text-base font-medium rounded-2xl"
                >
                  {thing}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tools I Use */}
        {data.toolsIUse && data.toolsIUse.length > 0 && (
          <div className="mb-10 sm:mb-12">
            <h2 className="text-[17px] sm:text-[19px] md:text-xl font-bold mb-3 sm:mb-4 uppercase tracking-wider text-center">
              TOOLS I USE
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              {data.toolsIUse
                .filter(tool => tool && tool.name)
                .map((tool, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 bg-[#f8f8f8] text-black text-xs sm:text-sm md:text-base font-medium rounded-2xl"
                  >
                    {tool.logo && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={urlFor(tool.logo).width(80).height(80).url()}
                          alt={tool.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <span>{tool.name}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="mb-10 sm:mb-12">
            <h2 className="text-[17px] sm:text-[19px] md:text-xl font-bold mb-4 sm:mb-5 uppercase tracking-wider">
              EXPERIENCE
            </h2>
            <div className="space-y-4 sm:space-y-5">
              {data.experience.map((exp, i) => (
                <div
                  key={i}
                  className="bg-[#F5F5F5] rounded-[24px] sm:rounded-[40px] p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-5"
                >
                  {/* Logo */}
                  {exp.logo && (
                    <div className="w-[120px] h-[120px] sm:w-[200px] sm:h-[200px] rounded-[16px] sm:rounded-[24px] overflow-hidden flex-shrink-0 bg-white shadow-sm mx-auto sm:mx-0">
                      <Image
                        src={urlFor(exp.logo).width(200).height(200).url()}
                        alt={exp.company}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-2 mb-2">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold leading-tight">
                        {exp.role}
                      </h3>
                      {exp.current && (
                        <span className="px-2 py-1 bg-[#00B050] text-white text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-gray-700 mb-1">
                      {exp.company}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                      {exp.duration}
                    </p>
                    {exp.tasks && exp.tasks.length > 0 && (
                      <ul className="space-y-1.5 sm:space-y-2">
                        {exp.tasks.map((task, j) => (
                          <li
                            key={j}
                            className="text-xs sm:text-sm text-gray-700 flex items-start gap-2"
                          >
                            <span className="text-[#00B050] mt-1 flex-shrink-0">•</span>
                            <span className="flex-1">{task}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="mb-10 sm:mb-12">
            <h2 className="text-[17px] sm:text-[19px] md:text-xl font-bold mb-4 sm:mb-5 uppercase tracking-wider">
              EDUCATION
            </h2>
            <div className="space-y-4 sm:space-y-5">
              {data.education.map((edu, i) => (
                <div
                  key={i}
                  className="bg-[#F5F5F5] rounded-[24px] sm:rounded-[40px] p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-5"
                >
                  {/* Logo */}
                  {edu.logo && (
                    <div className="w-[120px] h-[120px] sm:w-[200px] sm:h-[200px] rounded-[16px] sm:rounded-[24px] overflow-hidden flex-shrink-0 bg-white shadow-sm mx-auto sm:mx-0">
                      <Image
                        src={urlFor(edu.logo).width(200).height(200).url()}
                        alt={edu.school}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold leading-tight mb-2">
                      {edu.degree}
                    </h3>
                    <p className="text-sm sm:text-base font-semibold text-gray-700 mb-1">
                      {edu.school}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2">
                      {edu.duration}
                    </p>
                    {edu.gpa && (
                      <p className="text-xs sm:text-sm font-semibold text-[#00B050]">
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="w-full bg-[#00B050] text-center py-12 sm:py-14 md:py-16 text-white mt-10 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-8 sm:mb-10 md:mb-12 text-black">CONTACTS</h2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-base sm:text-lg md:text-xl lg:text-2xl font-black">
          <a href="#" className="hover:text-[#00693a] hover:scale-110 transition-all duration-300">INSTAGRAM</a>
          <a href="#" className="hover:text-[#00693a] hover:scale-110 transition-all duration-300">DRIBBBLE</a>
          <a href="#" className="hover:text-[#00693a] hover:scale-110 transition-all duration-300">BEHANCE</a>
          <a href="#" className="hover:text-[#00693a] hover:scale-110 transition-all duration-300">SPOTIFY</a>
        </div>
        <p className="mt-8 sm:mt-10 text-xs sm:text-sm font-semibold text-black">© ANIL EMMİLER 2025</p>
      </footer>
    </div>
  );
}
