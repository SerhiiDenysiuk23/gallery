import React, {FC, useState} from 'react';

interface Props {
  isLoaded: () => void
  src: string,
  maxWidth?: number
}

const Video: FC<Props> = ({src, maxWidth, isLoaded}) => {
  const [orientation, setOrientation] = useState<string>("");

  const handleLoaded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    isLoaded()

    const target = e.target as HTMLVideoElement;
    const orientation = target.width > target.height ? 'Landscape' : 'Portrait';
    setOrientation(orientation);
  }

  return (
    <video style={orientation === "Landscape"
      ? {height: "auto", width: "100%", maxWidth: `${maxWidth ?? 100}%`}
      : {height: "100%", width: "auto", maxWidth: `${maxWidth ?? 100}%`}}
           onCanPlay={handleLoaded} className={'video'} autoPlay muted loop>
      <source src={src} type="video/mp4"/>
    </video>
  );
};

export default Video;