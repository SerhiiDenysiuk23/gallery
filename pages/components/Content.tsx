import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import throttle from "@/services/throttle";
import {navEvent} from "@/services/navEvents";
import Header from "@/pages/components/Header";
import Slide from "@/pages/components/Slide";
import {TeaserHideContext} from "@/pages/components/TeaserHideProvider";

const Content = () => {
  const [files, setFiles] = useState<string[][]>([])
  const [isTeaserLoaded, setIsTeaserLoaded] = useState(false)
  const [loadedData, setLoadedData] = useState(0)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const {isTeaserHide} = useContext(TeaserHideContext)
  let startY: number


  useEffect(() => {
    fetch("/api/getPublicList").then(res => res.json()).then(res => {
      if (!res.files)
        return

      setFiles(res.files)
    })
  }, []);


  // Nav Events
  const preventDefault = useCallback((e: WheelEvent | KeyboardEvent) => {
    if (e instanceof WheelEvent || (e instanceof KeyboardEvent && ['ArrowUp', 'ArrowDown', " "].includes(e.key))) {
      e.preventDefault();
    }
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    startY = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback(throttle((e: TouchEvent) => {
    navEvent(e, sectionRefs, startY)
  }, 1000), []);

  const handleWheel = useCallback(throttle((e: WheelEvent) => {
    navEvent(e, sectionRefs)
  }, 1500), []);

  const handleKeyDown = useCallback(throttle((e: KeyboardEvent) => {
    navEvent(e, sectionRefs)
  }, 500), []);


  useEffect(() => {
    if (!isTeaserHide) {
      window.addEventListener('wheel', preventDefault, {passive: false});
      window.addEventListener('keydown', preventDefault, {passive: false});
      return () => {
        window.removeEventListener('wheel', preventDefault);
        window.removeEventListener('keydown', preventDefault);
      }
    }

    window.addEventListener('touchstart', handleTouchStart, {passive: false});
    window.addEventListener('touchmove', (e) => {
      e.preventDefault()
      handleTouchMove(e)
      console.log("touch")
    }, {passive: false});

    window.addEventListener('wheel', (e) => {
      e.preventDefault()
      handleWheel(e)
      console.log("wheel")
    }, {passive: false});
    window.addEventListener('keydown', (e) => {
      if (e.key === " ")
        e.preventDefault()

      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        handleKeyDown(e);
        console.log("arrow")
      }
    }, {passive: false});

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isTeaserHide, preventDefault, handleTouchStart, handleTouchMove, handleWheel, handleKeyDown]);

  const handleLoadData = () => {
    setLoadedData(prevState => prevState + 1)
  }

  const handleSetSlideRef = (refIndex: number) => {
    return (el: HTMLDivElement | null) => {
      sectionRefs.current[refIndex] = el
    }
  }

  return (
    <>
      {
        !isTeaserHide &&
        <Header setIsVideoLoaded={setIsTeaserLoaded}/>
      }
      <main>
        {
          files.map((item, index) => {
            if ((item.length > 0 && index === 0) || (item.length > 0 && isTeaserLoaded && loadedData >= index)) {

              return (
                <React.Fragment key={item[0]}>
                  <Slide
                    isHidden={!isTeaserHide}
                    setSlideRef={handleSetSlideRef(index)}
                    setIsLoadData={handleLoadData}
                    fileNames={item}/>
                </React.Fragment>
              );
            }
            return null
          })
        }
        {isTeaserHide &&
          <svg className={"arrow"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
            <path d="M12 4L12 20M12 20L18 14M12 20L6 14" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
          </svg>
        }
      </main>
    </>
  );
};

export default Content;