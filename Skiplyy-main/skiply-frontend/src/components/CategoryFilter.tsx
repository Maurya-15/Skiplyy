import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUSINESS_CATEGORIES } from "@/lib/constants";
import { BusinessCategory } from "@/lib/types";
import { useApp } from "@/contexts/AppContext";

export function CategoryFilter() {
  const { selectedCategory, setSelectedCategory } = useApp();

  return (
    <Select
      value={selectedCategory}
      onValueChange={(value: BusinessCategory | "all") =>
        setSelectedCategory(value)
      }
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {BUSINESS_CATEGORIES.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            <div className="flex items-center space-x-2">
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
