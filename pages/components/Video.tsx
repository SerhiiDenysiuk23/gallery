import React, {FC, useEffect, useRef, useState} from 'react';

interface Props {
  isLoaded: () => void
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
                            isLoaded,
                            isAutoPlay,
                            setLoadPercent,
                            isLoop = true,
                            isMuted = true,
                            isPlay = true
                          }) => {
  const [orientation, setOrientation] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const videoElem = videoRef.current

    if (!videoElem)
      return

    const orientation = videoElem.width > videoElem.height ? 'Landscape' : 'Portrait';
    setOrientation(orientation);


    if (!isPlay)
      return;

    if (isAutoPlay || isMuted)
      videoElem.play()

  }, [videoRef.current, isAutoPlay]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkBuffered = () => {
      const videoEl = videoRef.current;
      if (videoEl) {
        const bufferEnd = videoEl.buffered.end(videoEl.buffered.length - 1);
        const duration = videoEl.duration;
        const loadedPercentage = (bufferEnd / duration) * 100;

        if (setLoadPercent)
          setLoadPercent(loadedPercentage)

        if (bufferEnd >= duration) {
          isLoaded()
          clearInterval(intervalId);
        }
      }
    };

    intervalId = setInterval(checkBuffered, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const videoElem = videoRef.current

    if (!videoElem)
      return

    if (isPlay)
      videoElem.play()
    else
      videoElem.pause()
  }, [videoRef.current, isPlay]);

  return (
    <video preload={"auto"} ref={videoRef} style={orientation === "Landscape"
      ? {height: "auto", width: "100%", maxWidth: `${maxWidth ?? 100}%`}
      : {height: "100%", width: "auto", maxWidth: `${maxWidth ?? 100}%`}}
           className={'video'} muted={isMuted} loop={isLoop}>
      <source src={src} type="video/mp4"/>
    </video>
  );
};

export default Video;