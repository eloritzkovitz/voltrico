package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

var db *sqlx.DB

// Main function to start the server
func main() {
	var err error
	db, err = ConnectDB()
	if err != nil {
		log.Fatalf("Failed to connect to DB: %v", err)
	}
	log.Println("Connected to PostgreSQL")

	// Create inventory table if it doesn't exist
	schema := `CREATE TABLE IF NOT EXISTS inventory (
        item_id TEXT PRIMARY KEY,
        stock INTEGER NOT NULL
    );`
	db.MustExec(schema)

	// Start RabbitMQ consumer
	StartRabbitMQConsumer(db)

	r := mux.NewRouter()
	r.HandleFunc("/api/inventory/{id}", getStock).Methods("GET")
	r.HandleFunc("/api/inventory/{id}", setStock).Methods("PUT")
	r.HandleFunc("/api/inventory/{id}/update", updateStock).Methods("POST")

	port := os.Getenv("PORT")
	if port == "" {
		port = "3004"
	}
	log.Printf("Inventory service running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
