/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log(    'Player tags: ',WA.player.tags)

    async function extendedFeatures() {
        try {
            await bootstrapExtra()
            console.log('Scripting API Extra loaded successfully');
    
        } catch (error) {
            console.error('Scripting API Extra ERROR',error);
        }
    }

    extendedFeatures();
    
    // addFeebackButton();

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    WA.room.area.onEnter('keycode').subscribe(() => {
        currentPopup = WA.ui.openPopup("keycodePopup", "Der Code für die Tür lautet: 12345", [{label: "OK", className: "primary", callback: (popup) => {popup.close();}}]);
    })



    WA.room.area.onLeave('clock').subscribe(closePopup)
    WA.room.area.onLeave('keycode').subscribe(closePopup)


}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
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
