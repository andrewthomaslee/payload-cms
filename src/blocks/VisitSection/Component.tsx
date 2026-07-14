import React from "react";
import RichText from "@/components/RichText";

type Props = {
  title: string;
  content: any;
  mapEmbedUrl: string;
  mapHeight?: number;
};

export const VisitSectionBlock: React.FC<Props> = ({
  title,
  content,
  mapEmbedUrl,
  mapHeight = 500,
}) => {
  return (
    <section className="">
      {/* Top Content */}
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-12 text-6xl font-light text-sky-500">{title}</h2>

        <div className="visit-content">
          <RichText data={content} />
        </div>
      </div>

      {/* Google Map */}
      {mapEmbedUrl && (
        <div className="mapmar">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height={mapHeight}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="border-0"
          />
        </div>
      )}
    </section>
  );
};
