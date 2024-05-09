import React, {FC, useCallback, useEffect, useRef, useState} from 'react';

interface Props {
  isLoaded?: () => void
  src: string,
  maxWidth?: number
}

const Video: FC<Props> = ({
                            src,
                            maxWidth,
                            isLoaded
                          }) => {
  const [orientation, setOrientation] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [blobUrl, setBlobUrl] = useState("")

  const handleObserve = useCallback((entries: IntersectionObserverEntry[]) => {
    const videoElem = videoRef.current;

    if (!videoElem) return;

    entries.forEach((entry) => {
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
  }, []);



  useEffect(() => {
    if (!src) return

    fetch("/api/getVideo", {method: "POST", body: src})
      .then(response => response.blob())
      .then(blob => {
        let url = URL.createObjectURL(blob);
        setBlobUrl(url)
        isLoaded && isLoaded()

        return () => {
          URL.revokeObjectURL(url);
        };
      })
      .catch(e => console.error(e));


  }, []);

  useEffect(() => {
    // Set Landscape
    const videoElem = videoRef.current;

    if (!videoElem) return;

    const orientation = videoElem.videoWidth > videoElem.videoHeight ? 'Landscape' : 'Portrait';
    setOrientation(orientation);


    // Auto Play
    const observer = new IntersectionObserver(handleObserve);
    observer.observe(videoElem);

    return () => {
      observer.unobserve(videoElem);
    };

  }, [videoRef.current]);

  if (!blobUrl.length)
    return <div>Loading...</div>

  return (
    <video
      preload={"auto"}
      ref={videoRef}
      style={orientation === "Landscape"
        ? {height: "auto", width: "100%", maxWidth: `${maxWidth ?? 100}%`}
        : {height: "100%", width: "auto", maxWidth: `${maxWidth ?? 100}%`}
      }
      className={'video'}
      muted
      loop
    >
      <source src={blobUrl} type="video/mp4"/>
    </video>
  );
};

export default Video;