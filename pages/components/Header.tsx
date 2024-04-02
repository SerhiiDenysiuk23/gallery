import React, {useEffect, useState} from 'react';

const Header = () => {
  const [timerNum, setTimerNum] = useState(19)
  useEffect(() => {
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
  },[])
  return (
    <header>
      <div id={"timer"}>{timerNum}</div>
      <video id={'teaser'} autoPlay muted loop>
        <source src="/teaser%202024/teaser.mp4" type="video/mp4"/>
      </video>
    </header>
  );
};

export default Header;