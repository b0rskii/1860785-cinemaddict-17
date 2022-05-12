import dayjs from 'dayjs';

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

export {formatDescription, formatRuntime, formatDate};
