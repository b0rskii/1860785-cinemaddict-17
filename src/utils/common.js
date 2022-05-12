const getRandomInteger = (min = 0, max = 1) => {
  const random = min + Math.random() * (max + 1 - min);
  return Math.floor(random);
};

const getRandomNoInteger = (min = 0, max = 1, decimalPlaces) => {
  const random = min + Math.random() * (max + 1 - min);
  return random.toFixed(decimalPlaces);
};

const getConsecutiveNumbers = (length) => {
  const numbers = [];

  for (let i = 1; i <= length; i++) {
    numbers.push(i);
  }

  return numbers;
};

const fixScrollbarOpen = () => {
  if (window.innerWidth !== document.documentElement.clientWidth) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
  }
};

const fixScrollbarClose = () => {
  if (document.documentElement.style.paddingRight !== '') {
    document.documentElement.style.paddingRight = '';
  }
};

const addClassByCondition = (condition, className) => {
  if (condition) {
    return className;
  }
};

export {getRandomInteger, getRandomNoInteger, getConsecutiveNumbers, fixScrollbarOpen, fixScrollbarClose, addClassByCondition};
