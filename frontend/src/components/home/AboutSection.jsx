function AboutSection() {
  return (
    <section id="about" className="py-28 bg-white scroll-mt-24 relative overflow-hidden">

      {/* Soft background accent */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#F5F3EE] blur-3xl opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-center relative">

        {/* IMAGE */}
        <div className="relative">
          <div className="absolute -inset-3 border-2 border-[#D89C1D] rounded-3xl rotate-2" />
          <img
            src="/images/about-animal.png"
            alt="Rescued animal cared for by ANVIA volunteers"
            className="relative rounded-3xl shadow-2xl w-full h-26rem object-cover"
          />

          {/* Signature badge */}
          <div className="absolute -bottom-6 -right-6 bg-[#355C46] text-white rounded-2xl shadow-xl px-6 py-4 max-w-176px">
            <p className="text-3xl font-bold leading-none">24/7</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-[#D89C1D] font-semibold">
              Rescue Response
            </p>
          </div>
        </div>

        {/* TEXT */}
        <div>
          <p className="text-[#D89C1D] font-semibold uppercase tracking-wider text-sm">
            Our Story
          </p>

          <h2 className="mt-3 text-4xl md:text-5xl font-bold text-[#355C46] leading-tight">
            Who We Are
          </h2>

          <div className="mt-6 w-16 h-1.5 bg-[#D89C1D] rounded-full" />

          <p className="mt-6 text-gray-600 leading-8 text-lg">
            ANVIA is a community-driven animal rescue platform connecting
            citizens, volunteers and donors to help stray and injured
            animals receive quick support.
          </p>

          <p className="mt-4 text-gray-600 leading-8 text-lg">
            Our mission is to use technology to make animal rescue faster,
            more organized and accessible — turning every bystander into
            a first responder.
          </p>

          
        </div>

      </div>

    </section>
  );
}

export default AboutSection;