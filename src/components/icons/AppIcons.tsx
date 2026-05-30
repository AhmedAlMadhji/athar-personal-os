import type { SVGProps } from "react";
import {
  HiOutlineArrowPath,
  HiOutlineChartBar,
  HiOutlineCheck,
  HiOutlineLightBulb,
  HiOutlineTrophy,
  HiOutlineXMark,
} from "react-icons/hi2";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

const defaults = { className: "h-4 w-4 shrink-0", "aria-hidden": true as const };

export function IconRefresh(props: IconProps) {
  return <HiOutlineArrowPath {...defaults} {...props} />;
}

export function IconLightbulb(props: IconProps) {
  return <HiOutlineLightBulb {...defaults} {...props} />;
}

export function IconChartBar(props: IconProps) {
  return <HiOutlineChartBar {...defaults} {...props} />;
}

export function IconCheck(props: IconProps) {
  return <HiOutlineCheck {...defaults} {...props} />;
}

export function IconClose(props: IconProps) {
  return <HiOutlineXMark {...defaults} {...props} />;
}

export function IconTrophy(props: IconProps) {
  return <HiOutlineTrophy {...defaults} {...props} />;
}
