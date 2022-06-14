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

  return '';
};

export {
  fixScrollbarOpen,
  fixScrollbarClose,
  addClassByCondition
};
