import {render} from './render.js';
import UserView from './view/user-view.js';
import NumberOfFilmesView from './view/number-of-filmes-view.js';
import MainPresenter from './presenter/main-presenter.js';


const header = document.querySelector('header');
const main = document.querySelector('main');
const footerStatistics = document.querySelector('.footer__statistics');

render(new UserView(), header);

new MainPresenter().init(main);

render(new NumberOfFilmesView(), footerStatistics);
