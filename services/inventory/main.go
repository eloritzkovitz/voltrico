package main

import (
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/gorilla/mux"
)

var (
	inventory = make(map[string]int)
	mutex     = &sync.Mutex{}
)

// Main function to start the server
func main() {
	StartRabbitMQConsumer(inventory, mutex)
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
