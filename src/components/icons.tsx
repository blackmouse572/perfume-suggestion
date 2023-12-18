import { IconCheck, IconLink, IconLoader2 } from "@tabler/icons-react";
export const Icons = {
  Loading: IconLoader2,
  Check: IconCheck,
  ExternalLink: IconLink,
};
export type IconKey = keyof typeof Icons;
