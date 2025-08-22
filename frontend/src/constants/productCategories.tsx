import {
  FaThLarge,
  FaTv,
  FaLaptop,
  FaMobileAlt,
  FaBlender,
  FaUtensils,
  FaTools,
  FaLightbulb,
} from "react-icons/fa";

// List of product categories
export const PRODUCT_CATEGORIES = [
  { category: "All", label: "All", icon: <FaThLarge /> },
  { category: "TV", label: "TV", icon: <FaTv /> },
  { category: "Computers", label: "Computers", icon: <FaLaptop /> },
  { category: "Mobile", label: "Mobile", icon: <FaMobileAlt /> },
  { category: "Appliances", label: "Appliances", icon: <FaBlender /> },
  { category: "Kitchen", label: "Kitchen", icon: <FaUtensils /> },
  { category: "Tools", label: "Tools", icon: <FaTools /> },
  { category: "Lighting", label: "Lighting", icon: <FaLightbulb /> },
];

// List of product category names (excluding "All")
export const PRODUCT_CATEGORIES_NAMES = PRODUCT_CATEGORIES
  .filter(cat => cat.category !== "All")
  .map(cat => cat.category);