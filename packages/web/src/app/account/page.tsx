"use client";
import { useState, useEffect } from "react";
import { FaUser, FaWallet } from "react-icons/fa";
import OrdersCard from "@/components/OrdersCard";
import ProfileCard from "@/components/ProfileCard";
import { DEFAULT_PRODUCT_IMAGE } from "@/constants/assets";
import orderService from "@/services/order-service";
import userService from "@/services/user-service";
import type { IUser as User } from "@shared/interfaces/IUser";

const Account: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [activeTab, setActiveTab] = useState<"account" | "orders">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoadingUser(true);
      try {
        const userData = await userService.getUserData();
        setUser(userData);
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address:
            typeof userData.addresses?.[0] === "string"
              ? userData.addresses[0]
              : userData.addresses?.[0]?.street || "",
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrderHistory();
    }
  }, [activeTab]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle saving profile changes
  const handleSaveProfile = async () => {
    if (!user?._id) {
      console.error("User ID is missing.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "address") {
          // Send as addresses array
          formDataToSend.append("addresses", JSON.stringify([value]));
        } else if (value) {
          formDataToSend.append(key, value);
        }
      });
      const updatedUser = await userService.updateUser(formDataToSend);
      console.log("User updated successfully:", updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Fetch order history
  const fetchOrderHistory = async () => {
    setLoadingOrders(true);
    try {
      const data = await orderService.getOrderHistory();
      // Ensure the data is in the correct format
      const formattedOrders = data.map((order: any) => ({
        id: order._id, // Unique ID for the order
        name: order.item?.name || "No name available",
        description: order.item?.description || "No description available",
        date: order.date || new Date().toISOString(),
        price: order.item?.price || 0,
        image: order.item?.imageURL || DEFAULT_PRODUCT_IMAGE,
      }));
      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching order history:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <h4 className="mb-6 text-xl font-semibold">My Account</h4>
          <nav className="flex flex-col gap-2">
            <button
              className={`flex items-center px-4 py-2 rounded transition-colors ${
                activeTab === "account"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-100"
              }`}
              onClick={() => setActiveTab("account")}
            >
              <FaUser className="mr-2" /> Personal Information
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded transition-colors ${
                activeTab === "orders"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-100"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <FaWallet className="mr-2" /> My Orders
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          {activeTab === "account" && (
            <ProfileCard
              formData={formData}
              loading={loadingUser}
              onInputChange={handleInputChange}
              onSave={handleSaveProfile}
            />
          )}
          {activeTab === "orders" && (
            <OrdersCard orders={orders} loading={loadingOrders} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
