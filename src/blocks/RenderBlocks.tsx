import React, { Fragment } from "react";

import type { Page } from "@/payload-types";

import { ArchiveBlock } from "@/blocks/ArchiveBlock/Component";
import { CallToActionBlock } from "@/blocks/CallToAction/Component";
import { ContentBlock } from "@/blocks/Content/Component";
import { FormBlock } from "@/blocks/Form/Component";
import { MediaBlock } from "@/blocks/MediaBlock/Component";
import { AboutSection } from "@/blocks/AboutSection/Component";
import { FeaturesSection } from "@/blocks/FeaturesSection/Component";
import { PlatformLogos } from "@/blocks/PlatformLogos/Component";
import { TestimonialsBlock } from "@/blocks/TestimonialsBlock/Component";
import { CTASection } from "./CTASection/Component";
import { ServicesGridBlock } from "./ServicesGrid/Component";
import { AboutIntroBlock } from "@/blocks/AboutIntroBlock/Component";
import { VisitSectionBlock } from "@/blocks/VisitSection/Component";
import { IframeEmbedBlock } from "@/blocks/IframeEmbed/Component";

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  aboutSection: AboutSection,
  featuresSection: FeaturesSection,
  platformLogos: PlatformLogos,
  testimonialsBlock: TestimonialsBlock,
  ctaSection: CTASection,
  servicesGrid: ServicesGridBlock,
  aboutIntro: AboutIntroBlock,
  visitSection: VisitSectionBlock,
  iframeEmbed: IframeEmbedBlock,
};

export const RenderBlocks: React.FC<{
  blocks: Page["layout"][0][];
}> = (props) => {
  const { blocks } = props;

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block;

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType];

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  <Block {...block} disableInnerContainer />
                </div>
              );
            }
          }
          return null;
        })}
      </Fragment>
    );
  }

  return null;
};
