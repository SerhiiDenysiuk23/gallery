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
                            isAutoPlay = true,
                            isMuted = true,
                            isLoop = true,
                            isPlay = true,
                            setLoadPercent,
                            isLoaded
                          }) => {
  const [orientation, setOrientation] = useState<string>("");
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElem = videoRef.current;

    if (videoElem && isPlay) {
      videoElem.play();
    }
  }, [isPlay]);

  useEffect(() => {
    const fetchAndSetVideo = async () => {
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        const videoBlobUrl = URL.createObjectURL(blob);
        setVideoSrc(videoBlobUrl);
      } catch (error) {
        console.error("Failed to fetch video:", error);
      }
    };

    fetchAndSetVideo();

    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, []);

  useEffect(() => {
    const videoElem = videoRef.current;

    if (!videoElem) return;

    const orientation = videoElem.width > videoElem.height ? 'Landscape' : 'Portrait';
    setOrientation(orientation);

    if (isAutoPlay || isMuted) {
      videoElem.play();
    }
  }, [videoRef.current, isAutoPlay]);

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
      {videoSrc && <source src={videoSrc} type="video/mp4" />}
    </video>
  );
};

export default Video;