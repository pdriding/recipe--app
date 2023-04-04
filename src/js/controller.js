import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import shoppingCartView from './views/shoppingCartView.js';
import calendarView from './views/calendarView.js';

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept;
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // 0.) Update results view to mark selected results
    resultsView.update(model.getSearchResultsPage());

    // 1.) Updating bookmarksView
    bookmarksView.update(model.state.bookmarks);

    // 2.) Loading recipe
    await model.loadRecipe(id);

    // 3.) Get Recipe Nutrition
    await model.getRecipeNutrition();

    // 3.) Rendering the recipe
    recipeView.render(model.state.recipe, true);
    recipeView.mealOptionsHandler(controlCalander);
    // recipeView._generateNutritionInfo(model.nutritionInfo);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1.) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2.) Load search results
    await model.loadSearchResults(query);

    // 3.) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4.) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// controlSearchResults();

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);

const controlPagination = function (goToPage) {
  // 1.) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2.) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update recipe servings in the state
  model.updateServings(newServings);
  // Update the recipe View
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

//------------RECIPE-------------

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading Spinner
    addRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render Bookmark View
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    // (state, title)
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    // console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

//-----------BOOKMARKS-------------

const controlAddBookmark = function () {
  // 1.) Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2.) Update recipe view
  recipeView.update(model.state.recipe);

  //3.) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

//------SHOPPING CART------------

const controlAddToCart = function () {
  model.addToCart(model.state.recipe.ingredients);

  // Render Ingredients to shopping cart
  shoppingCartView.render(model.state.shoppingIng);

  // Add delete button
  shoppingCartView.addDeleteButton(controlDeleteIngredient);

  // Render Message
  shoppingCartView.renderAddedMessage();
  shoppingCartView.toggleWindow();

  // Close message
  setTimeout(function () {
    shoppingCartView.toggleWindow();
  }, MODAL_CLOSE_SEC * 1000);

  console.log('hello');
};

const controlAddIngredient = async function () {
  addRecipeView.adder(model.state.recipe);
};

const controlDeleteIngredient = function (ing) {
  model.deleteIngredient(ing);

  // Render Ingredients to shopping cart
  shoppingCartView.render(model.state.shoppingIng);

  // Add delete button
  shoppingCartView.addDeleteButton(controlDeleteIngredient);
};

const controlCart = function () {
  shoppingCartView.render(model.state.shoppingIng);

  // Add delete button
  shoppingCartView.addDeleteButton(controlDeleteIngredient);
};

//-------------CALENDAR---------------

const controlCalander = function (meal, recipe) {
  // Recipe to calendar data
  const mealPlanMeal = model.mealData(meal, recipe);

  // Open calendar popup
  calendarView.calendar.openFormPopup(mealPlanMeal);

  // Show calendar
  calendarView.toggleWindow();
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  shoppingCartView.addHandlerRender(controlCart);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  recipeView.addHandlerShoppingCart(controlAddToCart);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  addRecipeView.addHandlerNewIng(controlAddIngredient);
};
init();
