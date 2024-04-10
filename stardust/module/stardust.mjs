// Import document classes.
import { StardustActor } from "./documents/actor.mjs";
import { StardustItem } from "./documents/item.mjs";
// Import sheet classes.
import { StardustActorSheet } from "./sheets/actor-sheet.mjs";
import { StardustItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { rollLevelToDice,rollLevelImagePath,maxDiceNumber,solveSkillRoll,solveDefenseRoll, rollLevelToTraining } from  "./helpers/utility.mjs";
import { STARDUST } from "./helpers/config.mjs";
import { safeNumber } from "./helpers/utility.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.stardust = {
    StardustActor,
    StardustItem,
    rollItemMacro
  };

  // Add custom constants for configuration.
  CONFIG.STARDUST = STARDUST;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 1
  };
  // Default cone angle
  CONFIG.MeasuredTemplate.defaults.angle = 90;

  // Define custom Document classes
  CONFIG.Actor.documentClass = StardustActor;
  CONFIG.Item.documentClass = StardustItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("stardust", StardustActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("stardust", StardustItemSheet, { makeDefault: true });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper('concat', function() {
  var outStr = '';
  for (var arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      outStr += arguments[arg];
    }
  }
  return outStr;
});

Handlebars.registerHelper('compare', function(a,b) {
  return a == b;
});

Handlebars.registerHelper('doesnocompare', function(a,b) {
  return a != b;
});

Handlebars.registerHelper('notNull', function(val) {
  return val != null;
});

Handlebars.registerHelper('notZero', function(val) {
  val = safeNumber(val);
  return parseFloat(val) != 0;
});

Handlebars.registerHelper('isZero', function(val) {
  val = safeNumber(val);
  return parseFloat(val) == 0;
});

Handlebars.registerHelper('plusOne', function(val) {
  val = safeNumber(val);
  return val + 1;
});

Handlebars.registerHelper('notOne', function(val) {
  if(isNaN(val) || val == null) val = 1;
  return parseFloat(val) != 1;
});

Handlebars.registerHelper('notUnderZero', function(val) {
  val = safeNumber(val);
  return parseFloat(val) >= 0;
});

Handlebars.registerHelper('underZero', function(val) {
  val = safeNumber(val);
  return parseFloat(val) < 0;
});

Handlebars.registerHelper('overZero', function(val) {
  val = safeNumber(val);
  return parseFloat(val) > 0;
});

Handlebars.registerHelper('overOne', function(val) {
  val = safeNumber(val);
  return parseFloat(val) > 1;
});

Handlebars.registerHelper('overTwo', function(val) {
  val = safeNumber(val);
  return parseFloat(val) > 2;
});

Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

Handlebars.registerHelper('rollLevel', function(val) {
  return rollLevelToDice( safeNumber(val))
});

Handlebars.registerHelper('rollTraining', function(val) {
  return rollLevelToTraining( safeNumber(val))
});

Handlebars.registerHelper('rollImage', function(val) {
  return rollLevelImagePath( safeNumber(val))
});

Handlebars.registerHelper('localizestardust', function(key) {
  return game.i18n.localize(CONFIG.STARDUST.translate[key]) ?? key;
});

Handlebars.registerHelper('rollskill', function( actor, baseskill, trainingval) {
  return solveSkillRoll( actor, baseskill, trainingval)
});

Handlebars.registerHelper('skillTrainingImages', function( actor, baseskill, trainingval) {
  var secondhalf = ""
  if(trainingval > 0)
  {
    secondhalf = " + <div class=\"" + rollLevelImagePath(trainingval) + "\"></div>"
  }
  return "<div class=\"" + rollLevelImagePath(actor.system.attributes[baseskill]) + "\"></div>" + secondhalf
});

Handlebars.registerHelper('initiativeImages', function( agility, mind) {
  return "<div class=\"" + rollLevelImagePath(agility) + "\"></div> + <div class=\"" + rollLevelImagePath(mind) + "\"></div>"
});

