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
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'thingsIDo',
      title: 'Things I Do',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'toolsIUse',
      title: 'Tools I Use',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Tool Name',
              type: 'string',
            },
            {
              name: 'logo',
              title: 'Tool Logo',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
          preview: {
            select: {
              title: 'name',
              media: 'logo',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'experience',
      title: 'Experience',
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
              title: 'Role',
              type: 'string',
            },
            {
              name: 'duration',
              title: 'Duration',
              type: 'string',
            },
            {
              name: 'tasks',
              title: 'Tasks',
              type: 'array',
              of: [{ type: 'string' }],
            },
            {
              name: 'current',
              title: 'Current Position',
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
              title: 'School',
              type: 'string',
            },
            {
              name: 'degree',
              title: 'Degree',
              type: 'string',
            },
            {
              name: 'duration',
              title: 'Duration',
              type: 'string',
            },
            {
              name: 'gpa',
              title: 'GPA',
              type: 'string',
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