import {getRandomInteger, getRandomNoInteger, getConsecutiveNumbers} from '../utils/common.js';

const Amount = {
  FILMS: 22,
  COMMENTS: 220
};

const NumberFilmComments = {
  MIN: 0,
  MAX: 10
};

const TotalRaiting = {
  MIN: 3,
  MAX: 8,
  DECIMAL_PLACES: 1
};

const filmsIndificators = getConsecutiveNumbers(Amount.FILMS);
const commentsIndificators = getConsecutiveNumbers(Amount.COMMENTS);
const filmCommentsIndificators = commentsIndificators.slice();

const generateFilmsId = () => filmsIndificators.shift();

const generatePoster = () => {
  const posters = [
    'images/posters/made-for-each-other.png',
    'images/posters/popeye-meets-sinbad.png',
    'images/posters/sagebrush-trail.jpg',
    'images/posters/santa-claus-conquers-the-martians.jpg',
    'images/posters/the-dance-of-life.jpg',
    'images/posters/the-great-flamarion.jpg',
    'images/posters/the-man-with-the-golden-arm.jpg'
  ];

  const randomIndex = getRandomInteger(0, posters.length - 1);

  return posters[randomIndex];
};

const generateTitle = () => {
  const titles = [
    'Made For Each Other',
    'Popeye Meets Sinbad',
    'Sagebrush Trail',
    'Santa Claus Conquers The Martians',
    'The Dance Of Life',
    'The Great Flamarion',
    'The Man With The Golden Arm'
  ];

  const randomIndex = getRandomInteger(0, titles.length - 1);

  return titles[randomIndex];
};

const generateTotalRaiting = () => getRandomNoInteger(TotalRaiting.MIN, TotalRaiting.MAX, TotalRaiting.DECIMAL_PLACES);

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.'
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generateRuntime = () => {
  const Runtime = {
    MIN: 15,
    MAX: 200
  };

  return getRandomInteger(Runtime.MIN, Runtime.MAX);
};

const generateGenres = () => {
  const genres = [
    'Musical',
    'Action',
    'Comedy'
  ];

  return genres.splice(getRandomInteger(0, genres.length - 1), genres.length);
};

const generateCommentsIdToFilm = () => filmCommentsIndificators.splice(0, getRandomInteger(NumberFilmComments.MIN, NumberFilmComments.MAX));

const generateCommentId = () => commentsIndificators.shift();

const generateEmoji = () => {
  const emojis = [
    'smile',
    'sleeping',
    'puke',
    'angry'
  ];

  const randomIndex = getRandomInteger(0, emojis.length - 1);

  return emojis[randomIndex];
};

const generateFilm = () => ({
  id: generateFilmsId(),
  commentsId: generateCommentsIdToFilm(),
  filmInfo: {
    title: generateTitle(),
    alternativeTitle: 'Laziness Who Sold Themselves',
    totalRating: generateTotalRaiting(),
    poster: generatePoster(),
    ageRating: 0,
    director: 'Tom Ford',
    writers: [
      'Takeshi Kitano',
      'Anne Wigton'
    ],
    actors: [
      'Morgan Freeman',
      'Brad Pitt',
      'Jackie Chan'
    ],
    release: {
      date: '2019-05-11T00:00:00.000Z',
      releaseCountry: 'Finland'
    },
    runtime: generateRuntime(),
    genre: generateGenres(),
    description: generateDescription()
  },
  userDetails: {
    watchlist: false,
    alreadyWatched: true,
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: false
  }
});

const generateComment = () => ({
  id: generateCommentId(),
  author: 'Ilya O\'Reilly',
  comment: 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  date: '2019-05-11T16:12:32.554Z',
  emotion: generateEmoji()
});

export {Amount, generateFilm, generateComment};
