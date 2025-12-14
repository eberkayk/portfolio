export const ABOUT_PAGE = `
  *[_type == "about"][0] {
    profileImage,
    name,
    title,
    email,
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
    }
  }
`;

export const FEATURED_WORKS = `
  *[_type == "work" && featured == true] | order(createdAt desc) {
    _id,
    title,
    slug,
    category,
    featured,
    image,
   "video": video.asset->url,
    description,
    images,
    createdAt
  }
`;

export const ALL_WORKS = `
  *[_type == "work"] | order(createdAt desc) {
    _id,
    title,
    slug,
    category,
    featured,
    image,
    "video": video.asset->url,
    description,
    images,
    createdAt
  }
`;
