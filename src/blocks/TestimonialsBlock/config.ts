import type { Block } from "payload";

export const TestimonialsBlock: Block = {
  slug: "testimonialsBlock",

  labels: {
    singular: "Testimonials Block",
    plural: "Testimonials Blocks",
  },

  fields: [
    {
      name: "title",
      type: "text",
      defaultValue: "Testimonials",
      required: true,
    },

    {
      name: "testimonials",
      type: "array",
      minRows: 1,
      fields: [
        {
          name: "photo",
          type: "upload",
          relationTo: "media",
          required: true,
        },

        {
          name: "text",
          type: "textarea",
          required: true,
        },

        {
          name: "name",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};
