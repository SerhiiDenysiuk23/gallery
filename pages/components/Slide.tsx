import React, {CSSProperties, FC, useEffect, useState} from 'react';
import Img from "@/pages/components/Img";
import Video from "@/pages/components/Video";


const imageExt = ['jpg', 'jpeg', 'png', 'gif', 'webp']
const videoExt = ['mp4', 'mov', 'avi', 'mkv']

interface Props {
  fileNames: string[],
  setIsLoadData: () => void
  setSlideRef: (el: HTMLDivElement | null) => void
  isHidden: boolean
}

const Slide: FC<Props> = ({fileNames, setIsLoadData, setSlideRef, isHidden}) => {
  const [isLoaded, setIsLoaded] = useState<boolean[]>([]);
  const [fileList, setFileList] = useState<string[]>([]);

  useEffect(() => {
    setFileList(fileNames);
  }, [fileNames]);

  useEffect(() => {
    if (fileList.length > 0 && fileList.length === isLoaded.length) {
      setIsLoadData();
    }
  }, [isLoaded.length, fileList.length]);

  const handleIsLoaded = () => {
    setIsLoaded((prevState) => [...prevState, true]);
  };

  const setStyles = (): CSSProperties => {

    const isOnlyVideos = fileList.reduce((acc: boolean, item: string) => {
      const fileParts = item.split(".");
      const fileExtension =
        fileParts.length > 1 ? fileParts[fileParts.length - 1].toLowerCase() : "";
      return acc && videoExt.includes(fileExtension);
    }, true)

    if (fileList.length === 1 || isOnlyVideos)
      return {justifyContent: "center"}
    else return {justifyContent: "space-between", gap: "1em"}

  }

  return (
    <div
      style={setStyles()}
      className={`slide ${isHidden ? "hidden" : ""}`}
      ref={(el) => {
        setSlideRef(el)
      }}>

      {fileList.map((item) => {
        const fileParts = item.split(".");
        const fileExtension =
          fileParts.length > 1 ? fileParts[fileParts.length - 1].toLowerCase() : "";

        return (
          <React.Fragment key={item}>
            {imageExt.includes(fileExtension) ? (
              <Img
                key={item}
                maxWidth={100 / fileList.length}
                isLoaded={handleIsLoaded}
                src={`/media/${item}`}
              />
            ) : (
              <Video
                key={item}
                maxWidth={100 / fileList.length}
                isLoaded={handleIsLoaded}
                src={`${item}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Slide;