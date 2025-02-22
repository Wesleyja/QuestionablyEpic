import moment from "moment";
import { fightDuration } from "General/Modules/CooldownPlanner/Functions/Functions";

export default function createGuardianEvents(bossID, difficulty, damageTakenData, debuffs, starttime, enemyHealth, enemyCasts, buffData) {
  let events = [];

  const unstableEnergy = 350455;
  const obliterate = 355352;
  const logGuids = damageTakenData.map((key) => key.ability.guid).concat(enemyCasts.map((key) => key.ability.guid));

  if (logGuids.includes(obliterate)) {
    const obliterateEvents = enemyCasts.filter((filter) => filter.ability.guid === obliterate);
    const threshold = 10000;
    events.push(
      obliterateEvents.map((key) => {
        return { time: moment.utc(fightDuration(key.timestamp, starttime)).startOf("second").format("mm:ss"), bossAbility: obliterate };
      })[0],
    );

    let lastChosen = obliterateEvents.map((key) => key.timestamp)[0];

    obliterateEvents.map((key) => {
      if (key.timestamp > lastChosen + threshold) {
        lastChosen = key.timestamp;
        events.push({ time: moment.utc(fightDuration(key.timestamp, starttime)).startOf("second").format("mm:ss"), bossAbility: obliterate });
      }
    });
  }

  if (logGuids.includes(unstableEnergy)) {
    const unstableEnergyEvents = damageTakenData.filter((filter) => filter.ability.guid === unstableEnergy);
    const threshold = 30000;
    events.push(
      unstableEnergyEvents.map((key) => {
        return { time: moment.utc(fightDuration(key.timestamp, starttime)).startOf("second").format("mm:ss"), bossAbility: unstableEnergy };
      })[0],
    );

    let lastChosen = unstableEnergyEvents.map((key) => key.timestamp)[0];

    unstableEnergyEvents.map((key) => {
      if (key.timestamp > lastChosen + threshold) {
        lastChosen = key.timestamp;
        events.push({ time: moment.utc(fightDuration(key.timestamp, starttime)).startOf("second").format("mm:ss"), bossAbility: unstableEnergy });
      }
    });
  }

  return events;
}
