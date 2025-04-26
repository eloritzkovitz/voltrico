import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import itemService, { Item } from "../services/item-service";
import ShopItem from "../components/ShopItem";

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  const query = searchParams.get("query") || "";

  // Fetch items based on the search query
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await itemService.getItemsByQuery(query);
        setItems(results);
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
      setLoading(false);
    }
  }, [query]);

  // Handle adding an item to the cart
  const handleAddToCart = (item: Item) => {
    if (!item._id) {
      console.error("Item ID is missing. Cannot add to cart.");
      return;
    }

    addToCart({ ...item, quantity: 1, _id: item._id });
  };

  return (
    <Container className="mt-4">
      <header className="mb-4">
        <h1 className="text-center">Search Results</h1>
        {query && <p className="text-center">Results for: "{query}"</p>}
      </header>

      <main>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : items.length > 0 ? (
          <Row>
            {items.map((item) => (
              <Col key={item._id} md={4} className="mb-4">
                <ShopItem item={item} onAddToCart={handleAddToCart} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center">No items found for your search.</div>
        )}
      </main>
    </Container>
  );
};

export default SearchResults;
