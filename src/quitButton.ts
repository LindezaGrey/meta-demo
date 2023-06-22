import { ActionBarActionButtonDescriptor } from '@workadventure/iframe-api-typings/front/Api/Iframe/Ui/ButtonActionBar';

async function initQuitButton(): Promise<void> {
  const quitBtn: ActionBarActionButtonDescriptor = {
    id: 'quit-btn',
    type: 'action',
    toolTip: '🛑 Metaverse-Office verlassen',
    imageSrc:
      'data:image/png;base64,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',
    callback: async () => {
      const actionMessage = WA.ui.displayActionMessage({
        message: '👉 Hier klicken um das Metaverse-Office zu verlassen',
        callback: () => {
          WA.nav.goToPage('https://lindezagrey.github.io/meta-demo/close.html');
        },
        type: 'warning'
      });
      setTimeout(() => {
        actionMessage.remove();
      }, 3000);
    }
  };

  WA.ui.actionBar.addButton(quitBtn);
}

export { initQuitButton };
