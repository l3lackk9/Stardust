/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class StardustItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();

    // Rebuild from configuration lists
    if(CONFIG.STARDUST.debug_cleandata)
    {
      if (this.type === 'feature') {
        var original_list = {}
        for (let t in CONFIG.STARDUST.skillattribute) {
          original_list[t] = {}
          if(t in this.system.skills)
          {
            original_list[t].training = this.system.skills[t].training
          }
          else
          {
            original_list[t].training = 0
          }
        }
        this.system.skills = {}
        for (let t in CONFIG.STARDUST.skillattribute) {
          this.system.skills[t] = {}
          this.system.skills[t].training = original_list[t].training
          this.system.skills[t].base     = CONFIG.STARDUST.skillattribute[t]
        }
      }
      else if (this.type === 'item') {
        var original_list = {}
        for (let t in CONFIG.STARDUST.itemtraits) {
          var index = CONFIG.STARDUST.itemtraits[t]
          if(index in this.system.traits)
          {
            original_list[index] = this.system.traits[index]
          }
          else
          {
            original_list[index] = 0
          }
        }
        this.system.traits = {}
        for (let t in CONFIG.STARDUST.itemtraits) {
          var index = CONFIG.STARDUST.itemtraits[t]
          this.system.traits[index] = original_list[index]
        }
      }
    }
  }

  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
   getRollData() {
    // If present, return the actor's roll data.
    if ( !this.actor ) return null;
    const rollData = this.actor.getRollData();
    // Grab the item's system data as well.
    rollData.item = foundry.utils.deepClone(this.system);

    return rollData;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.
    if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.system.description ?? ''
      });
    }
    // Otherwise, create a roll and send a chat message from it.
    else {
      // Retrieve roll data.
      const rollData = this.getRollData();

      // Invoke the roll and submit it to chat.
      const roll = new Roll(rollData.item.formula, rollData);
      // If you need to store the value first, uncomment the next line.
      // let result = await roll.roll({async: true});
      roll.toMessage({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
      });
      return roll;
    }
  }
}
