import React, {createContext, FC, useState} from 'react';

interface ITeaserHideContext {
  isTeaserHide: boolean;
  setIsTeaserHide: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TeaserHideContext =
  createContext<ITeaserHideContext>({isTeaserHide: false, setIsTeaserHide: () => {}});

const TeaserHideProvider: FC<{children: React.ReactNode }> = ({children}) => {
  const [isTeaserHide, setIsTeaserHide] = useState(false);

  return (
    <TeaserHideContext.Provider value={{ isTeaserHide, setIsTeaserHide }}>
      {children}
    </TeaserHideContext.Provider>
  );
};

export default TeaserHideProvider;