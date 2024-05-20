export const STARDUST = {};

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */
STARDUST.translate = {
  "body":         "STARDUST.AttributeBody",
  "agility":      "STARDUST.AttributeAgility",
  "mind":         "STARDUST.AttributeMind",
  "will":         "STARDUST.AttributeWill",
  "none":         "STARDUST.SkillNone",
  "acrobatics":   "STARDUST.SkillAcrobatics",
  "athletics":    "STARDUST.SkillAthletics",
  "cqc":          "STARDUST.SkillCqc",
  "artillery":    "STARDUST.SkillArtillery",
  "firearms":     "STARDUST.SkillFirearms",
  "piloting":     "STARDUST.SkillPiloting",
  "sleight":      "STARDUST.SkillSleight",
  "stealth":      "STARDUST.SkillStealth",
  "computers":    "STARDUST.SkillComputers",
  "culture":      "STARDUST.SkillCulture",
  "engineering":  "STARDUST.SkillEngineering",
  "investigation":"STARDUST.SkillInvestigation",
  "medicine":     "STARDUST.SkillMedicine",
  "science":      "STARDUST.SkillScience",
  "insight":      "STARDUST.SkillInsight",
  "intimidation": "STARDUST.SkillIntimidation",
  "perception":   "STARDUST.SkillPerception",
  "performance":  "STARDUST.SkillPerformance",
  "persuasion":   "STARDUST.SkillPersuasion",
  "psionics":     "STARDUST.SkillPsionics",
  "survival":     "STARDUST.SkillSurvival",
  "small":        "STARDUST.TraitSmall",
  "consumable":   "STARDUST.TraitConsumable",
  "implant":      "STARDUST.TraitImplant",
  "twohand":      "STARDUST.TraitTwoHanded",
  "physical":     "STARDUST.TraitPhysical",
  "energy":       "STARDUST.TraitEnergy",
  "reload":       "STARDUST.TraitReload",
  "charge":       "STARDUST.TraitCharge",
  "blunt":        "STARDUST.AttackBlunt",
  "slash":        "STARDUST.AttackSlash",
  "pierce":       "STARDUST.AttackPierce",
  "acid":         "STARDUST.AttackAcid",
  "cold":         "STARDUST.AttackCold",
  "electricity":  "STARDUST.AttackElec",
  "heat":         "STARDUST.AttackHeat"
};

STARDUST.dicetoindex = {
  "none": 0,
  "1d4": 1,
  "1d6": 2,
  "1d8": 3,
  "1d10": 4,
  "1d12": 5,
  "1d20": 6
};

STARDUST.trainingtoindex = {
  "untrained": 0,
  "amatuer": 1,
  "trained": 2,
  "profession": 3,
  "master": 4,
  "legendary": 5,
  "mythic": 6
};


STARDUST.attributecolor = {
  "body": "#e1723a",
  "agility": "#7cdf2a",
  "mind": "#d5e050",
  "will": "#2a8ddf"
};

// for dropdowns
// Keep template up to date
STARDUST.skilldatalist = {
  "none": "none",
  "acrobatics": "acrobatics",
  "athletics": "athletics",
  "cqc": "cqc",
  "performance": "performance",
  "artillery": "artillery",
  "firearms": "firearms",
  "piloting": "piloting",
  "sleight": "sleight",
  "stealth": "stealth",
  "computers": "computers",
  "culture": "culture",
  "engineering": "engineering",
  "investigation": "investigation",
  "medicine": "medicine",
  "science": "science",
  "insight": "insight",
  "intimidation": "intimidation",
  "perception": "perception",
  "persuasion": "persuasion",
  "psionics": "psionics",
  "survival": "survival"
}

// If items and actors clean their data with the following lists
STARDUST.debug_cleandata = true

// Keep template up to date
STARDUST.skillattribute = {
  "acrobatics": "body",
  "athletics": "body",
  "cqc": "body",
  "performance": "body",
  "artillery": "agility",
  "firearms": "agility",
  "piloting": "agility",
  "sleight": "agility",
  "stealth": "agility",
  "computers": "mind",
  "culture": "mind",
  "engineering": "mind",
  "investigation": "mind",
  "medicine": "mind",
  "science": "mind",
  "insight": "will",
  "intimidation": "will",
  "perception": "will",
  "persuasion": "will",
  "psionics": "will",
  "survival": "will"
}

// Keep template up to date
STARDUST.itemtraits = [
  "small",
  "consumable",
  "implant",
  "twohand",
  "physical",
  "energy",
  "reload",
  "charge"
]