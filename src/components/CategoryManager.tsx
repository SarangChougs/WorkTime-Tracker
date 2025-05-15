"use client";

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Category } from '@/types/timetracker';
import { PlusCircle, Tag } from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onAddCategory: (categoryName: string) => void;
  disabled?: boolean;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
  disabled = false,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;
    onAddCategory(newCategoryName.trim());
    setNewCategoryName('');
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="category-select" className="flex items-center mb-2">
          <Tag className="mr-2 h-4 w-4" />
          Select Category
        </Label>
        <Select
          value={selectedCategory || ''}
          onValueChange={(value) => onSelectCategory(value === '' ? null : value)}
          disabled={disabled}
        >
          <SelectTrigger id="category-select" className="w-full">
            <SelectValue placeholder="Choose a category..." />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
            {categories.length === 0 && (
              <SelectItem value="no-categories" disabled>
                No categories yet. Add one below.
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end space-x-2">
        <div className="flex-grow">
          <Label htmlFor="new-category" className="flex items-center mb-2">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Category
          </Label>
          <Input
            id="new-category"
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="E.g., Project X, Meeting"
            disabled={disabled}
          />
        </div>
        <Button onClick={handleAddCategory} disabled={disabled || newCategoryName.trim() === ''} variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
    </div>
  );
};

export default CategoryManager;
