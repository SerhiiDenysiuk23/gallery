import React, {FC, useEffect, useRef, useState} from 'react';
import Img from "@/pages/components/Img";
import Video from "@/pages/components/Video";


const imageExt = ['jpg', 'jpeg', 'png', 'gif', 'webp']
const videoExt = ['mp4', 'mov', 'avi', 'mkv']

interface Props {
  fileNames: string[],
  setIsLoadData: () => void
}

const Slide: FC<Props> = ({fileNames, setIsLoadData}) => {
  const [isLoaded, setIsLoaded] = useState<boolean[]>([])

  useEffect(() => {
    if (isLoaded.length === fileNames.length)
      setIsLoadData()
  }, [isLoaded, fileNames.length, setIsLoadData]);

  const handleIsLoaded = () => {
    setIsLoaded(prevState => [...prevState, true])
  }

  return (
    <div style={fileNames.length > 1
      ? {justifyContent: "space-between"}
      : {justifyContent: "center"}}
         className={"slide"}>
      {
        fileNames.map(item =>

            imageExt.includes(item.split(".")[1].toLowerCase())
              ? <Img key={item} maxWidth={100 / fileNames.length} isLoaded={handleIsLoaded} src={`/media/${item}`}/>
              : <Video key={item} maxWidth={100 / fileNames.length} isLoaded={handleIsLoaded} src={`/media/${item}`}/>
        )
      }
    </div>
  );
};

export default Slide;