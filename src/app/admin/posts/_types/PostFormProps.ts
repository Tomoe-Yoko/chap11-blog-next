import { Category } from "@/app/_types/Category";

export interface PostFormProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  thumbnailUrl: string;
  setThumbnailUrl: React.Dispatch<React.SetStateAction<string>>;
  categories: Category[];
  selectedCategories: Category[];
  handleSelectCategory: (category: Category) => void;
  handlePostSubmit: (e: React.FormEvent) => void;
  handleDeletePost?: () => void;
  mode: "new" | "edit";
}
