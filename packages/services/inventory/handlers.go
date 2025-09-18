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
	var item InventoryItem
	err := db.Get(&item, "SELECT item_id, stock FROM inventory WHERE item_id=$1", itemId)
	if err != nil {
		http.Error(w, "Item not found", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(item)
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
	_, err := db.Exec("INSERT INTO inventory (item_id, stock) VALUES ($1, $2) ON CONFLICT (item_id) DO UPDATE SET stock=$2", itemId, req.Stock)
	if err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}
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
	_, err = db.Exec("UPDATE inventory SET stock = stock + $1 WHERE item_id = $2", change, itemId)
	if err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
