import React, { useState } from 'react';
import { User, Phone, MapPin, Calendar, Edit3, Save, X, ArrowLeft, Ruler, Droplets, Mountain } from 'lucide-react';
import { Farmer } from '../types/farmer';

interface FarmerProfileProps {
  farmer: Farmer;
  onUpdate: (farmer: Farmer) => void;
  onBack?: () => void;
}

export default function FarmerProfile({ farmer, onUpdate, onBack }: FarmerProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(farmer);
  const [farmDetails, setFarmDetails] = useState({
    location: '',
    gpsCoordinates: '',
    landSize: '',
    soilType: '',
    irrigationMethod: '',
    crops: ''
  });
  const [showFarmSetup, setShowFarmSetup] = useState(false);

  const handleLocationCapture = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFarmDetails(prev => ({
            ...prev,
            gpsCoordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
        },
        (error) => {
          alert('Unable to get location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const generateActivityOutline = () => {
    // Generate basic activity tracking outline based on farm details
    const outline = {
      sowing: 'Based on your crop selection and location',
      irrigation: `${farmDetails.irrigationMethod} irrigation schedule`,
      fertilizer: `Fertilizer schedule for ${farmDetails.soilType} soil`,
      pestControl: 'Pest monitoring and control timeline',
      harvest: 'Expected harvest timeline'
    };
    
    alert(`Activity outline generated! This would create a customized farming calendar based on your:
    - Location: ${farmDetails.location}
    - Land size: ${farmDetails.landSize} acres
    - Soil type: ${farmDetails.soilType}
    - Crops: ${farmDetails.crops}
    - Irrigation: ${farmDetails.irrigationMethod}`);
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(farmer);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-8 relative overflow-hidden">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="text-white">
              <h3 className="text-xl font-semibold">{farmer.name}</h3>
              <p className="text-green-100">Registered Farmer</p>
              <div className="flex items-center space-x-1 mt-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  Member since {new Date(farmer.registrationDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Village
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Full Name</div>
                    <div className="font-medium text-gray-900">{farmer.name}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Phone Number</div>
                    <div className="font-medium text-gray-900">{farmer.phone}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Village</div>
                    <div className="font-medium text-gray-900">{farmer.village}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">District</div>
                    <div className="font-medium text-gray-900">{farmer.district}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Completion */}
        <div className="px-6 pb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">Profile Completion</span>
              <span className="text-sm font-bold text-green-800">100%</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full w-full transition-all duration-300"></div>
            </div>
            <p className="text-xs text-green-700 mt-2">
              Your profile is complete! This helps us provide better recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Farm Details Setup */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Farm Details</h3>
          <button
            onClick={() => setShowFarmSetup(!showFarmSetup)}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            {showFarmSetup ? 'Hide' : 'Setup Farm'}
          </button>
        </div>

        {showFarmSetup && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (Village/Area)
                </label>
                <input
                  type="text"
                  value={farmDetails.location}
                  onChange={(e) => setFarmDetails({ ...farmDetails, location: e.target.value })}
                  placeholder="Enter your farm location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GPS Coordinates
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={farmDetails.gpsCoordinates}
                    onChange={(e) => setFarmDetails({ ...farmDetails, gpsCoordinates: e.target.value })}
                    placeholder="Latitude, Longitude"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleLocationCapture}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Ruler className="inline h-4 w-4 mr-1" />
                  Land Size (acres)
                </label>
                <input
                  type="number"
                  value={farmDetails.landSize}
                  onChange={(e) => setFarmDetails({ ...farmDetails, landSize: e.target.value })}
                  placeholder="Enter land size"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mountain className="inline h-4 w-4 mr-1" />
                  Soil Type
                </label>
                <select
                  value={farmDetails.soilType}
                  onChange={(e) => setFarmDetails({ ...farmDetails, soilType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select soil type</option>
                  <option value="clay">Clay Soil</option>
                  <option value="sandy">Sandy Soil</option>
                  <option value="loamy">Loamy Soil</option>
                  <option value="red">Red Soil</option>
                  <option value="black">Black Soil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Droplets className="inline h-4 w-4 mr-1" />
                  Irrigation Method
                </label>
                <select
                  value={farmDetails.irrigationMethod}
                  onChange={(e) => setFarmDetails({ ...farmDetails, irrigationMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select irrigation method</option>
                  <option value="rain-fed">Rain-fed</option>
                  <option value="bore-well">Bore Well</option>
                  <option value="canal">Canal</option>
                  <option value="drip">Drip Irrigation</option>
                  <option value="sprinkler">Sprinkler</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Details
                </label>
                <input
                  type="text"
                  value={farmDetails.crops}
                  onChange={(e) => setFarmDetails({ ...farmDetails, crops: e.target.value })}
                  placeholder="e.g., Rice, Coconut, Pepper"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={generateActivityOutline}
                disabled={!farmDetails.location || !farmDetails.landSize || !farmDetails.crops}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Generate Activity Outline
              </button>
              <button
                onClick={() => setShowFarmSetup(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Save Farm Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}