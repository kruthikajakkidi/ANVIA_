function RescueStatusTracker({ currentStatus }) {
  const stages = [
    "PENDING",
    "IN_PROGRESS",
    "COMPLETED",
  ];
  const labels = {
    PENDING: "Reported",
    IN_PROGRESS: "Claimed",
    COMPLETED: "Completed",
  };

  const currentIndex = stages.indexOf(currentStatus);

  return (
    <div className="mt-10">

      <h3 className="text-xl font-semibold mb-6">
        Rescue Progress
      </h3>

      <div className="flex justify-between gap-4">

        {stages.map((stage, index) => (

          <div
            key={stage}
            className="flex flex-col items-center flex-1"
          >

            <div
              className={`
                w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                ${index <= currentIndex
                  ? "bg-green-600"
                  : "bg-gray-300"}
              `}
            >
              {index + 1}
            </div>

            <p className="mt-3 text-sm text-center">
              {labels[stage]}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default RescueStatusTracker;
