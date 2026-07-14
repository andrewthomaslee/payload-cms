import type { Block } from "payload";

export const IframeEmbed: Block = {
  slug: "iframeEmbed",
  interfaceName: "IframeEmbedBlock",
  labels: {
    singular: "Iframe Embed",
    plural: "Iframe Embeds",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      defaultValue: "Careers",
    },
    {
      name: "intro",
      type: "textarea",
    },
    {
      name: "iframeUrl",
      type: "text",
      required: true,
      admin: {
        description: "Full URL for the embedded third-party iframe.",
      },
    },
    {
      name: "iframeTitle",
      type: "text",
      required: true,
      defaultValue: "Embedded form",
    },
    {
      name: "height",
      type: "number",
      required: true,
      defaultValue: 1200,
      min: 300,
    },
  ],
};
