import {render} from './framework/render.js';
import UserView from './view/user-view.js';
import NumberOfFilmsView from './view/number-of-films-view.js';
import MainPresenter from './presenter/main-presenter.js';
import FilmsModel from './model/films-model.js';


const header = document.querySelector('header');
const main = document.querySelector('main');
const footerStatistics = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();

render(new UserView(), header);

new MainPresenter(main, filmsModel).init();

render(new NumberOfFilmsView(), footerStatistics);
