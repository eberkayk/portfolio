const experience = {
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    {
      name: "role",
      title: "Role",
      type: "string",
    },
    {
      name: "company",
      title: "Company",
      type: "string",
    },
    {
      name: "duration",
      title: "Duration",
      type: "string",
    },
    {
      name: "current",
      title: "Current Role?",
      type: "boolean",
    },
    {
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "logo",
      title: "Logo",
      type: "image",
    },
  ],
};

export default experience;
