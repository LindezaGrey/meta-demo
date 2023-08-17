import { Popup } from '@workadventure/iframe-api-typings';
import { bootstrapExtra } from '@workadventure/scripting-api-extra';
import { initPresence } from './presenceIndicators';
import { initQuitButton } from './quitButton';
import { initStopwatch } from './stopwatch';
import { openTutorial } from './helper';

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
    await initStopwatch();

    const pillars = [
      { areaName: 'pillar1Trigger', textVariable: 'Room1Text' },
      { areaName: 'pillar2Trigger', textVariable: 'Room2Text' },
      { areaName: 'pillar3Trigger', textVariable: 'Room3Text' },
      { areaName: 'pillar4Trigger', textVariable: 'Room4Text' },
      { areaName: 'pillar5Trigger', textVariable: 'Room5Text' },
      { areaName: 'pillar6Trigger', textVariable: 'Room6Text' },
      { areaName: 'pillar7Trigger', textVariable: 'Room7Text' }
    ];

    pillars.forEach((pillar) => {
      WA.room.area.onEnter(pillar.areaName).subscribe(async () => {
        currentPopup = WA.ui.openPopup(
          pillar.areaName,
          (await WA.state.loadVariable(pillar.textVariable)) as string,
          []
        );
      });
      WA.room.area.onLeave(pillar.areaName).subscribe(closePopup);
    });

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
