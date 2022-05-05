import dayjs from 'dayjs';

export const getRandomInteger = (min = 0, max = 1) => {
  const random = min + Math.random() * (max + 1 - min);
  return Math.floor(random);
};

export const getRandomNoInteger = (min = 0, max = 1, decimalPlaces) => {
  const random = min + Math.random() * (max + 1 - min);
  return random.toFixed(decimalPlaces);
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

export const fixScrollbarOpen = () => {
  if (window.innerWidth !== document.documentElement.clientWidth) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
  }
};

export const fixScrollbarClose = () => {
  if (document.documentElement.style.paddingRight !== '') {
    document.documentElement.style.paddingRight = '';
  }
};
