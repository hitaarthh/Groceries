const OffersPanel = () => {
    return (
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm mb-6 md:mb-8">
        <h2 className="text-xl font-semibold mb-3 md:mb-4">Current Offers</h2>
        <div className="flex flex-col md:flex-row gap-3">
            <div className="flex items-center gap-3 bg-green-50 p-3 md:p-4 rounded-lg flex-1">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">6+1</span>
                </div>
                <p className="text-gray-700">Buy 6 cans of Coca-Cola, get one free!</p>
            </div>
            <div className="flex items-center gap-3 bg-green-50 p-3 md:p-4 rounded-lg flex-1">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">3+1</span>
                </div>
                <p className="text-gray-700">Buy 3 croissants, get a free coffee!</p>
            </div>
        </div>
    </div>
    );
  };
  
  export default OffersPanel;