import type { Block } from "payload";

export const CTASection: Block = {
  slug: "ctaSection",
  labels: {
    singular: "CTA Section",
    plural: "CTA Sections",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
      defaultValue: "We'd love to work with you.",
    },
    {
      name: "buttonLabel",
      type: "text",
      defaultValue: "Get in Touch",
    },
    {
      name: "buttonLink",
      type: "text",
      defaultValue: "/contact",
    },
  ],
};
