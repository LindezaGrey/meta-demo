import { ActionBarClassicButtonDescriptor } from '@workadventure/iframe-api-typings/front/Api/Iframe/Ui/ButtonActionBar';

async function initPresence(): Promise<void> {
  // Player Presence

  const afkBtn: ActionBarClassicButtonDescriptor = {
    id: 'afk-btn',
    label: '⏳ AFK',
    callback: async () => {
      WA.controls.disablePlayerProximityMeeting();

      await WA.player.setOutlineColor(255, 0, 0);

      WA.ui.actionBar.removeButton('afk-btn');
      WA.ui.actionBar.addButton(backBtn);
    }
  };
  const backBtn: ActionBarClassicButtonDescriptor = {
    id: 'back-btn',
    label: '👋 Back',
    callback: async () => {
      WA.controls.restorePlayerProximityMeeting();

      await WA.player.removeOutlineColor();

      WA.ui.actionBar.removeButton('back-btn');
      WA.ui.actionBar.addButton(afkBtn);
    }
  };

  WA.ui.actionBar.addButton(afkBtn);
}

export { initPresence };
