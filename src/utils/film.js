import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {Emoji} from '../const';

dayjs.extend(relativeTime);

const formatDescription = (string, maxLength = 140) => {
  if (string.length > maxLength) {
    return string.replace(string.substring(maxLength - 1), '...');
  }
  return string;
};

const formatRuntime = (minutes) => {
  if ((minutes / 60) >= 1) {
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  }
  return `${minutes % 60}m`;
};

const formatDate = (date, format) => dayjs(date).format(format);

const formatDateFromNow = (date) => dayjs(date).fromNow();

const formatDateToUnix = (date) => dayjs(date).unix();

const sortByDate = (a, b) => formatDateToUnix(b.filmInfo.release.date) - formatDateToUnix(a.filmInfo.release.date);

const sortByRaiting = (a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating;

const sortByCommentsCount = (a, b) => b.commentsId.length - a.commentsId.length;

const checkReaction = (emoji) => {
  switch (emoji) {
    case Emoji.SMILE:
      return Emoji.SMILE_IMG;
    case Emoji.SLEEPING:
      return Emoji.SLEEPING_IMG;
    case Emoji.PUKE:
      return Emoji.PUKE_IMG;
    case Emoji.ANGRY:
      return Emoji.ANGRY_IMG;
    default:
      return '';
  }
};

const isEmojiChecked = (emojiValue, currentEmoji) => emojiValue === currentEmoji ? 'checked' : '';

export {
  formatDescription,
  formatRuntime,
  formatDate,
  formatDateFromNow,
  sortByDate,
  sortByRaiting,
  sortByCommentsCount,
  checkReaction,
  isEmojiChecked
};
