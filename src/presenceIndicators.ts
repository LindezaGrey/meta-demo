import { ActionBarActionButtonDescriptor } from '@workadventure/iframe-api-typings/front/Api/Iframe/Ui/ButtonActionBar';

async function initPresence(): Promise<void> {
  // Player Presence

  const afkBtn: ActionBarActionButtonDescriptor = {
    id: 'afk-btn',
    type: 'action',
    toolTip: '⏳ Status auf AFK setzen',
    imageSrc:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAeCAYAAABNChwpAAAAAXNSR0IArs4c6QAAA+9JREFUWEfNl19sWlUcx7+3vay0FzqU2bUspaUrCDVxW6MdzDF1D2t1f6qp8jKNe7IvanzSh8WHvRgfXBazRcOMMcaYxbjN6dJuy2ZiZVK2rNo2jguFwXZLWR2WNiWsBXo5y0UxQIF7wSbz8HJy/vy+n9/v/O75cSg85EYV03+z19pCUQivJRsh0Jy85LhbaLMowGCf9dajSqZjLQGisXjAftGxWRKAsGiwz0rWEsB+0VHU2aKDWeGR31jS0WkoykEIkCUs1w/cmsKep00ldcoCXLnBjj1uMHTnEqRz4pIrnDue2/f7fZ4XeoymUtEUAXC/pG3Vfi+X14t7C0AAyjahn0wsYYYLvdprNp6uCkDYNDLuJe26TpTysDAiwh4i/AjA3Q5gz1OGsk6WnRSMXb7OhjoN+k0rM648J/IyNNfzf1alm80I+P2Le83G9eWSWRRA2HzlBkta/R/B0KaW9GH4uCj8be/jRXPp5MsakgQw7HK/q2xcf2zj2FvQb2osC3HnXhzhbScQic5/1W8xHRIjlgQgGLngYj9RKJXvNPmPoZn3orE+33QilUYwrkZk28eYj0Yn+3eYtoiJC/OSAYTFPzrZfbJa6ny7rg2135mh1zAZDV84jsTLV8FNh8EjffjAdtOHUsQrBsgaHXJ55gmgMozuBV0LuHuGQAiJ77eYFFKFK8qBYkbPj7ITBv/hJ7EYxFT3qTP7LcZXKhWvKgJnr7FqGaHuMYyiRuP+ANT9WQS32rG8FOepNPVI/05jrBKQynLAxTrpGtrSotVlNNaNvgc6EUHs2S8zF0+YCwL8ykT/M6atUiEkA/zg9MQ2bGxRNDBMRiwNQO75AvSCG7HtRzN6wvhyMoHZEAebVfwOkHwE55yeC+qmlr565u+sz4o1eD4HHZ3EguX4v+PC1ZxMJfHXDDcxsNMoGgnRCAwP++p4NZaFsBcWG8Z7EvTcOOYtnxYUK4IwdweEX2yy7eqOlDsOUYCzV9nl1g59Xdbr3Bqg8NozAFHLZxk4oQgJLVuguICPHHyuq+Y/AZwb9RKNdnPRcsz8cRTyuTFEdn2TVy0FwZU0EAlzQGiMttlsfCmIshE4/evN15o17V/Tsjoo3Mchmx5aZaeGIkiTfDOJDT2Y23IE/EoKf04H3z74/BMnqgI443Df1egMzaqfBmBsLHuUq+xPzaYw3efETNC39MburoaqAL79hSWtOj1Ml7ugKig+Yt85nwZ+3nEToaAPh3Z3Vfef8NQIS7SPyWEZ7wUlmq6rkX5XvI5JZqA6gMFea2CdUtUuI/cpGVkSc7jofIqvRUqmIsnYwm37JUfRd8b/82Hy0J9mVcW7yk0PAFfnpS5aal2iAAAAAElFTkSuQmCC',
    callback: async () => {
      WA.controls.disablePlayerProximityMeeting();

      await WA.player.setOutlineColor(255, 0, 0);

      WA.ui.actionBar.removeButton('afk-btn');
      WA.ui.actionBar.addButton(backBtn);
    }
  };
  const backBtn: ActionBarActionButtonDescriptor = {
    id: 'back-btn',
    type: 'action',
    toolTip: '👋 Wieder zurück im Office',
    imageSrc:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAeCAYAAABNChwpAAAAAXNSR0IArs4c6QAABZNJREFUWEetll1oHFUUx/93Zjb7nd2d2aQmbU3IR2Mp2oeKglCFqYhFClol6qYPKoKgIH3xQUQQH0T6Ir7qQwXbjYitrUIlVSaxLYL0TaRGbZukH6ZpdmZ3s5v9mOzcK3c+mkk2W5PUC8ty7957z++c8z/nLsE9jr1793acP39+frPXkM0e9M6pqvoHgAcAMEmS4mfPnl3cyJ0bAmDjkIxZDMkZXCIA8xtSVfVxAD9TSlMTExOF9UK0BBj/ANKDO/ApBUY7M7jA57uHyFL79h4Ur01DkqAkhmHs37+/vV6vFwGcIoScYox9oWnauh1ruVHPgskDQ6jOz6FWLIwTgtfi23qmxGDYds64PIk2CZ3xYczv2bMnkEgkTAC/AHhM0zSRMTBjFJTvVTJoaaflD/mvAyzZ228bq+XmUCnkfwPwkDzA0+0MDiEyyMkR5PlcVVU7LaZpyqffvGDIXWmANpCbLYx0HEJ2rbS0jsAoFlO9AxEiSg6EfhuVvDENoNcPkb/6F0SBDiaGcdlvoPZDigXDATCziuJ8qTc1gpkNAfDNehZmsrc/IEgB+6xZKqA0d+sKAfpXQFz5E8xiu5RDuOQZqZ5JsFAkiGqpjFq1kpSHwXXSNNaMAM9/NN2JxdztBld7sm8wQATRhSiiPDergxBF7h9akQ4C7JYz4KmC8ZXAUl0dMKt1LC4UeuRhXFsXgD6Ko3Lf0CsgDhvPMx9ckHC1ZNVrKF7n2eDrPk3wSDC2M53BpC3irVsAawnGLaOlEJsioB9Du9AmFZO9Ayu845NU3yC8SFi1Koo3ZkAIQcqLBLNQnJlCw2o8SRh+krs7bRFuCMD2Oot3pFDoSHxb7xoQO0AEwV6nS3UUZqaWIegSYDVgzMwgEGxDXE4AzIINW6i+oGRwYnUaWlZBIYvXxWj081jX9iYIO/duipjVAKMUgiQC1HI8nrkGO/x8zijQMGHkykzJwCH3jSaAf75HJFiC088JTgZj8YPRLVubIXy5t39kDdt7bnAZwF2jFgpGBckXqUDIyhberAEunv5BgIgoTP0Nalm/hpPyo+F0ZwsI5njpes+/jes3YTchb90y7SgZRv1iegSP3DUC+ihOJLbef1AMBv0QCLUnEOnsunOWNpYgiLw0mc84tXNemJ1DsiO1vM54aiwYebOpGtbUQO44Ftu7uyOBSNQ2mJ++CmZZiCgKQqkO24ijQu+7sTynDXu9VlxAKBa2y9CDXDIpSouNp5QMfvQ8uVsrno1v6bovEHYen4WbN9AwTch9/QBzX2JubDWIKzxeenI65sDa6XE+egnfpjM42ASgquo5URRfopSqjLEv+ZOqZ/F7NK3sCkajAHEFzPPqDQ7C597HUz21QJdM2NVKuT4ccXJwo4RJJYOdTQD79u17izF2RNO0KH/VGGNvjI+Pf5bLYiKWSj4RjMdWGraVz8vMi4ZbcncguFG/QJ105ct4T34ZH62ZAvc5PacoiqrrOo+vqWlaUM9isi0cGorxxrJ6eAa9VNhzn0a88AMo1wTcmqWhwbdRb6kBVVXLALj6OMBN/k9H07TDehbfBCPh56MJR5i2sPzeewC2cV4ZXmm6MLzDlmApGTjvuztailBV1VcJIbIkSUfHxsYMvl/P4pO2NulwLBV3cmpzeDrwee0PvWsoXyaoxVi0+wAq6wJojrWzoo/iQ0kg77eneCRc47b3HMjtCV403EsW6wQ1k32czuDd1feu+8+j/2DuGJ4TRJxMyWFfL1jVG9wDpiWgXKE5JYOOtZzaFAC/aH4UD4tEuJiKu1d4TclnpVIHaibGlAyebhXRTQPwC/PH0UMJpmMRAW3icn9oWAQLFQaL4ZnOEZxpZZyv3xOAd7GRxQEGfOfNGcOz6RGcvpvh/6yC9Rz+P/b8LxG4F5B/ARbvyT0Zp3MSAAAAAElFTkSuQmCC',
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
