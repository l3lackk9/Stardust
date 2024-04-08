import {safeNumber} from "../helpers/utility.mjs";
/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class StardustItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["stardust", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/stardust/templates/item";
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.html`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.
    return `${path}/item-${this.item.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = context.item;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;

    context.system.damagedata = ""
    context.system.typeisdata = ""
    context.system.traitsdata = ""
    for (let t in itemData.type) {
      if(safeNumber(itemData.type[t]) == 1)
      {
        context.system.typeisdata = (game.i18n.localize(CONFIG.STARDUST.translate[t]) ?? t)
      }
    }
    for (let t in itemData.system.traits) {
      if(safeNumber(itemData.system.traits[t]) == 1)
      {
        if(context.system.traitsdata.length > 0) 
        {
          context.system.traitsdata += ", "
        }
        else
        {
          context.system.traitsdata = "Traits: "
        }
        context.system.traitsdata += (game.i18n.localize(CONFIG.STARDUST.translate[t]) ?? t)
      }
    }

    if(safeNumber(itemData.system.damage) > 0)
    {
      context.system.damagedata = "Damage: " + safeNumber(itemData.system.damage) + " [" + context.system.typeisdata + "]";
    }

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here.
  }
}
