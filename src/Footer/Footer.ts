import type { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",

  admin: {
    group: "Globals",
  },

  fields: [
    {
      name: "navItems",
      type: "array",
      fields: [
        {
          name: "link",
          type: "group",
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
            },
            {
              name: "url",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
