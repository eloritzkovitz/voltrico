import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave } from "react-icons/fa";

interface ProfileCardProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  formData,
  loading,
  onInputChange,
  onSave,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-500">Loading...</span>
        </div>
      ) : (
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  <FaUser className="inline-block mr-2" /> First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={onInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500"
                  placeholder="Enter your first name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  <FaUser className="inline-block mr-2" /> Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={onInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500"
                  placeholder="Enter your last name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  <FaEnvelope className="inline-block mr-2" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  <FaPhone className="inline-block mr-2" /> Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={onInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  <FaMapMarkerAlt className="inline-block mr-2" /> Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={onInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500"
                  placeholder="Enter your address"
                />
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={onSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  <FaSave />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileCard;