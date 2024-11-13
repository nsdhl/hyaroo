'use client';

import {
  FC,
  ReactNode,
  useState,
  createContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import * as Cookies from 'js-cookie';
import { ICartItem, IProduct, IUser } from '@/types/types';
import { jwtDecode } from 'jwt-decode';
import { isTokenExpired } from '@/utils/checkJwtLife';

export interface IAppState {
  token: string;
  isLoggedIn: boolean;
  searchKeyword: string;
  userInfo: (Omit<IUser, '_id'> & { userId: string }) | undefined;
  productList: IProduct[];
  page: number;
  showCheckoutDrawer: boolean;
  checkOutItems: ICartItem[];
  checkOutTotal: number | undefined;
}

export interface IAppContext {
  appState: IAppState;
  setLoggedInUser: (token: string) => void;
  logoutUser: () => void;
  setUserInfo: (userInfo: Omit<IUser, '_id'> & { userId: string }) => void;
  setSearchKeyword: (searchKeyword: string) => void;
  setProductList: (productList: IProduct[], type: 'query' | 'normal') => void;
  setPage: (page: number) => void;
  setAppState: Dispatch<SetStateAction<IAppState>>;
}

interface IAppCoreProvider {
  children: ReactNode;
}

export const AppContext = createContext<IAppContext | null>(null);

export const AppContextProvider: FC<IAppCoreProvider> = ({ children }) => {
  const [state, setState] = useState<IAppState>({
    token: '',
    userInfo: undefined,
    isLoggedIn: false,
    searchKeyword: '',
    productList: [],
    page: 1,
    showCheckoutDrawer: false,
    checkOutItems: [],
    checkOutTotal: undefined,
  });

  const setLoggedInUser = (token: string) => {
    setState((prev) => ({ ...prev, token: token, isLoggedIn: true }));
  };

  const logoutUser = () => {
    setState((prev) => ({ ...prev, token: '', isLoggedIn: false }));
    Cookies.default.remove('token');
  };

  const setUserInfo = (userInfo: Omit<IUser, '_id'> & { userId: string }) => {
    setState((prev) => ({ ...prev, userInfo: userInfo }));
  };

  const setSearchKeyword = (keyword: string) => {
    setState((prev) => ({ ...prev, searchKeyword: keyword }));
  };

  const setProductList = (
    productList: IProduct[],
    type: 'query' | 'normal',
  ) => {
    if (type === 'query') {
      setState((prev) => ({ ...prev, productList: [...productList] }));
      return;
    }
    setState((prev) => ({
      ...prev,
      productList: [...state.productList, ...productList],
    }));
  };

  const setPage = (page: number) => {
    setState((prev) => ({ ...prev, page: page }));
  };

  useEffect(() => {
    const token = Cookies.default.get('token');
    if (token) {
      const userInfo: Omit<IUser, '_id'> & { userId: string } = jwtDecode(
        JSON.parse(token as string).token,
      );
      if (isTokenExpired(userInfo)) {
        setState((prev) => ({ ...prev, token: '', isLoggedIn: false }));
        return;
      }
      setLoggedInUser(JSON.parse(token as string).token);
      setState((prev) => ({ ...prev, userInfo: userInfo }));
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        appState: state,
        setLoggedInUser,
        logoutUser,
        setUserInfo,
        setSearchKeyword,
        setProductList,
        setPage,
        setAppState: setState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
