import { ButtonDescriptor, Popup } from '@workadventure/iframe-api-typings';

interface IBasicCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface IPopupArea extends IBasicCoordinates {
  name: string;
  message: string;
  buttons?: ButtonDescriptor[];
}

const offsetY: number = 150;

let seenNames: string[] = [];
let activePopup: Popup | null = null;

function generateAreaId(str: string): string {
  const regex = new RegExp(`${str}-([0-9]+)`);
  let highestNum = -1;

  // Find the highest number in the existing list with the same prefix
  for (let i = 0; i < seenNames.length; i++) {
    const match = regex.exec(seenNames[i]);
    if (match && parseInt(match[1]) > highestNum) {
      highestNum = parseInt(match[1]);
    }
  }

  // Generate a new string with the incremented number and add it to the list
  const newStr = `${str}-${highestNum + 1}`;
  seenNames = seenNames.filter((item) => {
    item !== `${str}-${highestNum}`;
  });

  seenNames.push(newStr);
  return newStr;
}

async function createPopup(popup: IPopupArea) {
  if (activePopup) {
    activePopup.close();
    activePopup = null;
  }
  const saveAreaId = generateAreaId(popup.name);
  console.log(seenNames);
  WA.room.area.create({
    name: saveAreaId,
    x: popup.x - popup.width / 2,
    y: popup.y - offsetY,
    width: popup.width,
    height: popup.height
  });

  // default close button
  const buttons: ButtonDescriptor[] = popup.buttons || [];
  buttons.push({
    label: 'Schließen',
    className: 'error',
    callback: async (p) => {
      await WA.room.area.delete(saveAreaId);
      p.close();
      activePopup = null;
    }
  });
  activePopup = WA.ui.openPopup(saveAreaId, popup.message, buttons);
}

async function createBranding(
  coords: IBasicCoordinates,
  WAvariable: string,
  iframeName: string
) {
  const brandingWallUrl = WA.state.loadVariable(WAvariable) as string;

  const brandingWall = WA.room.website.create({
    name: `${iframeName}-iframe`,
    url: brandingWallUrl,
    position: {
      x: coords.x,
      y: coords.y,
      width: coords.width,
      height: coords.height
    },
    visible: true,
    allowApi: false,
    allow: '',
    origin: 'map',
    scale: 1
  });
  WA.state.onVariableChange(WAvariable).subscribe((newValue) => {
    brandingWall.url = newValue as string;
  });
}

export { createPopup, createBranding };
