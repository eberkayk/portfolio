import { option } from 'framer-motion/client'
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'work',
  title: 'Work',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first (1, 2, 3...)',
      validation: (Rule: any) => Rule.min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      }
    }),
    defineField({
      name: 'images',
      title: 'Additional Images',
      type: 'array',
      of: [{ type: 'image' }],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Illustration', value: 'illustration' },
          { title: 'UI/UX', value: 'ui/ux' },
          { title: 'Animation', value: 'animation' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    }),
    defineField({
      name: 'videos',
      title: 'Additional Videos',
      type: 'array',
      of: [
        {
          type: 'file',
          options: {
          accept: 'video/*',
          },
        },
      ],
      description: 'Upload multiple videos to show in modal',
      }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
})