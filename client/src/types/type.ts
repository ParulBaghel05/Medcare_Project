import { RefObject } from "react";

export interface SideCardProps {
    title: string;
    data: string[];
    handleFilter: (type: string, value: string) => void;
}