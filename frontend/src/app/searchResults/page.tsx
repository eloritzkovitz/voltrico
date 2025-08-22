"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaTh, FaBars } from "react-icons/fa";
import ProductCard from "@/components/ProductCard";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";
import { useCart } from "@/context/CartContext";
import searchService from "@/services/search-service";
import { Product } from "@/types/product";

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<Product[]>([]);
  const [filteredItems, setFilteredItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { addToCart } = useCart();

  const query = searchParams[1] || "";

  // Fetch products based on the search query
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
  }, [query]);

  // Handle adding a product to the cart
  const handleAddToCart = (item: Product) => {
    if (!item._id) {
      console.error("Product ID is missing. Cannot add to cart.");
      return;
    }

    addToCart({ ...item, quantity: 1, _id: item._id });
  };

  // Handle sorting
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    setSortOption(option);

    const sortedItems = [...filteredItems];
    if (option === "price-asc") {
      sortedItems.sort((a, b) => a.price - b.price);
    } else if (option === "price-desc") {
      sortedItems.sort((a, b) => b.price - a.price);
    } else if (option === "name") {
      sortedItems.sort((a, b) => a.name.localeCompare(b.name));
    }
    setFilteredItems(sortedItems);
  };

  // Handle price range filtering
  const handlePriceRangeChange = () => {
    const filtered = items.filter(
      (item) => item.price >= minPrice && item.price <= maxPrice
    );
    setFilteredItems(filtered);
  };

  // Handle category filtering
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);

    if (category === "all") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) => item.category === category);
      setFilteredItems(filtered);
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      {query && (
        <h4 className="mb-4 text-xl font-semibold">
          Showing search results for:{" "}
          <span className="font-normal">{query}</span>
        </h4>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Side Menu */}
        <aside className="md:w-1/4">
          <div className="mb-8">
            <h5 className="font-semibold mb-2">Price Range</h5>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setMinPrice(value);
                  if (value > maxPrice) setMaxPrice(value);
                }}
                placeholder="Min"
                className="w-20 border border-gray-300 rounded px-2 py-1"
              />
              <span>-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= minPrice) setMaxPrice(value);
                }}
                placeholder="Max"
                className="w-20 border border-gray-300 rounded px-2 py-1"
              />
              <button
                onClick={handlePriceRangeChange}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
              >
                Apply
              </button>
            </div>
          </div>

          <div>
            <h5 className="font-semibold mb-2">Categories</h5>
            <div className="flex flex-col gap-2">
              {PRODUCT_CATEGORIES.map((button) => {
                const count =
                  button.category === "all"
                    ? items.length
                    : items.filter((item) => item.category === button.category)
                        .length;

                return (
                  <button
                    key={button.category}
                    className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                      selectedCategory === button.category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                    }`}
                    onClick={() => handleCategoryChange(button.category)}
                  >
                    <span className="text-lg">{button.icon}</span>
                    {button.label}{" "}
                    <span className="ml-auto text-xs">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Search Results */}
        <section className="md:w-3/4">
          {/* Sorting and View Mode Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full md:w-auto border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="price-asc">Sort by Price: Low to High</option>
              <option value="price-desc">Sort by Price: High to Low</option>
              <option value="name">Sort by Name</option>
            </select>
            <div className="flex gap-2">
              <button
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <FaTh />
              </button>
              <button
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                }`}
                onClick={() => setViewMode("list")}
              >
                <FaBars />
              </button>
            </div>
          </div>

          <main>
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <span className="animate-spin inline-block mr-2">&#9696;</span>
                Loading...
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">
                {error}
                <button
                  className="ml-2 text-blue-600 underline"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : filteredItems.length > 0 ? (
              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }`}
              >
                {filteredItems.map((item) => (
                  <div key={item._id} className="mb-4">
                    <ProductCard
                      product={item}
                      onAddToCart={handleAddToCart}
                      viewMode={viewMode}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No items found for your search.
              </div>
            )}
          </main>
        </section>
      </div>
    </div>
  );
};

export default SearchResults;
