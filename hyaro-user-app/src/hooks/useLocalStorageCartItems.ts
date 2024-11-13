export const useLocalStorageCartItems = () => {
  const localStorageCartItems = JSON.parse(localStorage.getItem('cart') || '');
  return localStorageCartItems;
};
