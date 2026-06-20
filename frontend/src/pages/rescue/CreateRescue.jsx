import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import RescueForm from "../../components/rescue/RescueForm";

function CreateRescue() {
  return (
    <div>

      <Navbar />

      <section className="py-24 min-h-screen bg-[#F5F3EE]">

        <div className="max-w-2xl mx-auto px-6 lg:px-8 bg-white p-8 rounded-2xl shadow-lg">

          <h1 className="text-4xl font-bold text-[#355C46] mb-8">

            Report Animal Rescue

          </h1>

          <RescueForm />

        </div>

      </section>

      <Footer />

    </div>
  );
}

export default CreateRescue;
