import { Link } from "react-router-dom";
import { getUploadUrl } from "../../services/api";

function RescueCard({ _id, animalImage, address, status, description, latitude, longitude }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
      <img src={getUploadUrl(animalImage)} alt="Rescue case" className="h-56 w-full object-cover" />

      <div className="p-5">
        <div className="flex justify-between gap-4">
          <h3 className="text-xl font-semibold text-[#355C46]">Rescue Case</h3>
          <span className="text-orange-500 font-medium">{status}</span>
        </div>

        <p className="mt-3 text-gray-600 line-clamp-3 whitespace-pre-line">{description}</p>
        <p className="mt-3 text-gray-600">{address}</p>
        <p className="mt-2 text-sm text-gray-500">Geo-tag: {latitude}, {longitude}</p>

        <Link to={`/rescues/${_id}`}>
          <button className="w-full mt-5 bg-[#355C46] text-white py-3 rounded-xl">View Rescue</button>
        </Link>
      </div>
    </div>
  );
}

export default RescueCard;
