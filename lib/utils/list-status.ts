export const LIST_STATUS_OPTIONS = [
  { value: "WATCHING", label: "Смотрю" },
  { value: "COMPLETED", label: "Просмотрено" },
  { value: "PLANNED", label: "В планах" },
  { value: "DROPPED", label: "Брошено" }
] as const;

export type ListStatus = (typeof LIST_STATUS_OPTIONS)[number]["value"];

export function getListStatusLabel(status: string): string {
  const match = LIST_STATUS_OPTIONS.find((it) => it.value === status);
  return match?.label ?? status;
}
