import { FC, ReactNode, memo } from "react";

interface IWhen {
  condition: boolean;
  children: ReactNode;
}

const _When: FC<IWhen> = ({ condition, children }) => {
  if (condition) return children;
  return null
}

export const When = memo(_When)
