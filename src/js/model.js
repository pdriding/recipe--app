import { API_URL, RES_PER_PAGE, KEY, SPOON_KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
  shoppingIng: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

const createNutritionObject = function (data) {
  const mapping = {
    calories: 'calories',
    fat: 'fat',
    carbohydrates: 'carbohydrates',
    protein: 'protein',
  };

  data.nutrition.nutrients.forEach(nut => {
    const servings = state.recipe.servings;
    const key = mapping[nut.name.toLowerCase()];
    if (key) {
      mapping[key] = (nut.amount / servings).toFixed(0);
    }
  });
  return mapping;
};

export const getRecipeNutrition = async function () {
  try {
    const recipeURL = state.recipe.sourceUrl;

    const recipeData = await AJAX(
      `https://api.spoonacular.com/recipes/extract?apiKey=${SPOON_KEY}&url=${recipeURL}&includeNutrition=true`
    );
    console.log(recipeData);
    state.recipe.servings = recipeData.servings;
    state.recipe.nutrition = createNutritionObject(recipeData);
  } catch (err) {
    console.error(err);
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (
      (ing.quantity * newServings) /
      state.recipe.servings
    ).toFixed(1);
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const persistShoppingCart = function () {
  localStorage.setItem('shoppingCart', JSON.stringify(state.shoppingIng));
};

export const addBookmark = function (recipe) {
  console.log(recipe);
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

export const addToCart = function (ingredients) {
  for (const ing of ingredients) state.shoppingIng.push(ing);

  persistShoppingCart();
};

export const deleteIngredient = function (ingredient) {
  const index = state.shoppingIng.findIndex(
    el => el.description === ingredient
  );
  state.shoppingIng.splice(index, 1);
  persistShoppingCart();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
  const storage2 = localStorage.getItem('shoppingCart');
  if (storage2) state.shoppingIng = JSON.parse(storage2);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  console.log(newRecipe);
  try {
    const ing = Object.entries(newRecipe).filter(
      entry => entry[0].startsWith('ingredient') && entry[1] !== ''
    );

    const ingredients = [];

    for (let i = 0; i < ing.length / 3; i++) {
      const [quantity, unit, description] = ing
        .filter(el => el[0].startsWith(`ingredient-${i + 1}-`))
        .map(el => el[1]);
      ingredients.push({ quantity, unit, description });
    }

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const mealData = function (meal, recipe) {
  const completeMeal = {
    calendarId: `${meal}`,
    title: `${recipe.title}`,
    category: 'task',
    start: new Date(),
    end: new Date(),
  };
  return completeMeal;
};

console.log('hello');

//-------------PRACTISE-------------------

// First, assume that the event is created as shown below..
// calendar.createEvents([
//   {
//     id: 'event1',
//     calendarId: 'cal1',
//     title: 'Weekly Meeting',
//     start: '2022-05-30T09:00:00',
//     end: '2022-05-30T10:00:00',
//   },
// ]);

// calendar.deleteEvent('event1', 'cal1');

// // If you try to find the event, it does not exist.
// const deletedEvent = calendar.getEvent('event1', 'cal1');
// console.log(deletedEvent); // null

//-----------------createNutritionObject------------
// nutritionInfo.servings = recipeData.servings > 0 ? recipeData.servings : 1;

// recipeData.nutrition.nutrients.map(nut => {
//   if (nut.name.toLowerCase() === 'calories') {
//     nutritionInfo.calories = nut.amount; // nutritionInfo.servings;
//   }
//   if (nut.name.toLowerCase() === 'fat') {
//     nutritionInfo.fat = nut.amount; // nutritionInfo.servings;
//   }
//   if (nut.name.toLowerCase() === 'carbohydrates') {
//     nutritionInfo.carbs = nut.amount; // nutritionInfo.servings;
//   }
//   if (nut.name.toLowerCase() === 'protein') {
//     nutritionInfo.protein = nut.amount; // nutritionInfo.servings;
//   }
// });

//-------------------uploadRecipe----------------
// for (let i = 0; i < david.length / 3; i++) {
//   let ingredients11 = {};
//   david.map((el, value) => {
//     if (el[0] === `ingredient-${i + 1}-quantity`) {
//       ingredients11.quantity = el[1];
//     }
//     if (el[0] === `ingredient-${i + 1}-unit`) {
//       ingredients11.unit = el[1];
//     }
//     if (el[0] === `ingredient-${i + 1}-description`) {
//       ingredients11.description = el[1];
//     }
//   });
//   ingredients.push(ingredients11);
// }
