const getDirection = (e: KeyboardEvent | WheelEvent | TouchEvent, startY?: number) => {
  switch (e.constructor.name) {
    case 'KeyboardEvent':
      const keyEvent = e as KeyboardEvent
      return  keyEvent.key === 'ArrowDown' ? 1 : keyEvent.key === 'ArrowUp' ? -1 : 0;
    case 'WheelEvent':
      const wheelEvent = e as WheelEvent
      return wheelEvent.deltaY > 0 ? 1 : -1;
    case 'TouchEvent':
      const touchEvent = e as TouchEvent
      return touchEvent.touches[0].clientY > startY! ? -1 : 1
    default:
      console.log("Undefined Event")
  }
}

const navEvent = (e: KeyboardEvent | WheelEvent | TouchEvent, sectionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>, startY?: number) => {
  const direction = getDirection(e, startY) ?? 0
  const windowHeight = window.innerHeight;
  const currentSectionIndex = sectionRefs.current.findIndex((section) => {
    if (!section) return false;
    const {top, bottom} = section.getBoundingClientRect();
    return top <= windowHeight / 2 && bottom >= windowHeight / 2;
  });
  const nextSectionIndex = currentSectionIndex + direction;
  if (nextSectionIndex >= 0 && nextSectionIndex < sectionRefs.current.length) {
    const nextSection = sectionRefs.current[nextSectionIndex];
    if (nextSection) {
      window.scrollTo({
        top: window.scrollY + nextSection.getBoundingClientRect().top,
        behavior: 'smooth'
      });
    }
  }
}

export {navEvent}