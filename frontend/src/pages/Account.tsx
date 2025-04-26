import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { FaUser, FaWallet } from "react-icons/fa";
import userService, { User } from "../services/user-service";
import orderService from "../services/order-service";
import ProfileCard from "../components/ProfileCard";
import OrdersCard from "../components/OrdersCard";
import "../styles/Account.css"; // Import custom styles

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
  const [orders, setorders] = useState<any[]>([]);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [loadingorders, setLoadingorders] = useState<boolean>(false);

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
      fetchorderHistory();
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
      const updatedUser = await userService.updateUser(user._id, formDataToSend);
      console.log("User updated successfully:", updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const fetchorderHistory = async () => {
    setLoadingorders(true);
    try {
      const data = await orderService.getOrderHistory();
      setorders(data);
    } catch (error) {
      console.error("Error fetching order history:", error);
    } finally {
      setLoadingorders(false);
    }
  };

  return (
    <Container className="mt-4">
      <header className="mb-4">
        <h1 className="text-center">My Account</h1>
      </header>

      <main>
        <Row>
          <Col md={3}>
            <Nav className="flex-column">
              <Nav.Link
                className={`menu-item ${activeTab === "account" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("account")}
              >
                <FaUser className="me-2" /> Personal Information
              </Nav.Link>
              <Nav.Link
                className={`menu-item ${activeTab === "orders" ? "active-tab" : ""}`}
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
              <OrdersCard orders={orders} loading={loadingorders} />
            )}
          </Col>
        </Row>
      </main>
    </Container>
  );
};

export default Account;