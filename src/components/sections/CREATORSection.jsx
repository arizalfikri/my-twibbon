import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";
import { Autoplay, FreeMode } from "swiper/modules";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const CreatorSection = () => {
  const creators = [
    {
      id: 1,
      name: "Sarah Johnson",
      photo: "https://i.pravatar.cc/300?img=1",
      event: "Art Book Fair",
      year: "2024",
    },
    {
      id: 2,
      name: "Michael Chen",
      photo: "https://i.pravatar.cc/300?img=2",
      event: "Art Book Fair",
      year: "2024",
    },
    {
      id: 3,
      name: "Emma Wilson",
      photo: "https://i.pravatar.cc/300?img=3",
      event: "Art Book Fair",
      year: "2024",
    },
    {
      id: 4,
      name: "David Martinez",
      photo: "https://i.pravatar.cc/300?img=4",
      event: "Art Book Fair",
      year: "2024",
    },
    {
      id: 5,
      name: "Olivia Brown",
      photo: "https://i.pravatar.cc/300?img=5",
      event: "Art Book Fair",
      year: "2024",
    },
    {
      id: 6,
      name: "James Taylor",
      photo: "https://i.pravatar.cc/300?img=6",
      event: "Art Book Fair",
      year: "2024",
    },
    {
      id: 7,
      name: "Sophia Anderson",
      photo: "https://i.pravatar.cc/300?img=7",
      event: "Art Book Fair",
      year: "2024",
    },
    {
      id: 8,
      name: "Daniel Lee",
      photo: "https://i.pravatar.cc/300?img=8",
      event: "Art Book Fair",
      year: "2024",
    },
    {
      id: 9,
      name: "Isabella White",
      photo: "https://i.pravatar.cc/300?img=9",
      event: "Art Book Fair",
      year: "2024",
    },
    {
      id: 10,
      name: "Ryan Garcia",
      photo: "https://i.pravatar.cc/300?img=10",
      event: "Art Book Fair",
      year: "2024",
    },
  ];

  return (
    <section
      className={
        "py-20 overflow-hidden dark:bg-[#0f172a] transition-colors duration-300 font-creator"
      }
    >
      <div className="container relative p-24 px-4 mx-auto bg-gray-900 rounded-2xl">
        <div className="hidden absolute top-0 bottom-0 left-0 z-20 w-28 pointer-events-none md:block">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-transparent rounded-2xl opacity-90"></div>
        </div>

        <div className="hidden absolute top-0 right-0 bottom-0 z-20 w-28 pointer-events-none md:block">
          <div className="absolute inset-0 bg-gradient-to-l from-gray-800 to-transparent rounded-2xl opacity-90"></div>
        </div>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium tracking-wider text-white uppercase rounded-full border-2 border-primary-500 dark:border-primary-300 dark:text-primary-200">
            <Sparkles className="mr-2 w-4 h-4" />
            MyTwibbon FOR CREATORS
          </div>

          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            <span className="relative px-4 text-primary-300 lg:text-8xl fleur-de-leah-regular">
              gather
            </span>

            <span className="ml-3 text-gray-200">your</span>
            <br />
            <span className="text-gray-200">supporters with</span>
            <br />
            <span className="text-primary-300">MyTwibbon</span>
          </h2>

          <div className="flex gap-4 justify-center items-center mt-8">
            <Link to={"/create/frame"}>
              <button className="px-8 py-3 font-semibold text-white rounded-full border-2 transition-all border-primary-300 hover:bg-primary-500">
                Try it now, Free!
              </button>
            </Link>
          </div>
        </div>

        {/* Creator Cards Slider */}
        <div className="relative mt-16">
          <Swiper
            modules={[Autoplay]}
            slidesPerView="auto"
            spaceBetween={20}
            loop={true}
            grabCursor={false}
            allowTouchMove={false}
            cssMode={false}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            speed={8000}
            style={{
              "--swiper-wrapper-transition-timing-function": "linear",
              willChange: "transform",
              transformStyle: "preserve-3d",
            }}
            className="!overflow-visible smooth-swiper"
          >
            {[...creators, ...creators].map((creator, index) => (
              <SwiperSlide key={index} className="!w-auto">
                <div className="relative w-32 md:w-52 aspect-square group">
                  {/* Twibbon Frame - Fast Version */}
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <div
                      className="
      relative w-full h-full overflow-hidden rounded-xl border-[3px]
      bg-white/20 dark:bg-gray-900/20 
      border-white dark:border-gray-700 shadow
    "
                    >
                      {/* Top Bar */}
                      {/* <div className="flex absolute top-0 right-0 left-0 items-center px-2 h-6 bg-primary-400/90 dark:bg-primary-500/90">
                        <span className="text-[9px] text-white truncate">
                          {creator.title || "Event"}
                        </span>
                      </div> */}

                      {/* Bottom Bar */}
                      <div className="absolute right-0 bottom-0 left-0 px-2 py-1 bg-white/85 dark:bg-gray-900/85">
                        <p className="text-[9px] font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {creator.event || "Nama Event"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Creator Photo */}
                  <div className="overflow-hidden w-full h-full rounded-2xl">
                    <img
                      loading="lazy"
                      src={creator.photo}
                      alt={creator.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Soft gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t via-transparent rounded-2xl from-black/10 to-black/10"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default CreatorSection;
