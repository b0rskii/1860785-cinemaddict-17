import MainPresenter from './presenter/main-presenter.js';
import UserPresenter from './presenter/user-presenter.js';
import FooterPresenter from './presenter/footer-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilmsApiService from './services/films-api-service.js';
import CommentsApiService from './services/comments-api-service.js';

const AUTHORIZATION = 'Basic jjg483983934oipplh90kj3';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

const header = document.querySelector('header');
const main = document.querySelector('main');
const footerStatistics = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION), filmsModel);

const userPresenter = new UserPresenter(header, filmsModel);
const mainPresenter = new MainPresenter(main, filmsModel, commentsModel);
const footerPresenter = new FooterPresenter(footerStatistics, filmsModel);

userPresenter.init();
mainPresenter.init();
footerPresenter.init();
filmsModel.init();
