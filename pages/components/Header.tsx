import React, {FC, useEffect, useRef, useState} from 'react';
import Video from "@/pages/components/Video";
import TeaserVideo from "@/pages/components/TeaserVideo";

interface Props {
  setIsVideoLoaded: (isLoaded: boolean) => void
}

const Header: FC<Props> = ({setIsVideoLoaded}) => {
  const [loadPercent, setLoadPercent] = useState(0)
  const [isPlay, setIsPlay] = useState(false)

  const handlePlayTeaser = () => {
    setIsPlay(true)
  }

  // Запуск таймеру

  useEffect(() => {
    if (loadPercent >= 100){
      setIsVideoLoaded(true)
    }
  }, [loadPercent]);


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


      <TeaserVideo isPlay={isPlay} setLoadPercent={setLoadPercent}/>


    </header>
  );
};

export default Header;