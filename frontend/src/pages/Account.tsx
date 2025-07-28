import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { FaUser, FaWallet } from "react-icons/fa";
import userService, { User } from "../services/user-service";
import orderService from "../services/order-service";
import ProfileCard from "../components/ProfileCard";
import OrdersCard from "../components/OrdersCard";
import "../styles/Account.css";

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
          address: userData.address || "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user?._id) {
      console.error("User ID is missing.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(key, value);
        }
      });
      const updatedUser = await userService.updateUser(       
        formDataToSend
      );
      console.log("User updated successfully:", updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

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
        image: order.item?.image || "/images/placeholder_image.png",
      }));
      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching order history:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={3}>
          <h4 className="mb-4">My Account</h4>
          <Nav className="flex-column">
            <Nav.Link
              className={`menu-item ${
                activeTab === "account" ? "active-tab" : ""
              }`}
              onClick={() => setActiveTab("account")}
            >
              <FaUser className="me-2" /> Personal Information
            </Nav.Link>
            <Nav.Link
              className={`menu-item ${
                activeTab === "orders" ? "active-tab" : ""
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <FaWallet className="me-2" /> My Orders
            </Nav.Link>
          </Nav>
        </Col>

        <Col md={9}>
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
        </Col>
      </Row>
    </Container>
  );
};

export default Account;
