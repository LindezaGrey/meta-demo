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

    bootstrapExtra().then(() => {
      console.log('Extra API ready');

      WA.room.onEnterLayer('Webhooks/workplaces').subscribe(() => {
        console.log('Player entered workplace');
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
          [{ label: 'OK', className: 'primary', callback: () => {} }]
        );
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
