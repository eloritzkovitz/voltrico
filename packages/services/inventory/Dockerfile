FROM golang:1.22-alpine AS builder
WORKDIR /app

# Copy go mod files and download dependencies
COPY packages/services/inventory/go.mod ./
COPY packages/services/inventory/go.sum ./
COPY packages/services/inventory/*.go ./
COPY packages/services/inventory/.golangci.yml ./
RUN go mod tidy

# Build the application
RUN go build -o inventory-service .

# Final stage
FROM alpine:3.20
WORKDIR /app

# Copy the built binary and .env file
COPY --from=builder /app/inventory-service .

CMD ["./inventory-service"]