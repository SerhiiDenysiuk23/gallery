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
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
    return () => clearInterval(timer);

  }, [isPlay, loadPercent])

  // Preload video
  useEffect(() => {
    let attempt = 0;
    const maxAttempts = 5;

    function getFile() {
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
        } else {
          console.error(`Ошибка загрузки: ${xhr.status} ${xhr.statusText}`);
          if (attempt < maxAttempts) {
            attempt++;
            console.log(`Попытка ${attempt} из ${maxAttempts}...`);
            getFile();
          } else {
            console.error('Превышено максимальное количество попыток');
          }
        }
      };

      xhr.onerror = function () {
        console.error('Произошла ошибка при выполнении запроса.');
        if (attempt < maxAttempts) {
          attempt++;
          console.log(`Попытка ${attempt} из ${maxAttempts}...`);
          getFile();
        } else {
          console.error('Превышено максимальное количество попыток');
        }
      };

      try {
        xhr.send();
      } catch (error) {
        console.error(`Ошибка отправки запроса: ${error}`);
        if (attempt < maxAttempts) {
          attempt++;
          console.log(`Попытка ${attempt} из ${maxAttempts}...`);
          getFile();
        } else {
          console.error('Превышено максимальное количество попыток');
        }
      }
    }

// Начать первую попытку
    getFile();
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
                         src={blobUrl}/>
      }


    </header>
  );
};

export default Header;