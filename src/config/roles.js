import {
    Crown,
    ShieldCheck,
    ClipboardCheck,
    Briefcase,
    CircleUser
} from "lucide-react";

export const roleConfig = {
    creator: {
        bg: "bg-blue-600",
        text: "text-white",
        label: "Fundador",
        icon: Crown
    },
    captain: {
        bg: "bg-yellow-500",
        text: "text-gray-900",
        label: "Capitán",
        icon: ShieldCheck
    },
    coach: {
        bg: "bg-indigo-600",
        text: "text-white",
        label: "Entrenador",
        icon: ClipboardCheck
    },
    manager: {
        bg: "bg-green-600",
        text: "text-white",
        label: "Manager",
        icon: Briefcase
    },
    member: {
        bg: "bg-gray-600",
        text: "text-white",
        label: "Miembro",
        icon: CircleUser
    }
};