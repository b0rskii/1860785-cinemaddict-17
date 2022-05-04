import dayjs from 'dayjs';

export const getRandomInteger = (min = 0, max = 1) => {
  const random = min + Math.random() * (max + 1 - min);
  return Math.floor(random);
};

export const formatDescription = (string, maxLength = 140) => {
  if (string.length > maxLength) {
    return string.replace(string.substring(maxLength - 1), '...');
  }
  return string;
};

export const formatRuntime = (minutes) => {
  if ((minutes / 60) >= 1) {
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  }
  return `${minutes % 60}m`;
};

export const formatDate = (date, format) => dayjs(date).format(format);

export const getConsecutiveNumbers = (length) => {
  const numbers = [];

  for (let i = 1; i <= length; i++) {
    numbers.push(i);
  }

  return numbers;
};
