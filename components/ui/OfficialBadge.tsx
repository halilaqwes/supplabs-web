import Image from "next/image";

interface OfficialBadgeProps {
    size?: number;
}

export function OfficialBadge({ size = 20 }: OfficialBadgeProps) {
    return (
        <div
            className="inline-flex items-center justify-center"
            title="Resmi Hesap"
        >
            <img
                src="/official-badge.png"
                alt="Resmi Hesap"
                className="inline-block"
                style={{ width: size, height: size }}
            />
        </div>
    );
}
