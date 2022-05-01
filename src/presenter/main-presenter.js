import NavigationView from '../view/navigation-view.js';
import SortView from '../view/sort-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsListSectionView from '../view/films-list-section-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import ExtraSectionView from '../view/extra-section-view.js';
import PopupView from '../view/popup-view.js';
import {render} from '../render.js';

const RenderCount = {
  FILM_CARDS: 5,
  FILM_CARDS_EXTRA: 2
};

const Title = {
  FIRST_EXTRA_SECTION: 'Top rated',
  SECOND_EXTRA_SECTION: 'Most commented'
};

export default class MainPresenter {
  filmsSection = new FilmsSectionView();
  filmsListSection = new FilmsListSectionView();
  filmsListContainer = new FilmsListContainerView();
  firstExtraSection = new ExtraSectionView(Title.FIRST_EXTRA_SECTION);
  secondExtraSection = new ExtraSectionView(Title.SECOND_EXTRA_SECTION);
  topRatedFilmsContainer = new FilmsListContainerView();
  mostCommentedFilmsContainer = new FilmsListContainerView();

  init(container, filmsModel) {
    this.container = container;
    this.filmsModel = filmsModel;
    this.mainFilms = [...this.filmsModel.getFilms()];
    this.comments = [...this.filmsModel.getComments()];

    render(new NavigationView(), this.container);
    render(new SortView(), this.container);
    render(this.filmsSection, this.container);
    render(this.filmsListSection, this.filmsSection.getElement());
    render(this.filmsListContainer, this.filmsListSection.getElement());

    for (let i = 0; i < RenderCount.FILM_CARDS; i++) {
      render(new FilmCardView(this.mainFilms[i]), this.filmsListContainer.getElement());
    }

    render(new ShowMoreButtonView, this.filmsListSection.getElement());
    render(this.firstExtraSection, this.filmsSection.getElement());
    render(this.secondExtraSection, this.filmsSection.getElement());
    render(this.topRatedFilmsContainer, this.firstExtraSection.getElement());
    render(this.mostCommentedFilmsContainer, this.secondExtraSection.getElement());

    for (let i = 0; i < RenderCount.FILM_CARDS_EXTRA; i++) {
      render(new FilmCardView(this.mainFilms[i]), this.topRatedFilmsContainer.getElement());
      render(new FilmCardView(this.mainFilms[i]), this.mostCommentedFilmsContainer.getElement());
    }

    const filmCards = document.querySelectorAll('.film-card');

    filmCards.forEach((item) => item.addEventListener('click', (evt) => {
      const filmId = evt.target.getAttribute('data-id') - 1;

      render(new PopupView(this.mainFilms[filmId], this.comments), document.querySelector('body'));

      const popupCloseButton = document.querySelector('.film-details__close-btn');

      popupCloseButton.addEventListener('click', () => {
        document.querySelector('.film-details').remove();
      });
    }));
  }
}
