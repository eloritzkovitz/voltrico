package main

type InventoryItem struct {
	ItemID string `db:"item_id" json:"itemId"`
	Stock  int    `db:"stock" json:"stock"`
}
