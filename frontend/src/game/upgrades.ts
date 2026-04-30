import type { ImprovementLevels, UpgradeDefinition } from './gameTypes';

export const maxUpgradeLevel = 5;

export const upgrades: UpgradeDefinition[] = [
  { name: '5S', label: '5S', effect: '-5% defects, +10% speed.', baseCost: 50 },
  {
    name: 'Kanban',
    label: 'Kanban',
    effect: '+20% production speed.',
    baseCost: 200,
  },
  {
    name: 'Poka-Yoke',
    label: 'Poka-Yoke',
    effect: '-15% defects.',
    baseCost: 500,
  },
  {
    name: 'TPM',
    label: 'TPM',
    effect: '+15% OEE, -10% defects.',
    baseCost: 1500,
  },
  {
    name: 'Andon',
    label: 'Andon',
    effect: 'Unlocks auto-recovery from stoppages.',
    baseCost: 4000,
  },
  {
    name: 'Heijunka',
    label: 'Heijunka',
    effect: 'Levels production, +25% OEE.',
    baseCost: 10000,
  },
];

export const initialImprovements: ImprovementLevels = {
  '5S': 0,
  Kanban: 0,
  'Poka-Yoke': 0,
  TPM: 0,
  Andon: 0,
  Heijunka: 0,
};

export function getUpgradeCost(baseCost: number, purchases: number): number {
  return Math.ceil(baseCost * 1.5 ** purchases);
}
