package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// Get stock for an item
func getStock(w http.ResponseWriter, r *http.Request) {
	itemId := mux.Vars(r)["id"]
	mutex.Lock()
	stock, exists := inventory[itemId]
	mutex.Unlock()
	if !exists {
		http.Error(w, "Item not found", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(map[string]int{"stock": stock})
}

// Set stock for an item
func setStock(w http.ResponseWriter, r *http.Request) {
	itemId := mux.Vars(r)["id"]
	var req struct {
		Stock int `json:"stock"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	mutex.Lock()
	inventory[itemId] = req.Stock
	mutex.Unlock()
	w.WriteHeader(http.StatusOK)
}

// Update stock for an item
func updateStock(w http.ResponseWriter, r *http.Request) {
	itemId := mux.Vars(r)["id"]
	changeStr := r.URL.Query().Get("change")
	change, err := strconv.Atoi(changeStr)
	if err != nil {
		http.Error(w, "Invalid change value", http.StatusBadRequest)
		return
	}
	mutex.Lock()
	inventory[itemId] += change
	mutex.Unlock()
	w.WriteHeader(http.StatusOK)
}
