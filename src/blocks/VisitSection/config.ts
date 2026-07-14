import type { Block } from "payload";

export const VisitSection: Block = {
  slug: "visitSection",
  labels: {
    singular: "Visit Section",
    plural: "Visit Sections",
  },
  fields: [
    {
      name: "title",
      type: "text",
      defaultValue: "Visit Us",
    },

    {
      name: "content",
      type: "richText",
    },

    {
      name: "mapEmbedUrl",
      type: "text",
      label: "Google Map Embed URL",
    },

    {
      name: "mapHeight",
      type: "number",
      defaultValue: 500,
    },
  ],
};
