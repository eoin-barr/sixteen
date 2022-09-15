/* eslint-disable no-useless-return */
const POPUP_WIDTH = 60;
const POPUP_HEIGHT = 80;

const receiveMessage = (event: any) => {
  if (event.origin !== window.location.hostname) {
    return;
  }
};

const getPopUpFeatures = () => {
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width; // eslint-disable-line

  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height; // eslint-disable-line

  const systemZoom = width / window.screen.availWidth;
  const w = (POPUP_WIDTH * width) / 100;
  const h = (POPUP_HEIGHT * height) / 100;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;

  return `
  scrollbars=yes,
  width=${w / systemZoom},
  height=${h / systemZoom},
  top=${top},
  left=${left}
  `;
};

export const openGithubConnectWindow = (
  url: string,
  title: string,
  onClose?: () => void
) => {
  let previousUrl: any = null;
  let windowObjectReference: any = null;

  window.onclose =
    onClose ||
    (() => {
      console.log('window closed');
    });
  window.removeEventListener('message', receiveMessage);

  if (windowObjectReference === null || windowObjectReference.closed) {
    windowObjectReference = window.open(url, title, getPopUpFeatures());
  } else if (previousUrl !== url) {
    windowObjectReference = window.open(url, title, getPopUpFeatures());
    windowObjectReference.focus();
  } else {
    windowObjectReference.focus();
  }

  window.addEventListener('message', (event) => receiveMessage(event), false);
  previousUrl = url;
};
