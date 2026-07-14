import React from "react";

type Props = {
  heading?: string;
  services?: {
    title: string;
    description: string;
  }[];
};

export const ServicesGridBlock: React.FC<Props> = ({
  heading,
  services,
}) => {
  return (
    <section className="sub-page-wrapper">
      <div className="mx-auto max-w-[1600px] px-8">
        <h2 className="mb-20 text-center text-[64px] theme-blue">
          {heading}
        </h2>

        <div className="grid grid-cols-1 gap-x-24 gap-y-28 md:grid-cols-3">
          {services?.map((service, index) => (
            <div key={index} className="text-center">
              <h3 className="mb-3 text-[24px] theme-blue">
                {service.title}
              </h3>

              <p className="mx-auto max-w-[420px] text-[18px] leading-[1.8] text-gray-700">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
