import View from './View';
import icons from '../../img/icons.svg';

class IngredientView extends View {
  _parentElement = '';
  _btnDelete = document.querySelector('.btn--delete-ingredient');

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return `
        <li class="preview">
            
        <a class="preview__link ${
          this._data.id === id ? 'preview__link--active' : ''
        }" href="#${this._data.id}" >
              <div class="preview__data">             
                <h4 class="preview__title">${
                  this._data.quantity ? this._data.quantity : ''
                } ${this._data.unit ? this._data.unit : ''} ${
      this._data.description
    }
    
    </h4>               
                </div>
               
                <button class="btn--delete-ingredient button-x" data-id="${
                  this._data.description
                }" type="button">X</button>
    
    </a>
            
        </li>`;
  }
}

export default new IngredientView();
