import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Your profile photo (recommended: 300x300px)',
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Your full name',
    }),
    defineField({
      name: 'title',
      title: 'Professional Title',
      type: 'string',
      description: 'e.g., "ISTANBUL BASED DESIGNER & ILLUSTRATOR"',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Your contact email',
    }),
    defineField({
      name: 'thingsIDo',
      title: 'Things I Do',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add your skills and services',
    }),
    defineField({
      name: 'toolsIUse',
      title: 'Tools I Use',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add tools and software you use',
    }),
    defineField({
      name: 'experience',
      title: 'Work Experience',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'company',
              title: 'Company',
              type: 'string',
            },
            {
              name: 'role',
              title: 'Role/Position',
              type: 'string',
            },
            {
              name: 'duration',
              title: 'Duration',
              type: 'string',
              description: 'e.g., "5 yrs 4 mos" or "Jan 2020 - Dec 2023"',
            },
            {
              name: 'tasks',
              title: 'Tasks/Description',
              type: 'text',
            },
            {
              name: 'current',
              title: 'Current Role',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'logo',
              title: 'Company Logo',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'school',
              title: 'School/University',
              type: 'string',
            },
            {
              name: 'degree',
              title: 'Degree',
              type: 'string',
              description: 'e.g., "Master\'s Degree" or "Bachelor\'s Degree"',
            },
            {
              name: 'duration',
              title: 'Duration',
              type: 'string',
              description: 'e.g., "4 yrs" or "2018 - 2022"',
            },
            {
              name: 'gpa',
              title: 'GPA (Optional)',
              type: 'string',
              description: 'e.g., "3.47" or "3.63"',
            },
            {
              name: 'logo',
              title: 'School Logo',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
    }),
  ],
})