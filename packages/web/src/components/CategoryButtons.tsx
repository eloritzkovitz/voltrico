import { PRODUCT_CATEGORIES } from "@/constants/productCategories";

interface CategoryButtonsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  items: { category: string }[];
}

const CategoryButtons: React.FC<CategoryButtonsProps> = ({
  selectedCategory,
  onCategoryChange,
  items,
}) => (
  <div className="flex flex-wrap justify-center gap-3 mb-6">
    {PRODUCT_CATEGORIES.map((button) => (
      <button
        key={button.category}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors
          ${
            selectedCategory === button.category
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-100"
          }`}
        onClick={() => onCategoryChange(button.category)}
      >
        <span className="text-lg">{button.icon}</span>
        {button.label}
      </button>
    ))}
  </div>
);

export default CategoryButtons;