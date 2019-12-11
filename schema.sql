CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  title TEXT,
  image_url TEXT,
  ingredients TEXT
);

INSERT INTO recipes (title, image_url, ingredients) VALUES ('Vegetable-Pasta Oven Omelet', 'http://find.myrecipes.com/recipes/recipefinder.dyn?action=displayRecipe&recipe_id=520763', 'tomato, onions, red pepper, garlic, olive oil, zucchini, cream cheese, vermicelli, eggs, parmesan cheese, milk, italian seasoning, salt, black pepper');