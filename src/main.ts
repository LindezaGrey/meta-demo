/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import axios from "axios";

console.log("Script started successfully");

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    console.log("Scripting API ready");
    console.log("Player tags: ", WA.player.tags);

    async function extendedFeatures() {
      try {
        await bootstrapExtra();
        console.log("Scripting API Extra loaded successfully");
      } catch (error) {
        console.error("Scripting API Extra ERROR", error);
      }
    }

    extendedFeatures();
    const notificationActive =
      (WA.state.loadVariable("notificationWebhookUrl") as string).length > 0;
    if (notificationActive) {
      console.info("Notification Webhook active");
      notificationWebhook();
    } else {
      console.info("Notification Webhook inactive");
      WA.state
        .onVariableChange("notificationWebhookUrl")
        .subscribe((newValue: unknown) => {
          if ((newValue as string).length > 0) {
            console.info("Notification Webhook active");
            notificationWebhook();
          } else {
            console.info("Notification Webhook inactive");
          }
        });
    }
    // addFeebackButton();

    WA.room.area.onEnter("clock").subscribe(() => {
      const today = new Date();
      const time = today.getHours() + ":" + today.getMinutes();
      currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    });

    WA.room.area.onEnter("keycode").subscribe(() => {
      const code = WA.state.loadVariable("doorCode");
      currentPopup = WA.ui.openPopup(
        "keycodePopup",
        `Der Code für die Tür lautet: ${code}`,
        [{ label: "OK", className: "primary", callback: () => {} }]
      );
    });

    WA.room.area.onLeave("clock").subscribe(closePopup);
    WA.room.area.onLeave("keycode").subscribe(closePopup);

    // day night cycle
    WA.state.onVariableChange("dayNightCycle").subscribe((newValue) => {
      console.log("dayNightCycle changed to", newValue);
      if (newValue === "night") {
        WA.room.showLayer("Night");
      }
      if (newValue === "day") {
        WA.room.hideLayer("Night");
      }
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
  const url = WA.state.loadVariable("notificationWebhookUrl") as string;

  const data = {
    payload: { name: WA.player.name, metadata: WA.metadata },
  };
  try {
    axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Webhook response", response);
      })
      .catch((error) => {
        console.error("Webhook error", error);
      });
  } catch (error) {
    console.log("Webhook error", error);
  }
}

// const addFeebackButton = () => {
//     if(WA.player.state.hasFeedback) return;
//     WA.ui.actionBar.addButton({
//         id: 'feedback-btn',
//         // @ts-ignore
//         type: 'action',
//         imageSrc: 'https://backup-workadventure-db-prod.s3.eu-west-1.amazonaws.com/logo/workadventure-rate-white.svg',
//         toolTip: 'Feedback',
//         callback: (event) => {
//             console.log('Button feedback triggered', event);
//         }
//     });
// }

export {};
