import { createPopup } from './helper';

async function startChallenge() {
  const pos = await WA.player.getPosition();
  console.log(WA.player.state.loadVariable('stage'));
  await createPopup({
    x: pos.x,
    y: pos.y,
    width: 300,
    height: 100,
    name: 'welcome',
    message: 'Willkommen bei der Intro Challenge!',
    buttons: [
      {
        label: 'Win',
        className: 'normal',
        callback: async (p) => {
          WA.player.setOutlineColor(212, 175, 55);
          await passStageOne();
          //   console.log(await WA.player.getWokaPicture());
          p.close();
        }
      }
    ]
  });
}

async function passStageOne() {
  await WA.player.state.saveVariable('stage', 1, {
    public: true,
    persist: true
  });
}

export { startChallenge };
