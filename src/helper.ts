import { ButtonDescriptor, Popup } from '@workadventure/iframe-api-typings';

interface IPopupArea {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
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

export { createPopup };
