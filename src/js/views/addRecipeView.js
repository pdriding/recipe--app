import View from './View';
import icons from '../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded';
  extraIng = 4;

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnAdd = document.querySelector('.btn--add-ingredient');
  _ingredientsContainer = document.querySelector('.end-element');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();

    // this._addNewIngredient();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  // _addNewIngredient() {
  //   this._btnAdd.addEventListener('click', function (e) {
  //     e.preventDefault();
  //     console.log('hello');
  //   });
  // }

  addHandlerNewIng(handler) {
    this._btnAdd.addEventListener('click', this.adder.bind(this, handler));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      console.log(data);
      handler(data);
    });
  }

  adder(handler) {
    // handler();
    // let input = document.createElement();

    let markup = `
    <fieldset>
    <label>Ingredient ${this.extraIng}</label>
    <input
      value=""
      type="text"
      name="ingredient-${this.extraIng}-quantity"
      placeholder="Quantity"
    />
    <input
      value=""
      type="text"
      name="ingredient-${this.extraIng}-unit"
      placeholder="Unit"
    />
    <input
      value=""
      type="text"
      name="ingredient-${this.extraIng}-description"
      placeholder="Description"
    />
  </fieldset>`;
    this.extraIng = this.extraIng + 1;
    console.log(this.extraIng);
    // this._parentElement.appendChild(input);
    this._ingredientsContainer.insertAdjacentHTML('afterend', markup);
  }

  _generateMarkup() {
    let markup = `<form class="upload">
    <div class="upload__column">
      <h3 class="upload__heading">Recipe data</h3>
      <label>Title</label>
      <input value="TEST85" required name="title" type="text" />
      <label>URL</label>
      <input value="TEST85" required name="sourceUrl" type="text" />
      <label>Image URL</label>
      <input value="TEST85" required name="image" type="text" />
      <label>Publisher</label>
      <input value="TEST85" required name="publisher" type="text" />
      <label>Prep time</label>
      <input value="23" required name="cookingTime" type="number" />
      <label>Servings</label>
      <input value="23" required name="servings" type="number" />
    </div>

    <div class="upload__column">
      <h3 class="upload__heading">Ingredients</h3>
      <fieldset>
        <ledgend>Ingredient 1</ledgend>
        <input
          value="0.5"
          type="text"
          required
          name="ingredient-1-quantity"
          placeholder="Quantity"
        />
        <input
          value="kg"
          type="text"
          required
          name="ingredient-1-unit"
          placeholder="Unit"
        />
        <input
          value="Rice"
          type="text"
          required
          name="ingredient-1-description"
          placeholder="Description"
        />
      </fieldset>
      <fieldset>
        <label>Ingredient 2</label>
        <input
          value="10"
          type="text"
          required
          name="ingredient-2-quantity"
          placeholder="Format: 'Quantity'"
        />
        <input
          value="kg"
          type="text"
          required
          name="ingredient-2-unit"
          placeholder="Unit"
        />
        <input
          value="Avocado"
          type="text"
          required
          name="ingredient-2-description"
          placeholder="Description"
        />
      </fieldset>
      <fieldset>
        <label>Ingredient 3</label>
        <input
          value="36"
          type="text"
          name="ingredient-3-quantity"
          placeholder="Format: 'Quantity'"
        />
        <input
          value="kg"
          type="text"
          name="ingredient-3-unit"
          placeholder="Unit"
        />
        <input
          value="cucumber"
          type="text"
          name="ingredient-3-description"
          placeholder="Description"
        />
      </fieldset>
      
      <button type="button" class="btn--add-ingredient">
        Add New Ingredient
      </button>

      <!--
      <label>Ingredient 3</label>
      <input
        value=",,salt"
        type="text"
        name="ingredient-3"
        placeholder="Format: 'Quantity,Unit,Description'"
      />
      <label>Ingredient 4</label>
      <input
        type="text"
        name="ingredient-4"
        placeholder="Format: 'Quantity,Unit,Description'"
      />
      <label>Ingredient 5</label>
      <input
        type="text"
        name="ingredient-5"
        placeholder="Format: 'Quantity,Unit,Description'"
      />
      <label>Ingredient 6</label>
      <input
        type="text"
        name="ingredient-6"
        placeholder="Format: 'Quantity,Unit,Description'"
      />
      -->
    </div>

    <button class="btn upload__btn">
      <svg>
        <use href="src/img/icons.svg#icon-upload-cloud"></use>
      </svg>
      <span>Upload</span>
    </button>
  </form>`;
    return markup;
  }
}

export default new AddRecipeView();
