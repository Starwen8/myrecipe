import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import { Result_Pre_Page } from './config.js';

//polyfill npm i core-js regenerator-runtime and import them
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import pageView from './views/pageView.js';

if (module.hot) {
  module.hot.accept();
}

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    //loading render
    recipeView.renderSpinner();
    // 0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);

    //load recipe from api
    await model.loadRecipe(id);

    // rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // recipeView.renderError();
  }
};

const controlSerachResult = async function () {
  try {
    resultsView.renderSpinner();
    //1) get search input
    const search = searchView.getQuery();
    if (!search) return;

    //2)load result
    await model.loadSearchResults(search);

    //3)render result
    resultsView.render(model.getSearchResultsPage());

    //4)sperate result to pages
    pageView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPage = function (pageDir) {
  //1)render result for new page
  resultsView.render(model.getSearchResultsPage(pageDir));

  //2)Render page button
  pageView.render(model.state.search);
  console.log(pageDir);
};

const controlServings = function (newServings) {
  //update recipe servings
  model.updateServing(newServings);

  // //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) add or remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2) update recipe view
  recipeView.update(model.state.recipe);

  //3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
//testing

// controlSerachResult();
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addhandlerSearch(controlSerachResult);
  pageView.addhandlerPageChange(controlPage);
};
init();

// controlRecipes();
// // load the recipes every time the poge is loaded or change to other recipe
// ['hashchange', 'load'].forEach(ev =>
//   window.addEventListener(ev, controlRecipes)
// );
