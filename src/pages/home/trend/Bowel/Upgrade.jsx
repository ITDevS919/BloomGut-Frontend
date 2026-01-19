const Upgrade = () => {
  return (
    <div className="">
      {/* upgrade card */}
      <div className="bg-amber-50 rounded-xl p-5 text-center shadow-sm mt-5">
        <div className="text-sm text-left text-gray-500 mb-2">
          In-depth Analysis
        </div>
        <div className="text-lg mb-2">Upgrade to Unlock</div>
        <div className="text-xs text-gray-500 mb-4">
          See bowel–health link & get tips
        </div>
        <button className="bg-amber-500 text-white px-6 py-2 rounded-full shadow-md">
          Upgrade Now
        </button>
        <div className="flex justify-between text-xs text-secondary mt-4">
          <div>Free</div>
          <div>Premium Exclusive</div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
