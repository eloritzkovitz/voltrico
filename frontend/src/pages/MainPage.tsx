import React, { useEffect, useState } from "react";
import itemService, { Item } from "../services/item-service";
import ShopItem from "../components/ShopItem";
import { useCart } from "../context/CartContext";
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
} from "@fortawesome/free-solid-svg-icons";
import "../styles/MainPage.css";

const MainPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { addToCart } = useCart();

  // Fetch all items on component mount
  useEffect(() => {
    itemService
      .getAllItems()
      .then((data) => setItems(data))
      .catch((error) => {
        console.error(error);
        setErrorMessage("Failed to fetch items. Please try again later.");
      });
  }, []);

  // Handle category button clicks
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    if (category === "all") {
      itemService
        .getAllItems()
        .then((data) => setItems(data))
        .catch((error) => {
          console.error(error);
          setErrorMessage("Failed to fetch items. Please try again later.");
        });
    } else {
      itemService
        .getItemsByCategory(category)
        .then((data) => setItems(data))
        .catch((error) => {
          console.error(error);
          setErrorMessage("Failed to fetch items by category. Please try again later.");
        });
    }
  };

  // Handle adding an item to the cart
  const handleAddToCart = (item: Item) => {
    if (!item._id) {
      console.error("Item ID is missing. Cannot add to cart.");
      return;
    }

    addToCart({ ...item, quantity: 1, _id: item._id });
  };

  return (
    <div className="page-container mt-5">
      <div className="category-buttons d-flex flex-wrap justify-content-center gap-3">
        {[
          { category: "all", label: "All", icon: faThLarge },
          { category: "TV", label: "TV", icon: faTv },
          { category: "Computers", label: "Computers", icon: faLaptop },
          { category: "Mobile", label: "Mobile", icon: faMobileAlt },
          { category: "Appliances", label: "Appliances", icon: faBlender },
          { category: "Kitchen", label: "Kitchen", icon: faUtensils },
          { category: "Tools", label: "Tools", icon: faTools },
          { category: "Lighting", label: "Lighting", icon: faLightbulb },
        ].map((button) => (
          <button
            key={button.category}
            className={`category-btn rounded-pill d-flex align-items-center gap-2 ${
              selectedCategory === button.category ? "active-category" : ""
            }`}
            onClick={() => handleCategoryClick(button.category)}
          >
            <FontAwesomeIcon icon={button.icon} className="category-icon" />
            {button.label}
          </button>
        ))}
      </div>

      <div className="shop-item-container mt-4" id="itemContainer">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {items.map((item) => (
          <ShopItem key={item._id} item={item} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
};

export default MainPage;