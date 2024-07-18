# CHANGELOG

## 1.2.0

- Add support for Foundry v10

## 2.0.0
- Added memory value to psionic abilities.
- Added memory maximum equal to mind to Psionic ability list.
- Added contamination value to character sheet, affects max wounds and all rolls.
- Added Mortal Trauma to track number of maximum knockouts before death.

## 2.0.1
- Added default cone template (90°) on system startup
- Reduced base defense from 8 to 4.
- Solved an issue where item damage types were not displaying correctly in the item editor.

## 2.0.2
- Fixed an error where a character's defense displayed the wrong number on their sheet.

## 2.0.3
- Made several traits appear in header of items to clarify armor and features
- Fixed error where having no attribute modifying features would result in nan on the character sheet
- Show a symbol on set trainings in the attribute section of feats, for clarity while editing
- vehicle actor type with several stats and some basic rules

## 2.0.4
- Reworked several tags for better gameplay flow
- Item price field
- Attributes accessible to inline rolls
- Initiative uses proper formula when rolled by foundry
- Made item property cleanup/debug a togglable flag

## 2.0.5
- Added proper support for psionic stats in their item sheet
- Moved all distances to units instead of ft
- Penetration flag for weapons that line fire
- nightmare dice size (d100) for boss creatures or ships

## 2.0.6
- Altered defense calculation from dice max addition, to 4 + (half dice max of armor)
- Passive attribute skills in place of passives for each skill

## 2.0.7
- Updated to version 12 of foundry API
- Updated system to fix deprication warnings

## 2.0.8
- Implants do not apply inventory bulk to units
- Armor displays type blocked on character sheet
- Weapons show energy or physical tag after damage type
- Memory meter appears on npc unit sheets
