import { TablerIcon } from "@tabler/icons-react";

export type TSideberItem = {
  title: string;
  href: string;
  icon: TablerIcon;
  adminOnly?: true;
};
