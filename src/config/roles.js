import {
    Crown,
    ShieldCheck,
    ClipboardCheck,
    Briefcase,
    CircleUser
} from "lucide-react";

export const roleConfig = {
    creator: {
        color: "text-blue-600",
        bg: "bg-blue-600",
        text: "text-white",
        label: "Fundador",
        border: "border-blue-500",
        icon: Crown
    },
    captain: {
        color: "text-yellow-500",
        bg: "bg-yellow-500",
        text: "text-gray-900",
        label: "Capitán",
        border: "border-yellow-500",
        icon: ShieldCheck
    },
    coach: {
        color: "text-indigo-600",
        bg: "bg-indigo-600",
        text: "text-white",
        label: "Entrenador",
        border: "border-indigo-500",
        icon: ClipboardCheck
    },
    manager: {
        color: "text-green-600",
        bg: "bg-green-600",
        text: "text-white",
        label: "Manager",
        border: "border-green-500",
        icon: Briefcase
    },
    member: {
        color: "text-gray-600",
        bg: "bg-gray-600",
        text: "text-white",
        label: "Miembro",
        border: "border-gray-500",
        icon: CircleUser
    }
};