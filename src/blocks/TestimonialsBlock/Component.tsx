"use client";

import { useState } from "react";

export const TestimonialsBlock = ({ title, testimonials }: any) => {
  const [current, setCurrent] = useState(0);

  const visibleCards =
    typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 3;

  const canGoLeft = current > 0;
  const canGoRight = current < testimonials.length - visibleCards;

  return (
    <section className="relative overflow-hidden py-32 tbwrapper">
      {/* Green Curve Background */}

      <div className="green-section">
        <div className="bottom-bg"></div>
        <div className="middle-content">
          <div className="relative z-10 mx-auto max-w-[1700px] px-8 ">
            <h2 className="mb-20 text-center text-5xl font-light text-white">
              {title}
            </h2>

            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${current * (100 / visibleCards)}%)`,
                }}
              >
                {testimonials.map((item: any, index: number) => (
                  <div key={index} className="w-full md:w-1/3 shrink-0 px-4">
                    <div className="h-full bg-white p-8 shadow-sm tcard">
                      <div className="text-center">
                        <img
                          src={item.photo?.url}
                          alt={item.name}
                          className="mx-auto mb-8"
                        />

                        <p className="mb-8 text-lg leading-8 ">{item.text}</p>

                        <h4 className="text-2xl font-semibold">{item.name}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Left Arrow */}
              {canGoLeft && (
                <button
                  onClick={() => setCurrent(current - 1)}
                  className="absolute left-0 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full btnt-blue text-3xl shadow-lg"
                >
                  ←
                </button>
              )}

              {/* Right Arrow */}
              {canGoRight && (
                <button
                  onClick={() => setCurrent(current + 1)}
                  className="absolute right-0 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full btnt-blue text-3xl shadow-lg"
                >
                  →
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="top-bg"></div>
      </div>
    </section>
  );
};
