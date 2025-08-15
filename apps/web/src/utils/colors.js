export function getBarColor(today, daStart, daFinish) {
  const startDiff = (daStart - today) / (1000 * 60 * 60 * 24 * 365);
  const finishDiff = (today - daFinish) / (1000 * 60 * 60 * 24 * 365);

  if (today > daFinish) {
    return `rgba(255,0,0,${Math.min(1, finishDiff / 10)})`;
  } else if (today < daStart) {
    return `rgba(255,255,0,${Math.min(1, Math.abs(startDiff) / 10)})`;
  } else {
    const midPoint = (daStart + daFinish) / 2;
    const distanceFromMid = Math.abs(today - midPoint) / ((daFinish - daStart) / 2);
    return `rgba(0,128,0,${1 - Math.min(distanceFromMid, 1)})`;
  }
}

export function getDrinkWindowColor({ Start, Finish }) {
  const today = new Date().getFullYear();
  if (today < Start) {
    return `rgba(255,255,0,${Math.min(1, (Start - today) / 10)})`;
  } else if (today > Finish) {
    return `rgba(255,0,0,${Math.min(1, (today - Finish) / 10)})`;
  } else {
    const midPoint = (Start + Finish) / 2;
    const distanceFromMid = Math.abs(today - midPoint) / ((Finish - Start) / 2);
    return `rgba(0,128,0,${1 - Math.min(distanceFromMid, 1)})`;
  }
}
