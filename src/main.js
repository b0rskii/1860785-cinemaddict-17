import {render} from './framework/render.js';
import NumberOfFilmsView from './view/number-of-films-view.js';
import MainPresenter from './presenter/main-presenter.js';
import UserPresenter from './presenter/user-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';


const header = document.querySelector('header');
const main = document.querySelector('main');
const footerStatistics = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel(filmsModel.films);

new UserPresenter(header, filmsModel).init();
new MainPresenter(main, filmsModel, commentsModel).init();

render(new NumberOfFilmsView(filmsModel.films), footerStatistics);
