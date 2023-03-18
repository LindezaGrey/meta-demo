/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from '@workadventure/scripting-api-extra';
import axios from 'axios';

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags);
    console.table(WA.metadata);

    // WA.ui.modal.openModal(
    //   {
    //     title: 'WorkAdventure website',
    //     src: 'https://workadventu.re',
    //     allow: 'fullscreen',
    //     allowApi: true,
    //     position: 'center'
    //   },
    //   () => {
    //     console.info('The modal was closed');
    //   }
    // );

    bootstrapExtra().then(() => {
      console.log('Extra API ready');

      WA.room.onEnterLayer('Webhooks/workplaces').subscribe(() => {
        const notificationActive =
          (WA.state.loadVariable('notificationWebhookUrl') as string).length >
          0;
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
        }
      ];

      variableToWatch.forEach((element) => {
        WA.state.onVariableChange(element.variable).subscribe((newValue) => {
          const url = WA.state.loadVariable(element.url) as string;
          if (newValue === 'openWebsite') {
            WA.room.setProperty(element.layer, 'openTab', undefined);
            WA.room.setProperty(element.layer, 'openWebsite', url);
          }
          if (newValue === 'openTab') {
            WA.room.setProperty(element.layer, 'openWebsite', undefined);
            WA.room.setProperty(element.layer, 'openTab', url);
          }
        });
      });
    });
  })
  .catch((e) => console.error(e));

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

export {};
