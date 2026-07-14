import type { Block } from "payload";

export const AboutSection: Block = {
  slug: "aboutSection",

  labels: {
    singular: "About Section",
    plural: "About Sections",
  },

  
  fields: [
    {
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "buttonText",
      type: "text",
      defaultValue: "LEARN MORE",
    },
    {
      name: "buttonLink",
      type: "text",
      defaultValue: "/about",
    },
    {
      name: "video",
      type: "upload",
      relationTo: "media",
    },
  ],
};
