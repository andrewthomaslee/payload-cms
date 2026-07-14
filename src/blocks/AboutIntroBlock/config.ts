import type { Block } from "payload";

export const AboutIntroBlock: Block = {
  slug: "aboutIntro",
  interfaceName: "AboutIntroBlock",
  labels: {
    singular: "About Intro Block",
    plural: "About Intro Blocks",
  },
  fields: [
    {
      name: "sectionTitle",
      type: "text",
      defaultValue: "Who is bff?",
      required: true,
    },
    {
      name: "cardTitle",
      type: "text",
      defaultValue: "Meet your new BFF.",
      required: true,
    },
    {
      name: "cardText",
      type: "textarea",
      required: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
  ],
};
