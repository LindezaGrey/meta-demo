import { ButtonDescriptor, Popup } from '@workadventure/iframe-api-typings';
import { ITiledMapGroupLayer } from '@workadventure/tiled-map-type-guard/dist/ITiledMapGroupLayer';
import { ITiledMapObjectLayer } from '@workadventure/tiled-map-type-guard/dist/ITiledMapObjectLayer';

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

// async function readPngFromUrl(url: string): Promise<string> {
//   // Make an HTTP request to the PNG file's URL using fetch
//   const response = await fetch(url, { mode: 'no-cors' });
//   // Read the file data as a binary string using FileReader
//   const blob = await response.blob();
//   const reader = new FileReader();
//   const fileDataPromise = new Promise<string>((resolve, reject) => {
//     reader.onloadend = () => {
//       const fileData = reader.result as string;
//       resolve(fileData);
//     };
//     reader.onerror = () => {
//       reject(reader.error);
//     };
//   });
//   reader.readAsBinaryString(blob);

//   // Encode the file data as a base64 string and return a Data URL
//   const fileData = await fileDataPromise;
//   const base64Data = btoa(fileData);
//   return `data:image/png;base64,${base64Data}`;
// }

async function createBranding(
  areaName: string,
  WAvariable: string,
  iframeName: string
) {
  // search the map for some area objects within configuration/branding to get the correct coordinates
  const map = await WA.room.getTiledMap();
  const configLayer = map.layers.find(
    (layer) => layer.name === 'configuration'
  ) as ITiledMapGroupLayer;

  const brandingLayer = configLayer.layers.find(
    (l) => l.name === 'branding'
  ) as ITiledMapObjectLayer;

  const pictureAreas = brandingLayer.objects.filter(
    (obj) => obj.class === 'area'
  );

  const area = pictureAreas.find((obj) => obj.name === areaName);
  const coords: IBasicCoordinates = {
    x: area?.x || 0,
    y: area?.y || 0,
    width: area?.width || 0,
    height: area?.height || 0
  };

  let brandingWallUrl = WA.state.loadVariable(WAvariable) as string;

  if (brandingWallUrl.length === 0) {
    // empty pixel so thaht the iframe is still there
    brandingWallUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }

  // if (brandingWallUrl.startsWith('http')) {
  //   brandingWallUrl = await readPngFromUrl(brandingWallUrl);
  // }

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

  WA.state.onVariableChange(WAvariable).subscribe(async (newValue) => {
    if ((newValue as string).length == 0) {
      brandingWallUrl =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      brandingWall.url = brandingWallUrl;
      return;
    }

    brandingWall.url = newValue as string;
  });
}
// https://workadventure.github.io/scripting-api-extra/tutorialv1.html
function openTutorial(tutorialUrl: string) {
  WA.ui.modal.openModal({
    title: 'Tutorial',
    src: tutorialUrl,
    allow: 'fullscreen; clipboard-read; clipboard-write',
    allowApi: true,
    position: 'right'
  });
}

export { createPopup, createBranding, openTutorial };
