import React from "react";
import { Button } from "react-bootstrap";
import { Item } from "../services/item-service";

interface ShopItemProps {
  item: Item;
  onAddToCart: (item: Item) => void;
}

const ShopItem: React.FC<ShopItemProps> = ({ item, onAddToCart }) => {
  return (
    <div className="shop-item">
      <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} />
      <h3>{item.name}</h3>
      <p>Category: {item.category}</p>
      <p>Price: ${item.price.toFixed(2)}</p>
      <Button variant="primary" onClick={() => onAddToCart(item)}>
        Add to Cart
      </Button>
    </div>
  );
};

export default ShopItem;