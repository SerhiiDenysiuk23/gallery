import React, {FC, useEffect, useRef, useState} from 'react';
import Video from "@/pages/components/Video";

interface Props {
  setTimerNum: React.Dispatch<React.SetStateAction<number>>
  setIsVideoLoaded: (isLoaded: boolean) => void
}

const Header: FC<Props> = ({setIsVideoLoaded, setTimerNum}) => {
  const [isClicked, setIsClicked] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleIsLoadedVideo = () => {
    setIsVideoLoaded(true);
  }

  const handlePlayTeaser = () => {
    setIsClicked(true)
  }

  useEffect(() => {

    if (!isClicked)
      return

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

  }, [isClicked])

  return (
    <header className={"slide header"}>
      {
        !isClicked &&
        <div className={"teaser-text teaser-text__click-to-start"} onClick={handlePlayTeaser}>NOLOVE</div>
      }
      <div className={'wrapper'}>
        <Video isPlay={isClicked} isMuted={false} isLoop={false} isLoaded={handleIsLoadedVideo}
               src={"/media/teaser%202024/teaser.mov"}/>
      </div>
    </header>
  );
};

export default Header;