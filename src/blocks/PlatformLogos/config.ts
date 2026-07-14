import type { Block } from "payload";

export const PlatformLogos: Block = {
  slug: "platformLogos",

  labels: {
    singular: "Platform Logos",
    plural: "Platform Logos",
  },

  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
      defaultValue: "Platforms",
    },

    {
      name: "logos",
      type: "array",
      minRows: 1,
      maxRows: 10,

      fields: [
        {
          name: "logo",
          type: "upload",
          relationTo: "media",
          required: true,
        },

        {
          name: "link",
          type: "text",
        },
      ],
    },
  ],
};
