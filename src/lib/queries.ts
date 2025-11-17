export const ABOUT_PAGE = `
  *[_type == "about"][0] {
    profileImage,
    name,
    title,
    email,
    thingsIDo,
    toolsIUse,
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
      gpa,
      logo
    }
  }
`;

export const FEATURED_WORKS = `
  *[_type == "work" && featured == true] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    featured,
    image,
    images,
    description
  }
`;

export const ALL_WORKS = `
  *[_type == "work"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    featured,
    image,
    images,
    description
  }
`;