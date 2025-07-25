FROM golang:1.22
WORKDIR /app
COPY . .
RUN go mod tidy
RUN go build -o inventory-service main.go
CMD ["./inventory-service"]