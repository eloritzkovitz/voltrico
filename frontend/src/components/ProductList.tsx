import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  viewMode?: "grid" | "list";
  errorMessage?: string | null;
}

const ProductList: React.FC<ProductListProps> = ({
  products = [],
  onAddToCart,
  viewMode = "grid",
  errorMessage,
}) => (
  <div
    className={
      viewMode === "grid"
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4"
        : "flex flex-col gap-4 mt-4"
    }
  >
    {errorMessage && (
      <p className="col-span-full text-center text-red-600 font-medium">
        {errorMessage}
      </p>
    )}
    {products.length === 0 ? (
      <div className="col-span-full text-center text-gray-500 py-8">
        No products available at the moment.
      </div>
    ) : (
      products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onAddToCart={onAddToCart}
          viewMode={viewMode}
        />
      ))
    )}
  </div>
);

export default ProductList;