Handlebars.registerHelper('defenseImage', function() {
  if(safeNumber(this.actor.system.currentarmor) == 0)
    return "8"
  return "8 + <div class=\"" + rollLevelImagePath( safeNumber(this.actor.system.currentarmor) ) + "\"></div>"
});

Handlebars.registerHelper('rolldefense', function() {
  return solveDefenseRoll( this.actor)
});

Handlebars.registerHelper('maxwounds', function() {
  return maxDiceNumber(this.actor.system.attributes[this.actor.system.woundattribute]) - safeNumber(this.actor.system.contamination)
});

Handlebars.registerHelper('maxmortaltrauma', function() {
  return 3; // Hardcoded naughtyness - can fix later if this ever needs to be configured
});

Handlebars.registerHelper('getdiceindexes', function() {
  return CONFIG.STARDUST.dicetoindex
});

Handlebars.registerHelper('gettrainingindexs', function() {
  return CONFIG.STARDUST.trainingtoindex
});

Handlebars.registerHelper('getskilllist', function() {
  return CONFIG.STARDUST.skilldatalist
});

Handlebars.registerHelper('getattributecolor', function(val) {
  return CONFIG.STARDUST.attributecolor[val]
});

Handlebars.registerHelper('getSpeed', function() {
  return (maxDiceNumber(this.system.attributes["agility"]) * 5) + "ft"
});

Handlebars.registerHelper('getPsiMemory', function() {
  return maxDiceNumber(this.system.attributes["mind"])
});

Handlebars.registerHelper('getBulkTotal', function() {
  return safeNumber(this.system.bulk) * safeNumber(this.system.quantity)
});

// unfuck selects
Handlebars.registerHelper('dropdown', function(keyValueList, selected, pathName, pathKeyName, pathsuffix) {
  var ret = '';
  ret = '<select name=\"' + pathName + pathKeyName + pathsuffix + '\">';
  for(var key in keyValueList){
      var isselected = (keyValueList[key].toString()===selected) ? "selected " : "";
      ret += '<option '+isselected+'value="'+keyValueList[key]+'">'+(game.i18n.localize(CONFIG.STARDUST.translate[key]) ?? key)+'</option>';
  }
  ret += '</select>';
  return ret;
});

Handlebars.registerHelper('getBulkPercent', function() {
  if(this.system.maxBulk == 0)
    return 0
  var val = safeNumber(this.system.currentBulk) / safeNumber(this.system.maxBulk)
  if(val < 0) val = 0
  if(val > 1) val = 1
  return val * 100.0
});

Handlebars.registerHelper('getBulkPercentUnclamped', function() {
  if(this.system.maxBulk == 0)
    return 0
  var val = safeNumber(this.system.currentBulk) / safeNumber(this.system.maxBulk)
  return val * 100.0
});

Handlebars.registerHelper('getMemoryPercent', function() {
  var val = safeNumber(this.system.currentMemoryUsed) / maxDiceNumber(this.system.attributes["mind"])
  if(val < 0) val = 0
  if(val > 1) val = 1
  return val * 100.0
});
Handlebars.registerHelper('getMemoryPercentUnclamped', function() {
  var val = safeNumber(this.system.currentMemoryUsed) / maxDiceNumber(this.system.attributes["mind"])
  return val * 100.0
});

Handlebars.registerHelper('invertedBulkPercent', function() {
  if(this.system.maxBulk == 0)
    return 0
  var val = safeNumber(this.system.currentBulk) / safeNumber(this.system.maxBulk)
  if(val < 0) val = 0
  if(val > 1) val = 1
  return 100.0 - (val * 100.0)
});

Handlebars.registerHelper('invertedMemoryPercent', function() {
  var val = safeNumber(this.system.currentMemoryUsed) / maxDiceNumber(this.system.attributes["mind"])
  if(val < 0) val = 0
  if(val > 1) val = 1
  return 100.0 - (val * 100.0)
});


/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== "Item") return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn("You can only create macro buttons for owned Items");
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.stardust.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "stardust.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then(item => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(`Could not find item ${itemName}. You may need to delete and recreate this macro.`);
    }

    // Trigger the item roll
    item.roll();
  });
}
