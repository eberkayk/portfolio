export const ABOUT_PAGE = `
  *[_type == "about"][0] {
    profileImage,
    name,
    title,
    email,
    introText,
    thingsIDo,
    toolsIUse[] {
      name,
      logo
    },
    experience[] {
      company,
      role,
      duration,
      tasks,
      current,
      logo
    },
    education[] {
      school,
      degree,
      duration,
      degreeType,
      gpa,
      logo
    },
    "ogImage": ogImage.asset->url
  }
`;

export const FEATURED_WORKS = `
  *[_type == "work" && featured == true] | order(coalesce(order, 999) asc, createdAt desc) {
    _id,
    title,
    slug,
    category,
    featured,
    image,
   "video": video.asset->url,
   "videos": videos[].asset->url,
    description,
    images,
    createdAt
  }
`;

export const ALL_WORKS = `
  *[_type == "work"] | order(coalesce(order, 999) asc, createdAt desc) {
    _id,
    title,
    slug,
    category,
    featured,
    image,
    "video": video.asset->url,
    "videos": videos[].asset->url,
    description,
    images,
    createdAt
  }
`;
