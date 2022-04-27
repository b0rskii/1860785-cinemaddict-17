import NavigationView from '../view/navigation-view.js';
import SortView from '../view/sort-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsListSectionView from '../view/films-list-section-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import ExtraSectionView from '../view/extra-section-view.js';
import {render} from '../render.js';

const CARDS_NUMBER = 5;
const CARDS_NUMBER_EXTRA = 2;

export default class MainPresenter {
  filmsSection = new FilmsSectionView();
  filmsListSection = new FilmsListSectionView();
  filmsListContainer = new FilmsListContainerView();
  topRatedSection = new ExtraSectionView('Top rated');
  mostCommentedSection = new ExtraSectionView('Most commented');
  topRatedFilmsContainer = new FilmsListContainerView();
  mostCommentedFilmsContainer = new FilmsListContainerView();

  init(container) {
    this.container = container;

    render(new NavigationView(), this.container);
    render (new SortView(), this.container);
    render(this.filmsSection, this.container);
    render(this.filmsListSection, this.filmsSection.getElement());
    render(this.filmsListContainer, this.filmsListSection.getElement());

    for (let i = 0; i < CARDS_NUMBER; i++) {
      render(new FilmCardView(), this.filmsListContainer.getElement());
    }

    render(new ShowMoreButtonView, this.filmsListSection.getElement());
    render(this.topRatedSection, this.filmsSection.getElement());
    render(this.mostCommentedSection, this.filmsSection.getElement());
    render(this.topRatedFilmsContainer, this.topRatedSection.getElement());
    render(this.mostCommentedFilmsContainer, this.mostCommentedSection.getElement());

    for (let i = 0; i < CARDS_NUMBER_EXTRA; i++) {
      render(new FilmCardView(), this.topRatedFilmsContainer.getElement());
      render(new FilmCardView(), this.mostCommentedFilmsContainer.getElement());
    }
  }
}
