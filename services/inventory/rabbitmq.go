package main

import (
	"encoding/json"
	"log"
	"os"

	"github.com/jmoiron/sqlx"
	amqp "github.com/rabbitmq/amqp091-go"
)

// Expects inventory and mutex to be defined in main.go
func StartRabbitMQConsumer(db *sqlx.DB) {
	rabbitURL := os.Getenv("RABBITMQ_URL")
	if rabbitURL == "" {
		rabbitURL = "amqp://rabbitmq"
	}
	conn, err := amqp.Dial(rabbitURL)
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}
	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Failed to open a channel: %v", err)
	}
	queueName := "ORDER_CREATED"
	_, err = ch.QueueDeclare(
		queueName, true, false, false, false, nil,
	)
	if err != nil {
		log.Fatalf("Failed to declare queue: %v", err)
	}
	msgs, err := ch.Consume(
		queueName, "", true, false, false, false, nil,
	)
	if err != nil {
		log.Fatalf("Failed to register consumer: %v", err)
	}

	go func() {
		for d := range msgs {
			var order struct {
				ItemID   string `json:"itemId"`
				Quantity int    `json:"quantity"`
			}
			if err := json.Unmarshal(d.Body, &order); err != nil {
				log.Printf("Failed to parse order message: %v", err)
				continue
			}
			_, err := db.Exec("UPDATE inventory SET stock = stock - $1 WHERE item_id = $2", order.Quantity, order.ItemID)
			if err != nil {
				log.Printf("Failed to update inventory for item %s: %v", order.ItemID, err)
			} else {
				log.Printf("Inventory updated for item %s: -%d", order.ItemID, order.Quantity)
			}
		}
	}()
}
