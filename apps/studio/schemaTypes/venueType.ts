import {defineField, defineType} from 'sanity'
import {PinIcon} from '@sanity/icons'
export const venueType = defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'city',
      type: 'string',
    }),
    defineField({
      name: 'country',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      description: 'Canonical URL for the Googlebot crawler to index this content',
      type: 'url',
    }),
  ],
})
