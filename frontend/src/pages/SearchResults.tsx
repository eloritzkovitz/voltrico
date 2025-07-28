import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThLarge,
  faTv,
  faLaptop,
  faMobileAlt,
  faBlender,
  faUtensils,
  faTools,
  faLightbulb,
  faTh,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../context/CartContext";
import itemService, { Product } from "../services/product-service";
import ShopItem from "../components/ShopItem";

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

  const query = searchParams.get("query") || "";

  // Fetch items based on the search query
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await itemService.getProductsByQuery(query);
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
    <Container className="mt-4">
      {query && <h4 className="mb-4">Showing search results for: {query}</h4>}

      <Row>
        {/* Side Menu */}
        <Col md={3}>
          <div className="side-menu">
            {/* Price Range Selector */}
            <h5>Price Range</h5>
            <div className="price-range d-flex align-items-center gap-2 mb-4">
              <Form.Control
                type="number"
                value={minPrice}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setMinPrice(value);
                  // Ensure maxPrice is not less than minPrice
                  if (value > maxPrice) {
                    setMaxPrice(value);
                  }
                }}
                placeholder="Min"
                className="w-50"
              />
              <span>-</span>
              <Form.Control
                type="number"
                value={maxPrice}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  // Ensure minPrice is not greater than maxPrice
                  if (value >= minPrice) {
                    setMaxPrice(value);
                  }
                }}
                placeholder="Max"
                className="w-50"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handlePriceRangeChange}
              >
                Apply
              </Button>
            </div>

            {/* Categories */}
            <h5>Categories</h5>
            <div className="d-flex flex-column gap-2">
              {[
                { category: "all", label: "All", icon: faThLarge },
                { category: "TV", label: "TV", icon: faTv },
                { category: "Computers", label: "Computers", icon: faLaptop },
                { category: "Mobile", label: "Mobile", icon: faMobileAlt },
                {
                  category: "Appliances",
                  label: "Appliances",
                  icon: faBlender,
                },
                { category: "Kitchen", label: "Kitchen", icon: faUtensils },
                { category: "Tools", label: "Tools", icon: faTools },
                { category: "Lighting", label: "Lighting", icon: faLightbulb },
              ].map((button) => {
                // Calculate the count of items in each category
                const count =
                  button.category === "all"
                    ? items.length
                    : items.filter((item) => item.category === button.category)
                        .length;

                return (
                  <button
                    key={button.category}
                    className={`category-btn d-flex align-items-center gap-2 ${
                      selectedCategory === button.category
                        ? "active-category"
                        : ""
                    }`}
                    onClick={() => handleCategoryChange(button.category)}
                  >
                    <FontAwesomeIcon
                      icon={button.icon}
                      className="category-icon"
                    />
                    {button.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </Col>

        {/* Search Results */}
        <Col md={9}>
          {/* Sorting and View Mode Controls */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Form.Select
              value={sortOption}
              onChange={handleSortChange}
              className="w-auto"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="price-asc">Sort by Price: Low to High</option>
              <option value="price-desc">Sort by Price: High to Low</option>
              <option value="name">Sort by Name</option>
            </Form.Select>
            <div className="card d-flex flex-row align-items-center">
              <Button
                variant="link"
                className={`view-toggle-btn ${
                  viewMode === "grid" ? "active" : ""
                }`}
                onClick={() => setViewMode("grid")}
              >
                <FontAwesomeIcon icon={faTh} />
              </Button>
              <Button
                variant="link"
                className={`view-toggle-btn ${
                  viewMode === "list" ? "active" : ""
                }`}
                onClick={() => setViewMode("list")}
              >
                <FontAwesomeIcon icon={faBars} />
              </Button>
            </div>
          </div>

          <main>
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : error ? (
              <div className="text-center text-danger">
                {error}
                <Button variant="link" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            ) : filteredItems.length > 0 ? (
              <Row
                className={`${
                  viewMode === "grid" ? "g-3" : "flex-column"
                } justify-content-center`}
              >
                {filteredItems.map((item) => (
                  <Col
                    key={item._id}
                    md={viewMode === "grid" ? 4 : 12}
                    className="mb-4"
                  >
                    <ShopItem product={item} onAddToCart={handleAddToCart} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center">No items found for your search.</div>
            )}
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchResults;
