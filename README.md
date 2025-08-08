# Voltrico

Voltrico is a microservices-based e-commerce platform. Users can browse and search for products, add them to their cart, place orders, and view their order history. Administrators have access to advanced management features, including product and order management as well as analytics.

## Features

### **Authentication**
- **User Registration & Login:** Register and log in using your email and password.
- **Google Login:** Sign in with your Google account.
- **JWT-based Authentication:** Secure authentication with access and refresh tokens.
- **Session Management:** The app uses cookies to maintain user sessions.

### **Account**
- **Personal Information:** Customize your profile and edit your details.
- **Order History:** View all posts created by the user.
- **Admin Panel:** Administrators can view and manage items, orders and statistics.

### **Shop**
- **Browse Items:** Browse the store and find your desired items, grouped into to various categories.
- **Search and Filter Options:** Tailor your search according to your needs. 
- **Cart:** Add and review items in the cart before making a purchase.

## **Technologies Used**

### **Backend**
- **Node.js & Express.js** - Scalable backend framework.
- **Go** - High-performance inventory microservice.
- **MongoDB** - NoSQL database for user and product data.
- **PostgreSQL** - Relational database for orders and inventory.
- **Elasticsearch** - Distributed search and analytics engine for the search service.
- **RabbitMQ** - Asynchronous messaging between services.
- **JWT** - Secure user authentication.
- **Swagger** - API documentation.

### **Frontend**
- **React.js** - Modern UI library for dynamic user interfaces.
- **Bootstrap** - Responsive styling for sleek design.

## Documentation

- [Architecture Overview](docs/architecture.md)

## **Development & Deployment**

- **Docker Compose** is used to orchestrate all services, databases, Elasticsearch and RabbitMQ.
- Each service has its own Dockerfile and can be scaled independently.
- Environment variables are used for configuration.

---

**To run locally:**
1. Clone the repository.
2. Run `docker compose up --build` from the project root.
3. Access the API Gateway at [http://localhost:3000](http://localhost:3000).

---
