import React, { useEffect, useState } from "react";
import itemService, { Item } from "../services/item-service";
import "../styles/MainPage.css";

const MainPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  return (
    <div className="page-container">
      <header>
        <div id="navbar"></div>
        <div id="authStatus"></div>
      </header>

      <main>
        <h1>Shop Items</h1>
        <div className="category-buttons">
          {[
            { category: "all", label: "All", icon: "icons/category-all.png" },
            { category: "TV", label: "TV", icon: "icons/category-tv.png" },
            { category: "Computers", label: "Computers", icon: "icons/category-computers.png" },
            { category: "Mobile", label: "Mobile", icon: "icons/category-mobile.png" },
            { category: "Appliances", label: "Appliances", icon: "icons/category-appliances.png" },
            { category: "Kitchen", label: "Kitchen", icon: "icons/category-kitchen.png" },
            { category: "Tools", label: "Tools", icon: "icons/category-tools.png" },
            { category: "Lighting", label: "Lighting", icon: "icons/category-lighting.png" },
          ].map((button) => (
            <button
              key={button.category}
              className="category-btn"
              onClick={() => handleCategoryClick(button.category)}
            >
              <img src={button.icon} alt={`${button.label} Icon`} /> {button.label}
            </button>
          ))}
        </div>

        <div className="shop-item-container" id="itemContainer">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {items.map((item) => (
            <div key={item._id} className="shop-item">
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>Category: {item.category}</p>
              <p>Price: ${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </main>     
    </div>
  );
};

export default MainPage;