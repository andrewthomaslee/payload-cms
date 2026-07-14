import type { CollectionConfig } from "payload";

import { authenticated } from "../../access/authenticated";
import { authenticatedOrPublished } from "../../access/authenticatedOrPublished";

import { Archive } from "../../blocks/ArchiveBlock/config";
import { CallToAction } from "../../blocks/CallToAction/config";
import { Content } from "../../blocks/Content/config";
import { FormBlock } from "../../blocks/Form/config";
import { MediaBlock } from "../../blocks/MediaBlock/config";
import { AboutSection } from "../../blocks/AboutSection/config";
import { FeaturesSection } from "@/blocks/FeaturesSection/config";
import { hero } from "@/heros/config";
import { slugField } from "payload";
import { populatePublishedAt } from "../../hooks/populatePublishedAt";
import { generatePreviewPath } from "../../utilities/generatePreviewPath";
import { revalidateDelete, revalidatePage } from "./hooks/revalidatePage";
import { PlatformLogos } from "@/blocks/PlatformLogos/config";
import { TestimonialsBlock } from "@/blocks/TestimonialsBlock/config";
import { CTASection } from "@/blocks/CTASection/config";
import { ServicesGrid } from "../../blocks/ServicesGrid/config";
import { AboutIntroBlock } from "@/blocks/AboutIntroBlock/config";
import { VisitSection } from "@/blocks/VisitSection/config";
import { IframeEmbed } from "@/blocks/IframeEmbed/config";

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";

export const Pages: CollectionConfig<"pages"> = {
  slug: "pages",
  defaultSort: "-createdAt",

  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },

  defaultPopulate: {
    title: true,
    slug: true,
  },

  admin: {
    defaultColumns: ["title", "slug", "updatedAt"],

    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: "pages",
          req,
        }),
    },

    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: "pages",
        req,
      }),

    useAsTitle: "title",
  },

  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },

    {
      type: "tabs",

      tabs: [
        {
          label: "Hero",
          fields: [hero],
        },

        {
          label: "Content",

          fields: [
            {
              name: "layout",
              type: "blocks",

              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                AboutSection,
                FeaturesSection,
                PlatformLogos,
                TestimonialsBlock,
                CTASection,
                ServicesGrid,
                AboutIntroBlock,
                VisitSection,
                IframeEmbed,
              ],

              required: true,

              admin: {
                initCollapsed: true,
              },
            },
          ],
        },

        {
          name: "meta",
          label: "SEO",

          fields: [
            OverviewField({
              titlePath: "meta.title",
              descriptionPath: "meta.description",
              imagePath: "meta.image",
            }),

            MetaTitleField({
              hasGenerateFn: true,
            }),

            MetaImageField({
              relationTo: "media",
            }),

            MetaDescriptionField({}),

            PreviewField({
              hasGenerateFn: true,
              titlePath: "meta.title",
              descriptionPath: "meta.description",
            }),
          ],
        },
      ],
    },

    {
      name: "publishedAt",
      type: "date",

      admin: {
        position: "sidebar",
      },
    },

    slugField(),
  ],

  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
  },

  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },

      schedulePublish: true,
    },

    maxPerDoc: 50,
  },
};
