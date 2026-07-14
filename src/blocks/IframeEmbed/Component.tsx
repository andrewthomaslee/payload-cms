import React from "react";

import type { IframeEmbedBlock as IframeEmbedBlockProps } from "@/payload-types";

export const IframeEmbedBlock: React.FC<IframeEmbedBlockProps> = ({
  heading,
  intro,
  iframeTitle,
  iframeUrl,
  height,
}) => {
  return (
    <section className="container my-16">
      <div className="mx-auto max-w-5xl">
        {(heading || intro) && (
          <div className="mb-8">
            {heading && <h2 className="mb-4 text-4xl font-medium text-black">{heading}</h2>}
            {intro && <p className="text-lg leading-relaxed text-black">{intro}</p>}
          </div>
        )}

        <iframe
          className="w-full border-0"
          height={height || 1200}
          loading="lazy"
          src={iframeUrl}
          title={iframeTitle}
        />
      </div>
    </section>
  );
};
