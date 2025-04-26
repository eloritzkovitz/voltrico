import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import itemService, { Item } from "../services/item-service";

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
                <Card>
                  <Card.Img
                    variant="top"
                    src={item.image || "https://via.placeholder.com/150"}
                    alt={item.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                    <Card.Text>
                      <strong>Price:</strong> ${item.price.toFixed(2)}
                    </Card.Text>
                    <Button variant="primary">View Details</Button>
                  </Card.Body>
                </Card>
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