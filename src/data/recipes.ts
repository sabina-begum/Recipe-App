// src/data/recipes.ts
export interface FeaturedRecipe {
    id: string;
    name: string;
    description: string;
    image: string;
    rating: number;
    tags: string[];
  }
  
  export const featuredRecipes: FeaturedRecipe[] = [
    {
      id: "truffle-risotto",
      name: "Truffle Risotto",
      description:
        "Creamy Arborio rice with wild mushrooms and shaved black truffle, finished with Parmigiano-Reggiano.",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      tags: ["Chef's Pick", "30–40 min"],
    },
    // add 3–7 more real recipes here
  ];