import {
  ActionBarActionButtonDescriptor,
  ActionBarClassicButtonDescriptor
} from '@workadventure/iframe-api-typings/front/Api/Iframe/Ui/ButtonActionBar';

async function initStopwatch(): Promise<void> {
  const stopWatchBtn: ActionBarActionButtonDescriptor = {
    id: 'stopwatch-btn',
    type: 'action',
    toolTip: '⏱ Stoppuhr starten',
    imageSrc:
      'data:image/png;base64,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',
    callback: async () => {
      console.log('stopwatch started');
      await WA.state.saveVariable('stopwatch-time', Date.now());
      WA.ui.actionBar.addButton(stopWatchEndBtn);
      WA.ui.actionBar.removeButton('stopwatch-btn');
    }
  };

  const stopWatchEndBtn: ActionBarActionButtonDescriptor = {
    id: 'stopwatchend-btn',
    type: 'action',
    toolTip: '⏱ Stoppuhr beenden',
    imageSrc:
      'data:image/png;base64,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',
    callback: async () => {
      console.log('stopwatch ended');
      await WA.state.saveVariable('stopwatch-time', null);
      WA.ui.actionBar.addButton(stopWatchBtn);
      WA.ui.actionBar.removeButton('stopwatchend-btn');
    }
  };

  const timeIndicator: ActionBarClassicButtonDescriptor = {
    id: 'clock-btn',
    label: '⏱ 00:00',
    callback: async (event) => {
      console.log('Button clicked');
    }
  };

  const currentState = await WA.state.loadVariable('stopwatch-time');

  if (WA.player.tags.includes('editor')) {
    if (currentState != null) {
      WA.ui.actionBar.addButton(stopWatchEndBtn);
    }
    if (currentState == null) {
      WA.ui.actionBar.addButton(stopWatchBtn);
    }
  }

  await initializeTimer(currentState, timeIndicator);

  WA.state.onVariableChange('stopwatch-time').subscribe(async (newValue) => {
    await initializeTimer(newValue, timeIndicator);
  });
}

let repeater: NodeJS.Timeout;
async function initializeTimer(
  newValue: null | number | unknown,
  timeIndicator: ActionBarClassicButtonDescriptor
) {
  console.log('stopwatch-time changed to', newValue);
  if (newValue != null) {
    timeIndicator.label = await calcTime();
    WA.ui.actionBar.addButton(timeIndicator);

    repeater = setInterval(async () => {
      timeIndicator.label = await calcTime();
      WA.ui.actionBar.removeButton('clock-btn');
      WA.ui.actionBar.addButton(timeIndicator);
    }, 30_000);
  } else {
    WA.ui.actionBar.removeButton('clock-btn');
    clearInterval(repeater);
  }
}
async function calcTime(): Promise<string> {
  // Get the difference in milliseconds
  const startTimestamp: number = (await WA.state.loadVariable(
    'stopwatch-time'
  )) as number;

  const diff = Date.now() - startTimestamp;

  // Convert the difference to hours and minutes
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  // Return the result in the format "HH:MM"
  return `⏱ ${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}`;
}
export { initStopwatch };
