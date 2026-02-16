import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import {DoorsOpenInput} from './components/DoorsOpenInput'
export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'details', title: 'Details'},
    {name: 'editorial', title: 'Editorial'},
  ],
  fieldsets: [{name: 'EventTime', title: 'Event Time', options: {columns: 2}}],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required().info(`Required to generate a page on the website`),
      group: 'details',
      hidden: ({parent}) => !parent?.name,
      readOnly: ({value, currentUser}) => {
        // Anyone can set the initial slug
        if (!value) {
          return false
        }

        const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator')

        // Only admins can change the slug
        return !isAdmin
      },
    }),
    defineField({
      name: 'eventType',
      type: 'string',
      options: {list: ['in-person', 'virtual'], layout: 'radio'},
      group: 'details',
      deprecated: {
        reason: 'Use the "Event format" field instead.',
      },
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'format',
      type: 'string',
      options: {
        list: ['in-person', 'virtual'],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
      group: 'editorial',
    }),
    defineField({
      name: 'date',
      type: 'datetime',
      group: 'editorial',
      fieldset: 'EventTime',
    }),
    defineField({
      name: 'doorsOpen',
      type: 'number',
      initialValue: 60,
      description: 'Number of minutes before the start time for admission',
      group: 'details',
      fieldset: 'EventTime',
      components: {
        input: DoorsOpenInput,
      },
    }),
    defineField({
      name: 'venue',
      type: 'reference',
      to: [{type: 'venue'}],
      validation: (rule) =>
        rule.custom((value, context) => {
          if (value && context?.document?.format === 'virtual') {
            return 'Only in-person events can have a venue'
          }
          return true
        }),
      group: 'editorial',
      // hidden: ({parent}) => parent?.eventType === 'virtual',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      group: 'editorial',
    }),
    defineField({
      name: 'details',
      type: 'array',
      of: [{type: 'block'}],
      group: 'editorial',
    }),
    defineField({
      name: 'tickets',
      type: 'url',
      group: 'editorial',
    }),
    defineField({
      name: 'headline',
      type: 'reference',
      to: [{type: 'artist'}],
      group: 'details',
      title: 'Headline Artist',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      venue: 'venue.name',
      artist: 'headline.name',
      date: 'date',
      image: 'image',
    },
    prepare({name, venue, artist, date, image}) {
      const nameFormatted = name || 'Untitled event'
      const dateFormatted = date
        ? new Date(date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })
        : ''

      return {
        title: artist ? `${nameFormatted} (${artist})` : nameFormatted,
        subtitle: venue ? `${dateFormatted} @ ${venue}` : dateFormatted,
        media: image || CalendarIcon,
      }
    },
  },
})
