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
    degreeType?: string;
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

  if (!data)
    return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      <Link
        href="/"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 md:top-10 md:right-10 w-14 h-14 sm:w-16 sm:h-16 md:w-[70px] md:h-[70px] rounded-full bg-[#00B050] z-50 flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
      >
        <span className="text-[#191919] text-6xl sm:text-7xl md:text-8xl font-extralight leading-none hover:scale-110 transition-transform duration-300">
          ×
        </span>
      </Link>

      {/* Profile Image */}
      <div className="flex justify-center mt-20 sm:mt-24 md:mt-28 mb-8 sm:mb-10">
        <div className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] md:w-[260px] md:h-[260px] rounded-2xl overflow-hidden shadow-lg">
          {data.profileImage ? (
            <Image
              src={urlFor(data.profileImage).width(1200).height(1200).url()}
              alt={data.name || "Profile"}
              width={1200}
              height={1200}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 grid place-items-center">
              <span className="text-4xl">👤</span>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mb-[100px] px-4 w-full max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-none tracking-tight text-[#191919]">
          {data.name || "ANIL EMMİLER"}
        </h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl lg:text-2xl font-bold px-4 text-[#191919]">
          {data.title || "ISTANBUL BASED DESIGNER & ILLUSTRATOR"}
        </p>
        <a
          href={`mailto:${data.email || "anilemmiler@gmail.com"}`}
          className="mt-2 text-base sm:text-lg md:text-xl lg:text-2xl font-black text-[#26a95a] hover:text-[#063F14] transition-colors duration-300"
        >
          {data.email || "anilemmiler@gmail.com"}
        </a>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-0">
        {data.thingsIDo && data.thingsIDo.length > 0 && (
          <div className="mb-16 sm:mb-20">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-6 sm:mb-8 uppercase tracking-wider text-center text-[#191919]">
              THINGS I DO
            </h2>
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
              {data.thingsIDo.map((thing, i) => (
                <div
                  key={i}
                  className="px-4 bg-[#F8F8F8] text-[#191919] text-sm sm:text-base md:text-lg font-medium rounded-[16px] flex items-center justify-center"
                  style={{ height: "60px" }}
                >
                  <span>{thing}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.toolsIUse && data.toolsIUse.length > 0 && (
          <div className="mb-16 sm:mb-20">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-6 sm:mb-8 uppercase tracking-wider text-center text-[#191919]">
              TOOLS I USE
            </h2>
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
              {data.toolsIUse
                .filter((tool) => tool && tool.name)
                .map((tool, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 pr-4 bg-[#F8F8F8] text-[#191919] text-sm sm:text-base md:text-lg font-medium rounded-[16px]"
                    style={{ height: "60px" }}
                  >
                    {tool.logo && (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 ml-2">
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

        {data.experience && data.experience.length > 0 && (
          <div className="mb-16 sm:mb-20">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-6 sm:mb-8 uppercase tracking-wider text-center text-[#191919]">
              EXPERIENCE
            </h2>
            <div className="space-y-6 sm:space-y-8">
              {data.experience.map((exp, i) => (
                <div
                  key={i}
                  className="flex flex-row items-start gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8 bg-[#F8F8F8] rounded-[24px] sm:rounded-[32px] md:rounded-[40px]"
                >
                  {exp.logo && (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-[12px] sm:rounded-[14px] md:rounded-[16px] overflow-hidden flex-shrink-0">
                      <Image
                        src={urlFor(exp.logo).width(200).height(200).url()}
                        alt={exp.company}
                        width={200}
                        height={200}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="flex-1 min-w-0">
                      {exp.current && (
                        <span className="inline-block mb-2 px-3 py-1 text-[10px] sm:text-xs font-semibold bg-[#00B050] text-white rounded-full uppercase">
                          Current Role
                        </span>
                      )}
                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#191919] break-words">
                        {exp.role}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-[#191919] mt-1 font-medium break-words">
                        {exp.company}
                      </p>
                      <p className="text-xs sm:text-sm md:text-base text-[#191919] mt-1">
                        {exp.duration}
                      </p>
                    </div>

                    {exp.tasks && exp.tasks.length > 0 && (
                      <div className="flex-1 sm:flex-[1.2] min-w-0">
                        <ul className="space-y-1.5 text-xs sm:text-sm md:text-base text-[#191919]">
                          {exp.tasks.map((task, idx) => (
                            <li
                              key={idx}
                              className="flex items-start break-words"
                            >
                              <span className="mr-2 flex-shrink-0">•</span>
                              <span className="flex-1">{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education && data.education.length > 0 && (
          <div className="mb-16 sm:mb-20">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-6 sm:mb-8 uppercase tracking-wider text-center text-[#191919]">
              EDUCATION
            </h2>
            <div className="space-y-6 sm:space-y-8">
              {data.education.map((edu, i) => (
                <div
                  key={i}
                  className="flex flex-row items-start gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8 bg-[#F8F8F8] rounded-[24px] sm:rounded-[32px] md:rounded-[40px]"
                >
                  {/* Logo - Sol */}
                  {edu.logo && (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-[12px] sm:rounded-[14px] md:rounded-[16px] overflow-hidden flex-shrink-0">
                      <Image
                        src={urlFor(edu.logo).width(200).height(200).url()}
                        alt={edu.school}
                        width={200}
                        height={200}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  {/* Content Wrapper */}
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Orta - Degree, School, Duration */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight mb-2 break-words text-[#191919]">
                        {edu.degree}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg font-medium text-[#191919] mb-2 break-words">
                        {edu.school}
                      </p>
                      <p className="text-xs sm:text-sm md:text-base text-[#191919]">
                        {edu.duration}
                      </p>
                    </div>

                    {/* Sağ - Degree Type & GPA */}
                    <div className="flex-1 sm:flex-[1.2] min-w-0">
                      {edu.degreeType && (
                        <p className="text-xs sm:text-sm md:text-base text-[#191919] mb-2">
                          {edu.degreeType}
                        </p>
                      )}
                      {edu.gpa && (
                        <p className="text-xs sm:text-sm md:text-base text-[#191919]">
                          {edu.gpa}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="w-full bg-[#00B050] text-center py-12 sm:py-14 md:py-16 text-white px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-8 sm:mb-10 md:mb-12 text-[#191919]">
          CONTACTS
        </h2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-base sm:text-lg md:text-xl lg:text-2xl font-black">
          <a
            href="https://www.instagram.com/anilemmiler?igsh=MWpkdDN3Z2V6cmh6OA%3D%3D&utm_source=qr"
            className="hover:text-[#00693a] hover:scale-105 transition-all duration-300"
          >
            INSTAGRAM
          </a>
          <a
            href="https://dribbble.com/anilemmiler"
            className="hover:text-[#00693a] hover:scale-105 transition-all duration-300"
          >
            DRIBBBLE
          </a>
          <a
            href="https://www.behance.net/anilemmiler"
            className="hover:text-[#00693a] hover:scale-105 transition-all duration-300"
          >
            BEHANCE
          </a>
          <a
            href="https://open.spotify.com/artist/02btoKVtot82NXrfZwnTUt?si=WjxjhlBcSF6e-ar25_Q6FQ"
            className="hover:text-[#00693a] hover:scale-105 transition-all duration-300"
          >
            SPOTIFY
          </a>
        </div>
        <p className="mt-8 sm:mt-10 text-xs sm:text-sm font-semibold text-[#191919]">
          © ANIL EMMİLER 2026
        </p>
      </footer>
    </div>
  );
}
