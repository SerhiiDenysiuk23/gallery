import React, {FC, useEffect, useRef, useState} from 'react';

interface Props {
  isPlay: boolean
  setLoadPercent: (percent: number) => void
  setTimerNum: (num: number) => void
}

const TeaserVideo: FC<Props> = ({isPlay,setLoadPercent, setTimerNum}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [blobUrl, setBlobUrl] = useState("")
  const [isVideoEnded, setIsVideoEnded] = useState(false)



  // Preload video
  useEffect(() => {
    let attempt = 0;
    const maxAttempts = 5;

    function getFile() {
      const xhr = new XMLHttpRequest();
      const url = "/api/getVideo/"
      const data = JSON.stringify("teaser_2024/teaser.mov")
      xhr.open("POST", url);
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
          console.error(`Load error: ${xhr.status} ${xhr.statusText}`);
          if (attempt < maxAttempts) {
            attempt++;
            console.log(`Try ${attempt} of ${maxAttempts}...`);
            getFile();
          } else {
            console.error('Request limit exceeded');
          }
        }
      };

      xhr.onerror = function () {
        console.error('An error occurred while executing the request.');
        if (attempt < maxAttempts) {
          attempt++;
          console.log(`Try ${attempt} of ${maxAttempts}...`);
          getFile();
        } else {
          console.error('Request limit exceeded');
        }
      };

      try {
        xhr.send(data);
      } catch (error) {
        console.error(`Request error: ${error}`);
        if (attempt < maxAttempts) {
          attempt++;
          console.log(`Try ${attempt} of ${maxAttempts}...`);
          getFile();
        } else {
          console.error('Request limit exceeded');
        }
      }
    }
    getFile();
  }, []);

  // Start video
  useEffect(() => {
    const videoElem = videoRef.current;

    if (videoElem && isPlay) {
      videoElem.play();
    }
  }, [videoRef.current, isPlay]);

  useEffect(() => {
    const videoElem = videoRef.current;

    if (videoElem) {
      const handleTimeUpdate = () => {
        if (videoElem.duration - videoElem.currentTime <= 2.5) {
          videoElem.pause();
          setIsVideoEnded(true)
        }
      };

      videoElem.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        videoElem.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [videoRef.current]);

  const handleVideoClick = () => {
    if (isVideoEnded)
      setTimerNum(0)
  }

  if (!blobUrl.length)
    return null

  return (
    <video
      preload={"auto"}
      ref={videoRef}
      style={{ height: "auto", width: "100%", maxWidth: "100%" }}
      className={`video ${isVideoEnded ? "pulsed" : ""}`}
      onClick={handleVideoClick}
    >
      <source src={blobUrl} type="video/mp4" />
    </video>
  );
};

export default TeaserVideo;