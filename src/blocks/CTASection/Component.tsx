import Link from "next/link";

export const CTASection = ({
  heading,
  buttonLabel,
  buttonLink,
}: {
  heading: string;
  buttonLabel: string;
  buttonLink: string;
}) => {
  return (
    <section className="py-24 text-center ctawrapper">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-6xl font-medium text-black">{heading}</h2>

        <Link href={buttonLink} className="inline-block btn-blue">
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
};
