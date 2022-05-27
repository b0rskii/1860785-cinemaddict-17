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

const checkReaction = (emoji) => {
  if (emoji === Emoji.SMILE) {
    return Emoji.SMILE_IMG;
  }

  if (emoji === Emoji.SLEEPING) {
    return Emoji.SLEEPING_IMG;
  }

  if (emoji === Emoji.PUKE) {
    return Emoji.PUKE_IMG;
  }

  if (emoji === Emoji.ANGRY) {
    return Emoji.ANGRY_IMG;
  }

  return '';
};

const isEmojiChecked = (emojiValue, currentEmoji) => emojiValue === currentEmoji ? 'checked' : '';

export {formatDescription, formatRuntime, formatDate, formatDateFromNow, formatDateToUnix, checkReaction, isEmojiChecked};
