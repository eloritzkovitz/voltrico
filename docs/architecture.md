# Architecture Overview

This document provides a high-level overview of the Voltrico application's architecture, design patterns, and major components.


## Architectural Pattern

Voltrico follows a **microservices architecture** with a clear separation of concerns and independent deployment for each service:

- **API Gateway:** Central entry point for all client requests, responsible for routing, aggregation, and authentication.
- **Microservices:** Each core domain (User, Product, Order, Inventory, Search) is implemented as an independent service.
- **Event-Driven Communication:** Services communicate asynchronously via RabbitMQ for decoupling and scalability.
- **Polyglot Persistence:** Each service uses the database best suited to its needs (MongoDB, PostgreSQL, Elasticsearch).
- **Shared Libraries:** Contains reusable code (models, middleware, utilities) to ensure consistency and reduce duplication across microservices.


## Main Layers & Responsibilities

| Layer                 | Responsibilities                                                                                  |
|-----------------------|---------------------------------------------------------------------------------------------------|
| **Frontend**          | User-facing web application that interacts with the API Gateway. and admins.                      |
| **API Gateway**       | Routes client requests, handles authentication, proxies to microservices, and aggregates results. |
| **Shared Libraries**  | Common TypeScript interfaces, utilities, middleware, and shared logic used across services.       |
| **User Service**      | User registration, authentication, profile management, and user data storage.                     |
| **Product Service**   | Product catalog management, CRUD operations, and product data storage.                            |
| **Order Service**     | Order creation, management, and order history.                                                    |
| **Inventory Service** | Stock management, inventory updates, and synchronization with product/orders.                     |
| **Search Service**    | Full-text search, filtering, and aggregation for products and orders using Elasticsearch.         |
| **RabbitMQ**          | Message broker for asynchronous event-driven communication between services.                      |
| **Database**          | MongoDB (users/products), PostgreSQL (orders/inventory), Elasticsearch (search).                  |

## Data Flow

1. **Client interacts with the API Gateway** via RESTful endpoints.
2. **API Gateway** routes requests to the appropriate microservice (e.g., Product, Order).
3. **Microservices** perform business logic and interact with their own databases.
4. **Services emit events** (e.g., product created, order placed) to RabbitMQ.
5. **Other services (e.g., Search)** consume events and update their own state or indexes.
6. **Search Service** provides advanced search/filter endpoints, aggregating data from multiple domains.
7. **API Gateway** can aggregate or proxy responses back to the client.

## Third-party Integrations

- **RabbitMQ:** Asynchronous messaging and event-driven workflows.
- **Elasticsearch:** High-performance search and analytics for products and orders.
- **MongoDB:** NoSQL storage for user and product data.
- **PostgreSQL:** Relational storage for orders and inventory.
- **Swagger:** API documentation for all services.

## State Management

- **Each microservice manages its own state** and database.
- **Eventual consistency** is achieved via event-driven updates and periodic reindexing (for search).
- **API Gateway** does not store business data, only handles routing and aggregation.

## Deployment & Scalability
- **Docker Compose** orchestrates all services, databases, RabbitMQ, and Elasticsearch.
- **Each service is independently** deployable and scalable based on load.
- **Environment variables** are used for configuration and service discovery.