import React, {FC, useState} from 'react';
import Image from "next/image";

interface Props {
  isLoaded: () => void
  src: string
  maxWidth?: number
}

const Img: FC<Props> = ({isLoaded, src, maxWidth}) => {
  const [orientation, setOrientation] = useState<string>("");

  const handleLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
    isLoaded()

    const target = e.target as HTMLImageElement;
    const orientation = target.width > target.height ? 'Landscape' : 'Portrait';
    setOrientation(orientation);
  }

  return (
    <img
      loading={"lazy"}
      style={orientation === "Landscape"
        ? {height: "auto", width: "100%", maxWidth: `${maxWidth ?? 100}%`}
        : {height: "100%", width: "auto", maxWidth: `${maxWidth ?? 100}%`}}
      onLoad={handleLoaded} src={src} alt=""/>
  );
};

export default Img;