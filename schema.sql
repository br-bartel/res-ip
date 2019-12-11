CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  title TEXT,
  url TEXT,
  ingredients TEXT
);

INSERT INTO recipes (title, url, ingredients) VALUES ('Vegetable-Pasta Oven Omelet', 'http://find.myrecipes.com/recipes/recipefinder.dyn?action=displayRecipe&recipe_id=520763', 'tomato, onions, red pepper, garlic, olive oil, zucchini, cream cheese, pasta, eggs, italian seasoning, salt, black pepper');
