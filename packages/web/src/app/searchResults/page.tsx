"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CategoryButtons from "@/components/CategoryButtons";
import ProductList from "@/components/ProductList";
import { useProductList } from "@/hooks/useProductList";
import searchService from "@/services/search-service";
import { Product } from "@/types/product";

const SearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);  

  // Use the hook for product list management
  const {
    selectedCategory,
    filteredItems,
    setFilteredItems,    
    handleAddToCart,
    handleCategoryChange,
  } = useProductList(items);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await searchService.searchProducts(query);
        setItems(results);
        setFilteredItems(results);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setItems([]);
      setFilteredItems([]);
      setLoading(false);
    }
  }, [query, setFilteredItems]);

  return (
    <div className="container mx-auto mt-8 px-4">
      {query && (
        <h4 className="mb-4 text-xl font-semibold">
          Showing search results for:{" "}
          <span className="font-normal">{query}</span>
        </h4>
      )}
      <CategoryButtons
        selectedCategory={selectedCategory}
        onCategoryChange={(category) => handleCategoryChange(category, items)}
        items={items}
      />
      {loading ? (
        <div className="text-center py-8 text-gray-500">
          <span className="animate-spin inline-block mr-2">&#9696;</span>
          Loading...
        </div>
      ) : (
        <ProductList
          products={filteredItems ?? []}
          onAddToCart={handleAddToCart}
          viewMode="grid"
          errorMessage={error}
        />
      )}
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
