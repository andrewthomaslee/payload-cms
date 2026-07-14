import Link from "next/link";

export const PlatformLogos = ({ heading, logos }: any) => {
  return (
    <section className="py-24 plmobile">
      <div className="mx-auto max-w-[1700px] px-8">
        <h2 className="mb-16 text-center platlogohead">{heading}</h2>

        <div className="mx-auto grid max-w-[1400px] grid-cols-1 justify-items-center md:grid-cols-3">
          {logos?.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-center">
              {item.link ? (
                <Link href={item.link}>
                  <img
                    src={item.logo?.url}
                    alt=""
                    className="h-20  w-auto object-contain transition duration-300 hover:scale-105"
                  />
                </Link>
              ) : (
                <img
                  src={item.logo?.url}
                  alt=""
                  className="h-20 plimg w-auto object-contain"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
