import {onManageActiveEffect, prepareActiveEffectCategories} from "../helpers/effects.mjs";
import {chatCardRoll,safeNumber,solveSkillRoll} from "../helpers/utility.mjs";


/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class StardustActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["stardust", "sheet", "actor"],
      template: "systems/stardust/templates/actor/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
    });
  }

  /** @override */
  get template() {
    if ( !game.user.isGM && this.actor.limited ) return "systems/stardust/templates/actor/actor-limited-sheet.html";
    return `systems/stardust/templates/actor/actor-${this.actor.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.actor.toObject(false);

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Prepare character data and items.
    const gear = [];
    const features = [];
    const spells = [];

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'item') {
        gear.push(i);
      }
      // Append to features.
      else if (i.type === 'feature') {
        features.push(i);
      }
      // Append to spells.
      else if (i.type === 'spell') {
        spells.push(i);
      }
    }

    // Assign and return
    context.gear = gear;
    context.features = features;
    context.spells = spells;
    
    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(this.actor.effects);

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });
    

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Rollable abilities.
    //html.find('.rollable').click(this._onRoll.bind(this));

    // Rollable abilities.
    function callDisplayRoll(event, owner, psionicsburned) {
      if(owner.type === "vehicle")
      {
        ui.notifications.error("Vehicles cannot use items, copy to pilot for use!");
        return
      }
      
      event.preventDefault();
      const a = event.currentTarget;
      const element = event.currentTarget;
      const dataset = element.dataset;

      // Handle item rolls. Probably should never get called, but okay.
      var item = null;
      if (dataset.rollType) {
        if (dataset.rollType == 'item') {
          const itemId = element.closest('.item').dataset.itemId;
          item = owner.items.get(itemId);
        }
      }
      if(item != null)
      {
        if(psionicsburned == 0)
        {
          if(item.type == "spell")
          {
            // psionics handled in a special way
            let label = dataset.label ? `${dataset.label}` : '';
            let d = new Dialog({
            title: label,
            content: "<p>Apply psionic stress?</p>",
            buttons: {
              yes: {
              label: "Yes",
              callback: () =>  callDisplayRoll(event, owner, 2) // magic number shit, actually burns
              },
              no: {
              label: "No",
              callback: () => callDisplayRoll(event, owner, 1) // magic number shit, doesn't burn but still casts
              }
            },
            default: "yes",
            render: html => {},
            close: html => {}
            });
            d.render(true);
            return
          }
  
          // backups for stuff that can't roll
          if(item.type != "item" || item.system.skill_req == "none")
          {
            item.roll()
            return
          }
        }

        if(item.type == "spell")
        {
          // assemble a roll based on something's psionics
          dataset.label = item.name + " [" + (game.i18n.localize(CONFIG.STARDUST.translate["psionics"]) ?? "psionics") + "]";
          dataset.roll = solveSkillRoll( owner, CONFIG.STARDUST.skillattribute["psionics"], owner.system.skills["psionics"].training)
          if(owner.system.stress > 0)
          {
            // show psionic stress in the roll!
            dataset.roll += " - " + owner.system.stress + "[Psionic Stress]";
          }
        }
        else
        {
          // assemble a roll based on something's training req
          dataset.label = item.name + " [" + (game.i18n.localize(CONFIG.STARDUST.translate[item.system.skill_req]) ?? item.system.skill_req) + "]";
          dataset.roll = solveSkillRoll( owner, CONFIG.STARDUST.skillattribute[item.system.skill_req], owner.system.skills[item.system.skill_req].training)
        }
      }

      // Handle contamination debug
      let contamination = "";
      if(safeNumber(owner.system.contamination) != 0)
      { 
        contamination = " -"+safeNumber(owner.system.contamination) + "[Contamination]";
      }
  
      // Handle rolls that supply the formula directly. Pretty much all of these are  going to be used for tohits anyway in combat checks
      let label = dataset.label ? `${dataset.label}` : '';
      let d = new Dialog({
      title: label,
      content: "<p>What is the situational modifier?</p>",
      buttons: {
        terrible: {
        label: "Terrible (-1d8)",
        callback: () => {
            chatCardRoll( dataset.roll + " - 1d8[Terrible]" + contamination, label, owner, item, owner.token, 0, true, 0)
            if(psionicsburned == 2) owner.update({["system.stress"]: safeNumber( owner.system.stress ) + 1});
          }
        },
        worse: {
        label: "Worse (-1d6)",
        callback: () => {
            chatCardRoll( dataset.roll + " - 1d6[Worse]" + contamination, label, owner, item, owner.token, 0, true, 0)
            if(psionicsburned == 2) owner.update({["system.stress"]: safeNumber( owner.system.stress ) + 1});
          }
        },
        bad: {
        label: "Bad (-1d4)",
        callback: () => {
            chatCardRoll( dataset.roll + " - 1d4[Bad]" + contamination, label, owner, item, owner.token, 0, true, 0)
            if(psionicsburned == 2) owner.update({["system.stress"]: safeNumber( owner.system.stress ) + 1});
          }
        },
        tiny: {
        label: "Good (+1d4)",
        callback: () => {
            chatCardRoll( dataset.roll + " + 1d4[Good]" + contamination, label, owner, item, owner.token, 0, true, 0)
            if(psionicsburned == 2) owner.update({["system.stress"]: safeNumber( owner.system.stress ) + 1});
          }
        },
        small: {
        label: "Great (+1d6)",
        callback: () => {
            chatCardRoll( dataset.roll + " + 1d6[Great]" + contamination, label, owner, item, owner.token, 0, true, 0)
            if(psionicsburned == 2) owner.update({["system.stress"]: safeNumber( owner.system.stress ) + 1});
          }
        },
        good: {
        label: "Amazing (+1d8)",
        callback: () => {
            chatCardRoll( dataset.roll + " + 1d8[Amazing]" + contamination, label, owner, item, owner.token, 0, true, 0)
            if(psionicsburned == 2) owner.update({["system.stress"]: safeNumber( owner.system.stress ) + 1});
          }
        },
        none: {
        label: "None",
        callback: () => {
            chatCardRoll( dataset.roll + contamination, label, owner, item, owner.token, 0, true, 0)
            if(psionicsburned == 2) owner.update({["system.stress"]: safeNumber( owner.system.stress ) + 1});
          }
        }
      },
      default: "none",
      render: html => {},
      close: html => {}
      });
      d.render(true);
    }
    html.find('.rollable').click(ev => callDisplayRoll(ev, this.actor, false));

    // item quantity add
    function itemQuantityModify( event, owner, modifier) {
      event.preventDefault();
      
      // get item data
      const li = $(event.currentTarget).parents(".item");
      const item = owner.actor.items.get(li.data("itemId"));

      // refresh
      var keyName = event.currentTarget.dataset.action;
      return item.update( {[keyName]: foundry.utils.getProperty(item, keyName) + modifier} );
    }
    html.find(".item-quantity-add").click(ev => itemQuantityModify(ev, this, +1));
    html.find(".item-quantity-sub").click(ev => itemQuantityModify(ev, this, -1));



    function toggleTraitEnable(event, owner) {
      event.preventDefault();
      const a = event.currentTarget;
      const li = a.closest("li");
      const trait = li.dataset.itemId ? owner.items.get(li.dataset.itemId) : null;
      
      // toggle state!
      if(trait.type === "item" && safeNumber(trait.system.armor) != 0 && trait.system.disabled == true)
      {
        // armor swapping to new set, disable all others!
        for (let i of owner.items) {
          if (i.type === 'item' && safeNumber(i.system.armor) != 0 && i.system.disabled == false) // disable all other active armors
          {
            i.update({["system.disabled"]: true});
          }
        }
      }

      // flip
      trait.update({["system.disabled"]: !trait.system.disabled});
      return owner.update();
    }
    html.find(".trait-control").click(ev => toggleTraitEnable(ev, this.actor));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
  }
}
