import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
    className?: string;
    size?: number;
}

export function VerifiedBadge({ className, size = 20 }: VerifiedBadgeProps) {
    return (
        <img
            src="/blue-tick.png"
            alt="Onaylı Hesap"
            title="Onaylı Hesap"
            className={cn("inline-block object-contain", className)}
            style={{ width: size, height: size }}
        />
    );
}
