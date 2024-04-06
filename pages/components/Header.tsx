import React, {FC, useEffect, useRef, useState} from 'react';
import Video from "@/pages/components/Video";

const Header: FC<{setIsVideoLoaded: (isLoaded: boolean) => void}> = ({setIsVideoLoaded}) => {
  const [timerNum, setTimerNum] = useState(19)

  const handleIsLoadedVideo = () => {
    setIsVideoLoaded(true);

  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerNum((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  },[])

  return (
    <header className={"slide header"}>
      <div id={"timer"}>{timerNum}</div>
      {/*<video onCanPlay={handleIsLoadedVideo} id={'teaser'} autoPlay muted loop>*/}
      {/*  <source src="/media/teaser%202024/teaser.mp4" type="video/mp4"/>*/}
      {/*</video>*/}
      <Video isLoaded={handleIsLoadedVideo} src={"/media/teaser%202024/teaser.mp4"}/>
    </header>
  );
};

export default Header;