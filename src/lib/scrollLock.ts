let lockCount = 0;
let bodyOverflow = "";
let htmlOverflow = "";

export function lockBodyScroll(): void {
  lockCount += 1;
  if (lockCount === 1) {
    bodyOverflow = document.body.style.overflow;
    htmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }
}

export function unlockBodyScroll(): void {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = bodyOverflow;
    document.documentElement.style.overflow = htmlOverflow;
    bodyOverflow = "";
    htmlOverflow = "";
  }
}
