import { roleConfig } from "../config/roles";

export default function RoleBadge({ role }) {

    if (!role) return null;

    const config = roleConfig[role] || roleConfig.member;
    const Icon = config.icon;

    return (
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full w-fit ${config.bg} ${config.text}`}>
            <Icon size={10} />
            <span className="text-[10px] font-semibold uppercase">
                {config.label}
            </span>
        </div>
    );
}