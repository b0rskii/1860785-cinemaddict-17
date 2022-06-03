import ApiService from '../framework/api-service.js';

export default class CommentsApiService extends ApiService {
  getFilmComments = (filmId) => this._load({url: `comments/${filmId}`})
    .then(ApiService.parseResponse);
}
