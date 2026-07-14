import Link from "next/link";
import { Media } from "@/components/Media";

type Props = {
  features: any[];
  buttonText?: string;
  buttonLink?: string;
};

export const FeaturesSection: React.FC<Props> = ({
  features,
  buttonText,
  buttonLink,
}) => {
  return (
    <section className="py-24 fsmobile">
      <div className="mx-auto max-w-[1600px] px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {features?.map((item, index) => (
            <div key={index} className="text-center">
              <div className="mb-3 flex justify-center">
                {item.icon && (
                  <Media
                    resource={item.icon}
                    imgClassName="h-34 object-contain"
                  />
                )}
              </div>

              <h3 className="mb-6 text-3xl ">{item.title}</h3>

              <p className="mx-auto max-w-md text-xl leading-10">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link href={buttonLink || "#"} className="inline-block btn-green">
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
};
