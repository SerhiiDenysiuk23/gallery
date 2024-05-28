import React, {FC, useEffect, useRef, useState} from 'react';
import Video from "@/pages/components/Video";
import TeaserVideo from "@/pages/components/TeaserVideo";

interface Props {
  setTimerNum: React.Dispatch<React.SetStateAction<number>>
  setIsVideoLoaded: (isLoaded: boolean) => void
}

const Header: FC<Props> = ({setIsVideoLoaded, setTimerNum}) => {
  const [loadPercent, setLoadPercent] = useState(0)
  const [isPlay, setIsPlay] = useState(false)

  const handlePlayTeaser = () => {
    setIsPlay(true)
  }

  // Запуск таймеру
  useEffect(() => {
    if (!isPlay || loadPercent < 100)
      return

    setIsVideoLoaded(true);

    const timer = setInterval(() => {
      setTimerNum((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          return 1;
        }
        return prevSeconds - 1;
      });
    }, 1000);
    return () => clearInterval(timer);

  }, [isPlay, loadPercent])


  return (
    <header className={"slide header"}>
      {
        loadPercent < 100 &&
        <div className={"teaser-text teaser-text__loader"}>{loadPercent.toFixed(0)}%</div>
      }

      {
        (loadPercent >= 100 && !isPlay) &&
        <div className={"teaser-text teaser-text__click-to-start"} onClick={handlePlayTeaser}>NOLOVE</div>
      }


      <TeaserVideo setTimerNum={setTimerNum} isPlay={isPlay} setLoadPercent={setLoadPercent}/>


    </header>
  );
};

export default Header;