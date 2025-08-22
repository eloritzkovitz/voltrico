import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";
import { DEFAULT_PRODUCT_IMAGE } from "@/constants/assets";
import { Product } from "@/types/product";
import "../styles/ProductCard.css";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  viewMode: "grid" | "list";
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, viewMode }) => {
  return (
    <div
      className={`shop-item bg-white rounded-lg shadow p-4 flex ${
        viewMode === "grid"
          ? "flex-col items-center"
          : "flex-row items-center gap-6"
      }`}
    >
      <Image
        src={product.imageURL || DEFAULT_PRODUCT_IMAGE}
        alt={product.name}
        width={viewMode === "grid" ? 128 : 96}
        height={viewMode === "grid" ? 128 : 96}
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

export default ProductCard;
