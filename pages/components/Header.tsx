import React, {FC, useEffect} from 'react';
import Video from "@/pages/components/Video";

interface Props {
  setTimerNum: React.Dispatch<React.SetStateAction<number>>
  timerNum: number
  setIsVideoLoaded: (isLoaded: boolean) => void
}

const Header: FC<Props> = ({setIsVideoLoaded, timerNum, setTimerNum}) => {

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
      <Video isLoaded={handleIsLoadedVideo} src={"/media/teaser%202024/teaser.mp4"}/>
    </header>
  );
};

export default Header;