import React from "react";
import { Button } from "react-bootstrap";
import { Product } from "../services/product-service";
import "../styles/ShopItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

interface ShopItemProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ShopItem: React.FC<ShopItemProps> = ({ product, onAddToCart }) => {
  return (
    <div className="shop-item">
      <img
        src={product.img || "/images/placeholder_image.png"}
        alt={product.name}
      />
      <h3>{product.name}</h3>
      <p>Category: {product.category}</p>
      <p>Price: ${product.price.toFixed(2)}</p>
      <Button variant="primary" onClick={() => onAddToCart(product)}>
        <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
        Add to Cart
      </Button>
    </div>
  );
};

export default ShopItem;
