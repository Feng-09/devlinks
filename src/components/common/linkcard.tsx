import Image from "next/image";
import { ArrowRight } from "lucide-react";

type LinkCardProps = {
  icon: string;
  platform: string;
};

export default function LinkCard({ icon, platform }: LinkCardProps) {
  return (
    <div className="p-4 rounded w-60 flex justify-between">
      <div className="flex gap-2">
        <Image src={icon} alt="icon" width={20} height={20} />
        <p className="font-instrument leading-normal text-white">{platform}</p>
      </div>
      <ArrowRight size={16} color="#ffffff" />
    </div>
  );
}
