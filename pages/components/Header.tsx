import React, {FC, useEffect, useRef, useState} from 'react';
import Video from "@/pages/components/Video";

interface Props {
  setTimerNum: React.Dispatch<React.SetStateAction<number>>
  setIsVideoLoaded: (isLoaded: boolean) => void
}

const Header: FC<Props> = ({setIsVideoLoaded, setTimerNum}) => {
  const [isClicked, setIsClicked] = useState(false)
  const [loadPercent, setLoadPercent] = useState(0)
  const [isPlay, setIsPlay] = useState(false)
  const [blobUrl, setBlobUrl] = useState("")

  const handleIsLoadedVideo = () => {
    setIsVideoLoaded(true);
  }

  const handlePlayTeaser = () => {
    setIsClicked(true)
  }

  // Запуск таймеру
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

  // Запуск відео
  useEffect(() => {
    if (loadPercent >= 100)
      setIsPlay(true)
  }, [loadPercent]);

  useEffect(() => {
    // fetch("/api/getTeaser")
    //   .then(response => response.blob())
    //   .then(blob => {
    //     const url = URL.createObjectURL(blob)
    //     setBlobUrl(url)
    //   })



    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/getTeaser");
    xhr.responseType = "blob";

    xhr.onprogress = function(event) {
      const percentComplete = (event.loaded / event.total) * 100;
      console.log(`Загрузка: ${percentComplete}%`);
    };

    xhr.onload = function() {
      if (xhr.status === 200) {
        const url = URL.createObjectURL(xhr.response);
        setBlobUrl(url);
      }
    };

    xhr.send();
  }, []);


  return (
    <header className={"slide header"}>
      {
        !isClicked &&
        <div className={"teaser-text teaser-text__click-to-start"} onClick={handlePlayTeaser}>NOLOVE</div>
      }

      {
        isClicked && loadPercent < 100 &&
        <div className={"teaser-text"}>{loadPercent.toFixed(0)}%</div>
      }
      <div className={'wrapper'}>
        <Video isPlay={isPlay} setLoadPercent={setLoadPercent} isAutoPlay={isClicked} isMuted={false} isLoop={false}
               isLoaded={handleIsLoadedVideo}
               src={blobUrl}/>
      </div>

    </header>
  );
};

export default Header;