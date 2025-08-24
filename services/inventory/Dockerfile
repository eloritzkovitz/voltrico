FROM golang:1.22
WORKDIR /app

COPY services/inventory/go.mod ./
COPY services/inventory/go.sum ./
COPY services/inventory/*.go ./
COPY services/inventory/.golangci.yml ./

RUN go mod tidy
RUN go build -o inventory-service .

CMD ["./inventory-service"]