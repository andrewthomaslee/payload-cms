import type { Block } from "payload";

export const FeaturesSection: Block = {
  slug: "featuresSection",

  labels: {
    singular: "Features Section",
    plural: "Features Sections",
  },

  fields: [
    {
      name: "features",
      type: "array",
      minRows: 3,
      maxRows: 3,
      fields: [
        {
          name: "icon",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
          required: true,
        },
      ],
    },
    {
      name: "buttonText",
      type: "text",
      defaultValue: "OUR SERVICES",
    },
    {
      name: "buttonLink",
      type: "text",
      defaultValue: "/our-services",
    },
  ],
};
