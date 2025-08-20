import { FaShoppingCart } from "react-icons/fa";
import { Product } from "@/services/product-service";
import "../styles/ShopItem.css";

interface ShopItemProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  viewMode: "grid" | "list";
}

const ShopItem: React.FC<ShopItemProps> = ({ product, onAddToCart, viewMode }) => {
  return (
    <div
      className={`shop-item bg-white rounded-lg shadow p-4 flex ${
        viewMode === "grid"
          ? "flex-col items-center"
          : "flex-row items-center gap-6"
      }`}
    >
      <img
        src={product.img || "/images/placeholder_image.png"}
        alt={product.name}
        className={`${
          viewMode === "grid"
            ? "w-32 h-32 mb-4 object-cover rounded"
            : "w-24 h-24 object-cover rounded"
        }`}
      />
      <div className={viewMode === "grid" ? "text-center" : "flex-1"}>
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-1">Category: {product.category}</p>
        <p className="text-blue-700 font-bold mb-2">
          Price: ${product.price.toFixed(2)}
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          onClick={() => onAddToCart(product)}
        >
          <FaShoppingCart />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ShopItem;
