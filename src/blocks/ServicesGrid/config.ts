import type { Block } from "payload";

export const ServicesGrid: Block = {
  slug: "servicesGrid",
  labels: {
    singular: "Services Grid",
    plural: "Services Grids",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      defaultValue: "Our Services",
    },
    {
      name: "services",
      type: "array",
      minRows: 1,
      fields: [
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
  ],
};
