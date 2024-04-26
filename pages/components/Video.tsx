import React, {FC, useEffect, useRef, useState} from 'react';

interface Props {
  isLoaded?: () => void
  src: string,
  maxWidth?: number
  isLoop?: boolean
  isMuted?: boolean
  isAutoPlay?: boolean
  isPlay?: boolean
  setLoadPercent?: (percent: number) => void
}

const Video: FC<Props> = ({
                            src,
                            maxWidth,
                            isAutoPlay = true,
                            isMuted = true,
                            isLoop = true,
                            isPlay = true,
                            setLoadPercent,
                            isLoaded
                          }) => {
  const [orientation, setOrientation] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Запуск відео
  useEffect(() => {
    const videoElem = videoRef.current;

    if (videoElem && isPlay) {
      videoElem.play();
    }
  }, [isPlay]);

  // Встановлення орієнтації
  useEffect(() => {
    const videoElem = videoRef.current;

    if (!videoElem) return;

    const orientation = videoElem.width > videoElem.height ? 'Landscape' : 'Portrait';
    setOrientation(orientation);
  }, [videoRef.current]);


  // Відслідковування буфуризації
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkBuffered = () => {
      const videoEl = videoRef.current;
      if (videoEl) {
        if (videoEl.duration && videoEl.buffered.length > 0) {
          const bufferEnd = videoEl.buffered.end(videoEl.buffered.length - 1);
          const duration = videoEl.duration;
          const loadedPercentage = (bufferEnd / duration) * 100;

          if (setLoadPercent) {
            setLoadPercent(loadedPercentage);
          }

          if (bufferEnd >= duration) {
            isLoaded && isLoaded();
            clearInterval(intervalId);
          }
        }
      }
    };


    intervalId = setInterval(checkBuffered, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);


  // Автовоспроизведение при видимости
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const videoElem = videoRef.current;

        if (videoElem) {
          const opacity = window.getComputedStyle(videoElem).opacity;

          if (entry.isIntersecting && opacity !== '0') {
            const playPromise = videoElem.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.error(error);
              });
            }
          } else {
            setTimeout(() => {
              videoElem.pause();
            }, 1000);
          }
        }
      });
    });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [videoRef.current]);


  return (
    <video
      preload={"auto"}
      ref={videoRef}
      style={orientation === "Landscape"
        ? { height: "auto", width: "100%", maxWidth: `${maxWidth ?? 100}%` }
        : { height: "100%", width: "auto", maxWidth: `${maxWidth ?? 100}%` }
      }
      className={'video'}
      muted={isMuted}
      loop={isLoop}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};

export default Video;