FROM golang:1.22
WORKDIR /app

COPY packages/services/inventory/go.mod ./
COPY packages/services/inventory/go.sum ./
COPY packages/services/inventory/*.go ./
COPY packages/services/inventory/.golangci.yml ./

RUN go mod tidy
RUN go build -o inventory-service .

CMD ["./inventory-service"]