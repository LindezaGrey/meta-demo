import { Popup } from '@workadventure/iframe-api-typings';
import { bootstrapExtra } from '@workadventure/scripting-api-extra';
import { initPresence } from './presenceIndicators';
import { initQuitButton } from './quitButton';

console.log('Scrum-Script started successfully');

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

    await initQuitButton();
    await initPresence();

    const pillars = [
      { areaName: 'pillar1Trigger', text: 'Vorstellung Basic Scrum Flow' },
      {
        areaName: 'pillar2Trigger',
        text: 'Vorstellung Sprint Planning inkl. Commitments & Artefakte'
      },
      {
        areaName: 'pillar3Trigger',
        text: 'Vorstellung Daily Scrum inkl. Commitments & Artefakte'
      },
      { areaName: 'pillar4Trigger', text: 'Vorstellung Sprint Review' },
      { areaName: 'pillar5Trigger', text: 'Vorstellung Sprint Retro' },
      { areaName: 'pillar6Trigger', text: 'Zusammenfassung Scrum Flow' },
      { areaName: 'pillar7Trigger', text: 'Vorstellung Scrum Team' }
    ];

    pillars.forEach((pillar) => {
      WA.room.area.onEnter(pillar.areaName).subscribe(() => {
        currentPopup = WA.ui.openPopup(pillar.areaName, pillar.text, []);
      });
      WA.room.area.onLeave(pillar.areaName).subscribe(closePopup);
    });
  } catch (e) {
    console.error('Error while initializing the script', e);
  }
}

function closePopup() {
  if (currentPopup !== undefined) {
    currentPopup.close();
    currentPopup = undefined;
  }
}

init();
export {};
