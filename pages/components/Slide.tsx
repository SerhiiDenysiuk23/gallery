import React, {FC, useEffect, useState} from 'react';
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
  const [fileList, setFileList] = useState<string[]>(fileNames ?? [])

  useEffect(() => {
    setFileList(fileNames)
  }, [fileNames]);

  useEffect(() => {
    if (fileList && isLoaded.length === fileList.length) {
      setIsLoadData();
    }
  }, [isLoaded.length]);

  const handleIsLoaded = () => {
    setIsLoaded(prevState => [...prevState, true])
  }



  return (
      <>
      {
        fileList.map(item => {
          const fileParts = item.split(".");
          const fileExtension = fileParts.length > 1 ? fileParts[fileParts.length - 1].toLowerCase() : '';

          return (
            imageExt.includes(fileExtension)
              ? <Img key={item} maxWidth={100 / fileList.length} isLoaded={handleIsLoaded} src={`/media/${item}`}/>
              : <Video key={item} maxWidth={100 / fileList.length} isLoaded={handleIsLoaded} src={`${item}`}/>
          )
        })
      }
      </>
  );
};

export default Slide;