import { motion, useAnimation } from "framer-motion";
import { Button, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";

type MagneticButtonProps = ButtonProps & {
  intensity?: number;
};

export function MagneticButton({ intensity = 0.4, className, ...props }: MagneticButtonProps) {
  const controls = useAnimation();

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    controls.start({
      x: offsetX * intensity,
      y: offsetY * intensity,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    });
  };

  const handleLeave = () => {
    controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 260, damping: 18 } });
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={controls}
      className="inline-block"
    >
      <Button className={cn("relative", className)} {...props} />
    </motion.div>
  );
}
