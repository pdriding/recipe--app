import View from './View';
import previewView from './previewView';
import icons from '../../img/icons.svg';
import ingredientView from './ingredientView';

class ShoppingCartView extends View {
  _parentElement = document.querySelector('.shopping__list');
  _btnDelete = document.querySelector('.btn--delete-ingredient');
  _messageEl = document.querySelector('.added-message');
  _overlay = document.querySelector('.overlay-message');
  _errorMessage = 'No ingredients added to shopping cart :).';
  _message = 'Added to shopping cart :)';

  toggleWindow() {
    this._messageEl.classList.toggle('hidden-mess');
    this._overlay.classList.toggle('hidden-mess');
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  addDeleteButton(handler) {
    const divvy = document.querySelectorAll('.btn--delete-ingredient');
    divvy.forEach(div =>
      div.addEventListener('click', function (e) {
        e.preventDefault();
        const button = div.closest('button');
        const ingredient = button.dataset.id;
        handler(ingredient);
      })
    );
  }

  renderAddedMessage(message = this._message) {
    const markup = `
            <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;
    this._messageEl.innerHTML = '';
    this._messageEl.insertAdjacentHTML('afterbegin', markup);
  }
  _generateMarkup() {
    return this._data
      .map(ingredient => ingredientView.render(ingredient, false))
      .join('');
  }
}

export default new ShoppingCartView();
