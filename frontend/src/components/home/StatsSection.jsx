function StatsSection() {
  return (
    <section className="bg-[#355C46] py-5 text-white">

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 text-center">

        <div>
          <h2 className="text-4xl font-bold">
            420+
          </h2>

          <p className="mt-3">
            Animals Rescued
          </p>
        </div>

        <div>
          <h2 className="text-4xl font-bold">
            150+
          </h2>

          <p className="mt-3">
            Volunteers
          </p>
        </div>

        <div>
          <h2 className="text-4xl font-bold">
            85+
          </h2>

          <p className="mt-3">
            Medical Cases
          </p>
        </div>

        <div>
          <h2 className="text-4xl font-bold">
            8
          </h2>

          <p className="mt-3">
            Cities Covered
          </p>
        </div>

      </div>

    </section>
  );
}

export default StatsSection;