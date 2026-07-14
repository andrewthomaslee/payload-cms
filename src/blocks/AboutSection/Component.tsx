import Link from "next/link";
import RichText from "@/components/RichText";

type Props = {
  content: any;
  buttonText?: string;
  buttonLink?: string;
  video?: any;
};

export const AboutSection: React.FC<Props> = ({
  content,
  buttonText,
  buttonLink,
  video,
}) => {
  return (
    <section className="py-24 mbody">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:flex-row lg:items-center lg:gap-20">
        <div className="flex-1 text-center">
          <RichText className="ashero" data={content} />

          <Link
            href={buttonLink || "#"}
            className="mt-10 inline-block btn-green"
          >
            {buttonText}
          </Link>
        </div>

        <div className="flex-1">
          {video?.url && (
            <video
              className="w-full rounded-xl"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={video.url} type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </section>
  );
};
