import React from "react";
import { Card, Form, Row, Col, Button, Spinner } from "react-bootstrap";
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

const ProfileCard: React.FC<ProfileCardProps> = ({ formData, loading, onInputChange, onSave }) => {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="mb-4">Profile Information</Card.Title>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Form>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaUser className="me-2" /> First Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={onInputChange}
                    className="rounded"
                    placeholder="Enter your first name"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaUser className="me-2" /> Last Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={onInputChange}
                    className="rounded"
                    placeholder="Enter your last name"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaEnvelope className="me-2" /> Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onInputChange}
                    className="rounded"
                    placeholder="Enter your email"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaPhone className="me-2" /> Phone
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={onInputChange}
                    className="rounded"
                    placeholder="Enter your phone number"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaMapMarkerAlt className="me-2" /> Address
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={onInputChange}
                    className="rounded"
                    placeholder="Enter your address"
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button variant="primary" onClick={onSave}>
                    <FaSave className="me-2" /> Save Changes
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProfileCard;