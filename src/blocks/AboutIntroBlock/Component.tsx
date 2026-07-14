import React from "react";

import type { Media } from "@/payload-types";

type Props = {
  sectionTitle?: string;
  cardTitle?: string;
  cardText?: string;
  image?: Media | string | null;
};

export const AboutIntroBlock: React.FC<Props> = ({
  sectionTitle,
  cardTitle,
  cardText,
  image,
}) => {
  const imageUrl = typeof image === "object" && image ? image.url : null;

  return (
    <section className="aboutIntroSection">
      <div className="aboutIntroContainer">
        {sectionTitle ? <h2 className="aboutIntroHeading">{sectionTitle}</h2> : null}

        <div className="aboutIntroWrapper">
          {imageUrl ? (
            <div className="aboutIntroImageWrap">
              <img src={imageUrl} alt={cardTitle || ""} className="aboutIntroImage" />
            </div>
          ) : null}

          <div className="aboutIntroCard">
            {cardTitle ? <h3>{cardTitle}</h3> : null}
            {cardText ? <p>{cardText}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
};
