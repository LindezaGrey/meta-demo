import { Popup } from '@workadventure/iframe-api-typings';
import { bootstrapExtra } from '@workadventure/scripting-api-extra';
import axios from 'axios';
import { createBranding, openTutorial } from './helper';
import { initPresence } from './presenceIndicators';
import { initQuitButton } from './quitButton';

console.log('Script started successfully');

let currentPopup: Popup | undefined = undefined;

// Waiting for the API to be ready
async function init() {
  try {
    await WA.onInit();
    console.group('Map Initialization');
    await bootstrapExtra();
    console.log('Extra API ready');
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags);
    console.log(WA.room);
    console.table(WA.metadata);
    console.groupEnd();

    const tutorialUrl: string = WA.state.loadVariable('tutorialUrl') as string;
    if (tutorialUrl && tutorialUrl.length > 0) {
      WA.ui.actionBar.addButton({
        id: 'tutorial-btn',
        label: 'Tutorial',
        callback: async (event) => {
          console.log('Button clicked', event);
          openTutorial(tutorialUrl);
        }
      });
    }

    await initQuitButton();
    await initPresence();

    WA.room.onEnterLayer('Webhooks/workplaces').subscribe(() => {
      const notificationActive =
        (WA.state.loadVariable('notificationWebhookUrl') as string).length > 0;
      if (notificationActive) {
        notificationWebhook();
      }
    });

    WA.room.area.onEnter('clock').subscribe(() => {
      const today = new Date();
      const time = today.getHours() + ':' + today.getMinutes();
      currentPopup = WA.ui.openPopup('clockPopup', "It's " + time, []);
    });

    WA.room.area.onEnter('keycode').subscribe(() => {
      const code = WA.state.loadVariable('doorCode');
      currentPopup = WA.ui.openPopup(
        'keycodePopup',
        `Der Code für die Tür lautet: ${code}`,
        [
          {
            label: 'OK',
            className: 'primary',
            callback: (popup) => {
              popup.close();
            }
          }
        ]
      );
    });

    WA.room.area.onEnter('meetingRoomDetection').subscribe(() => {
      console.log('Player entered MeetingRoom');
      WA.room.hideLayer('MeetingRoom');
    });
    WA.room.area.onLeave('meetingRoomDetection').subscribe(() => {
      WA.room.showLayer('MeetingRoom');
    });

    WA.room.area.onLeave('clock').subscribe(closePopup);
    WA.room.area.onLeave('keycode').subscribe(closePopup);

    // day night cycle
    WA.state.onVariableChange('dayNightCycle').subscribe((newValue) => {
      console.log('dayNightCycle changed to', newValue);
      if (newValue === 'night') {
        WA.room.showLayer('Night');
      }
      if (newValue === 'day') {
        WA.room.hideLayer('Night');
      }
    });

    // tab or website
    const variableToWatch = [
      {
        variable: 'cabinetOpenMode',
        url: 'cabineturl',
        layer: 'cabineturlzone'
      },
      {
        variable: 'whiteboardOpenMode',
        url: 'whiteboardurl',
        layer: 'whiteboardurlzone'
      },
      {
        variable: 'infoOpenMode',
        url: 'infourl',
        layer: 'infourlzone'
      },
      {
        variable: 'trainingRoomOpenMode',
        url: 'trainingRoomUrl',
        layer: 'yogazone'
      }
    ];

    variableToWatch.forEach(async (element) => {
      // Execute the code immediately
      await changeWebsiteProps(element);
      // Subscribe to variable changes and execute the code on change
      WA.state.onVariableChange(element.variable).subscribe(async () => {
        await changeWebsiteProps(element);
      });
    });

    await createBranding('wallBrandingArea', 'brandingWallUrl', 'leftUpper');
    await createBranding('roomBrandingArea', 'meetingWallUrl', 'meetingRoom');
  } catch (e) {
    console.error('Error while initializing the script', e);
  }
}

async function changeWebsiteProps(element: {
  variable: string;
  url: string;
  layer: string;
}) {
  const newValue = WA.state.loadVariable(element.variable) as string;
  const url = WA.state.loadVariable(element.url) as string;
  // const map = await WA.room.getTiledMap();
  // console.log(map);
  if (newValue === 'openWebsite') {
    WA.room.setProperty(element.layer, 'openTab', undefined);
    WA.room.setProperty(element.layer, 'openWebsite', url);
  }
  if (newValue === 'openTab') {
    WA.room.setProperty(element.layer, 'openWebsite', undefined);
    WA.room.setProperty(element.layer, 'openTab', url);
  }
}

function closePopup() {
  if (currentPopup !== undefined) {
    currentPopup.close();
    currentPopup = undefined;
  }
}

function notificationWebhook() {
  const url = WA.state.loadVariable('notificationWebhookUrl') as string;

  const data = {
    payload: { name: WA.player.name, metadata: WA.metadata }
  };
  try {
    axios
      .post(url, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        console.log('Webhook response', response);
      })
      .catch((error) => {
        console.error('Webhook error', error);
      });
  } catch (error) {
    console.log('Webhook error', error);
  }
}

// const addBellButton = () => {
//     WA.ui.actionBar.addButton({
//         id: 'feedback-btn',
//         // @ts-ignore
//         type: 'action',
//         imageSrc: 'https://www.citypng.com/public/uploads/preview/white-notification-bell-icon-transparent-background-11638985030nycenfyruw.png',
//         toolTip: 'Anwesenheit melden',
//         callback: (event) => {
//             console.log('Button feedback triggered', event);
//             currentPopup = WA.ui.openPopup("keycodePopup",
//             `gesendet`,
//             [{ label: "OK", className: "primary", callback: () => {closePopup()} }])
//             notificationWebhook();
//         }
//     });
// }
init();
export {};
