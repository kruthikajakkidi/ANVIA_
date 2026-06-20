import { FaPaw } from "react-icons/fa";

const stories = [
  {
    name: "Bruno",
    outcome: "Recovered",
    description: "Rescued after a road accident and recovered after surgery.",
    image: "/images/bruno.jpg",
  },
  {
    name: "Luna",
    outcome: "Treated",
    description: "Found injured on the street and successfully treated by volunteers.",
    image: "/images/luna.jpg",
  },
  {
    name: "Max",
    outcome: "Adopted",
    description: "Abandoned as a puppy, rescued, and safely adopted into a loving home.",
    image: "/images/max.jpg",
  },
];

function SuccessStories() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">

      {/* Soft background accent */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#F5F3EE] blur-3xl opacity-70 pointer-events-none -translate-y-1/3 translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">

        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[#D89C1D] font-semibold uppercase tracking-wider text-sm">
            Real Outcomes
          </p>

          <h2 className="mt-3 text-4xl md:text-5xl font-bold text-[#355C46] leading-tight">
           Our Rescue Success Stories!
          </h2>

          <div className="mt-6 w-16 h-1.5 bg-[#D89C1D] rounded-full mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-14">
          {stories.map((story) => (
            <div
              key={story.name}
              className="group rounded-2xl overflow-hidden bg-white border border-[#D1CEC5] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-56 w-full bg-[#F5F3EE] flex items-center justify-center overflow-hidden">
                <img
                  src={story.image}
                  alt={story.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.classList.add("placeholder-fallback");
                  }}
                />

                {/* Outcome tag */}
                <span className="absolute top-4 left-4 bg-[#355C46] text-white text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full shadow-md">
                  {story.outcome}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F5F3EE] text-[#D89C1D] shrink-0">
                    <FaPaw size={14} />
                  </span>
                  <h3 className="font-bold text-xl text-[#355C46]">
                    {story.name}
                  </h3>
                </div>

                <p className="mt-4 text-gray-600 leading-7">
                  {story.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SuccessStories;