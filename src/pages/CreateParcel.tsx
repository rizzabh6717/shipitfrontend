import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps-api';
import { Package, MapPin, DollarSign, Calendar, Truck } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 19.0760,
  lng: 72.8777,
};

interface ParcelData {
  fromAddress: string;
  toAddress: string;
  itemDescription: string;
  itemValue: number;
  size: 'small' | 'medium' | 'large';
  weight: number;
  pickupDate: string;
  pickupTime: string;
  specialInstructions: string;
}

const CreateParcel: React.FC = () => {
  const [step, setStep] = useState(1);
  const [parcelData, setParcelData] = useState<ParcelData>({
    fromAddress: '',
    toAddress: '',
    itemDescription: '',
    itemValue: 0,
    size: 'medium',
    weight: 0,
    pickupDate: '',
    pickupTime: '',
    specialInstructions: ''
  });

  const [estimatedFee, setEstimatedFee] = useState(0);

  const sizeOptions = [
    { value: 'small', label: 'Small', description: 'Up to 30cm x 30cm x 30cm', basePrice: 80 },
    { value: 'medium', label: 'Medium', description: 'Up to 60cm x 60cm x 60cm', basePrice: 200 },
    { value: 'large', label: 'Large', description: 'Up to 120cm x 120cm x 120cm', basePrice: 400 }
  ];

  const calculateFee = () => {
    const sizeMultiplier = sizeOptions.find(s => s.value === parcelData.size)?.basePrice || 200;
    const weightMultiplier = Math.max(1, parcelData.weight * 0.5);
    const valueMultiplier = Math.max(1, parcelData.itemValue * 0.001);
    const estimated = sizeMultiplier * weightMultiplier * valueMultiplier;
    setEstimatedFee(Math.round(estimated));
  };

  React.useEffect(() => {
    calculateFee();
  }, [parcelData.size, parcelData.weight, parcelData.itemValue]);

  const handleInputChange = (field: keyof ParcelData, value: string | number) => {
    setParcelData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    // Here you would integrate with your smart contract
    console.log('Creating parcel with data:', parcelData);
    console.log('Estimated fee:', estimatedFee);
    // Simulate MetaMask transaction
    alert(`Parcel created! Escrow amount: ₹${estimatedFee}`);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Pickup & Delivery Locations</h2>
              <p className="text-gray-400">Enter the pickup and delivery addresses</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="h-4 w-4 inline mr-2 text-green-400" />
                  Pickup Address
                </label>
                <input
                  type="text"
                  value={parcelData.fromAddress}
                  onChange={(e) => handleInputChange('fromAddress', e.target.value)}
                  placeholder="Enter pickup address (e.g., Mumbai, Maharashtra)"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="h-4 w-4 inline mr-2 text-red-400" />
                  Delivery Address
                </label>
                <input
                  type="text"
                  value={parcelData.toAddress}
                  onChange={(e) => handleInputChange('toAddress', e.target.value)}
                  placeholder="Enter delivery address (e.g., Pune, Maharashtra)"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-gray-700 rounded-lg h-64 border border-gray-600 overflow-hidden">
              <LoadScript googleMapsApiKey={process.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={defaultCenter}
                  zoom={10}
                  options={{
                    styles: [
                      {
                        featureType: 'all',
                        elementType: 'geometry.fill',
                        stylers: [{ color: '#1f2937' }],
                      },
                    ],
                  }}
                >
                  {parcelData.fromAddress && (
                    <Marker
                      position={defaultCenter}
                      icon={{
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="15" cy="15" r="12" fill="#10B981" stroke="#059669" stroke-width="2"/>
                            <text x="15" y="19" text-anchor="middle" fill="white" font-size="12" font-weight="bold">P</text>
                          </svg>
                        `),
                        scaledSize: new google.maps.Size(30, 30),
                      }}
                    />
                  )}
                  {parcelData.toAddress && (
                    <Marker
                      position={{ lat: defaultCenter.lat + 0.01, lng: defaultCenter.lng + 0.01 }}
                      icon={{
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="15" cy="15" r="12" fill="#EF4444" stroke="#DC2626" stroke-width="2"/>
                            <text x="15" y="19" text-anchor="middle" fill="white" font-size="12" font-weight="bold">D</text>
                          </svg>
                        `),
                        scaledSize: new google.maps.Size(30, 30),
                      }}
                    />
                  )}
                </GoogleMap>
              </LoadScript>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Package Details</h2>
              <p className="text-gray-400">Describe your package and its specifications</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Item Description</label>
                <input
                  type="text"
                  value={parcelData.itemDescription}
                  onChange={(e) => handleInputChange('itemDescription', e.target.value)}
                  placeholder="What are you shipping? (e.g., Electronics, Documents, Clothes)"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Item Value (₹)</label>
                  <input
                    type="number"
                    value={parcelData.itemValue}
                    onChange={(e) => handleInputChange('itemValue', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    value={parcelData.weight}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                    placeholder="0.0"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Package Size</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sizeOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => handleInputChange('size', option.value)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        parcelData.size === option.value
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-center">
                        <Package className={`h-8 w-8 mx-auto mb-2 ${
                          parcelData.size === option.value ? 'text-blue-400' : 'text-gray-400'
                        }`} />
                        <h3 className="font-semibold text-white">{option.label}</h3>
                        <p className="text-xs text-gray-400 mt-1">{option.description}</p>
                        <p className="text-sm text-green-400 mt-2">Base: ₹{option.basePrice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Schedule & Instructions</h2>
              <p className="text-gray-400">When should we pick up your package?</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2 text-blue-400" />
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={parcelData.pickupDate}
                    onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pickup Time</label>
                  <select
                    value={parcelData.pickupTime}
                    onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select time window</option>
                    <option value="morning">Morning (8AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 5PM)</option>
                    <option value="evening">Evening (5PM - 8PM)</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Special Instructions</label>
                <textarea
                  value={parcelData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  placeholder="Any special handling instructions, access codes, or notes for the driver..."
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Review & Confirm</h2>
              <p className="text-gray-400">Review your parcel details and confirm the delivery</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Parcel Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Item:</span>
                  <span className="text-white">{parcelData.itemDescription}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">From:</span>
                  <span className="text-white">{parcelData.fromAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">To:</span>
                  <span className="text-white">{parcelData.toAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Size:</span>
                  <span className="text-white capitalize">{parcelData.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Weight:</span>
                  <span className="text-white">{parcelData.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Value:</span>
                  <span className="text-white">₹{parcelData.itemValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pickup:</span>
                  <span className="text-white">{parcelData.pickupDate} - {parcelData.pickupTime}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg p-6 border border-green-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-400" />
                    Estimated Delivery Fee
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">This amount will be held in escrow</p>
                </div>
                <div className="text-3xl font-bold text-green-400">₹{estimatedFee}</div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h4 className="font-semibold text-white mb-2">How it works:</h4>
              <ol className="text-sm text-gray-400 space-y-1">
                <li>1. Your payment is held securely in a smart contract</li>
                <li>2. A driver will accept and pick up your parcel</li>
                <li>3. You'll receive real-time tracking updates</li>
                <li>4. Confirm delivery to release payment to the driver</li>
              </ol>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">Create New Parcel</h1>
            <div className="text-sm text-gray-400">Step {step} of 4</div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              step === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            Previous
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Truck className="h-5 w-5" />
              <span>Create Parcel & Pay Escrow</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateParcel;