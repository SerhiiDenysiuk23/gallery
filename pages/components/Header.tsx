import React, {FC, useEffect, useRef, useState} from 'react';
import Video from "@/pages/components/Video";

interface Props {
  setTimerNum: React.Dispatch<React.SetStateAction<number>>
  setIsVideoLoaded: (isLoaded: boolean) => void
}

const Header: FC<Props> = ({setIsVideoLoaded, setTimerNum}) => {
  const [loadPercent, setLoadPercent] = useState(0)
  const [isPlay, setIsPlay] = useState(false)
  const [blobUrl, setBlobUrl] = useState("")

  const handleIsLoadedVideo = () => {
    setIsVideoLoaded(true);
  }

  const handlePlayTeaser = () => {
    setIsPlay(true)
  }

  // Запуск таймеру
  useEffect(() => {

    if (!isPlay || loadPercent < 100)
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

  }, [isPlay, loadPercent])

  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/getTeaser");
    xhr.responseType = "blob";


    let prevLoaded = 0;
    let prevTotal = 0;
    xhr.onprogress = function (event) {
      if (event.loaded !== prevLoaded || event.total !== prevTotal) {
        const percentComplete = (event.loaded / event.total) * 100;
        setLoadPercent(percentComplete);

        prevLoaded = event.loaded;
        prevTotal = event.total;
      }
    };

    xhr.onload = function () {
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
        loadPercent < 100 &&
        <div className={"teaser-text"}>{loadPercent.toFixed(0)}%</div>
      }

      {
        (loadPercent >= 100 && !isPlay) &&
        <div className={"teaser-text teaser-text__click-to-start"} onClick={handlePlayTeaser}>NOLOVE</div>
      }

      {
        isPlay && <Video isPlay={isPlay} isAutoPlay={false} isMuted={false} isLoop={false}
                         isLoaded={handleIsLoadedVideo}
                         src={blobUrl}/>
      }


    </header>
  );
};

export default Header;