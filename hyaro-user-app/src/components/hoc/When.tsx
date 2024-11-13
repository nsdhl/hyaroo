'use client';

import { FC, ReactNode } from 'react';

interface IWhen {
  condition: boolean;
  children: ReactNode;
}

const When: FC<IWhen> = ({ condition, children }) => {
  if (condition) return children;
  return null;
};

export default When;
