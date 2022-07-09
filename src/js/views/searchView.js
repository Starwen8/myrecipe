import { state } from '../model';
class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const search = this._parentEl.querySelector('.search__field').value;
    this._clearInput();

    return search;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
    //reset search page back to page 1
    state.search.page = 1;
  }

  addhandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new SearchView();
