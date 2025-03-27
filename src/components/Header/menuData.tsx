import { Menu } from "@/types/menu";

const menuData: Menu[] = [
    {
        id: 2,
        title: "Dashboard",
        path: "/dashboard",
        newTab: false,
    },
    {
        id: 3,
        title: "Journal",
        newTab: false,
        submenu: [
        {
            id: 31,
            title: "All Journals",
            path: "/journal",
            newTab: false,
        },
        {
            id: 32,
            title: "New Journal Entry",
            path: "/journal/new",
            newTab: false,
        },
        ],
    },
    {
        id: 6,
        title: "Categories",
        newTab: false,
        submenu: [
        {
            id: 61,
            title: "Manage Categories",
            path: "/categories",
            newTab: false,
        },
        ],
    },
    {
        id: 7,
        title: "Tags",
        newTab: false,
        submenu: [
        {
            id: 71,
            title: "Manage Tags",
            path: "/tags",
            newTab: false,
        },
        ],
    },
    {
        id: 8,
        title: "Settings",
        newTab: false,
        submenu: [
        {
            id: 81,
            title: "Profile",
            path: "/settings",
            newTab: false,
        },
        {
            id: 82,
            title: "Change Password",
            path: "/change-password",
            newTab: false,
        },
        {
            id: 1,
            title: "Analytics",
            path: "/analytics",
            newTab: false,
        },
        {
            id: 5,
            title: "AI Analysis",
            path: "/ai/analyze",
            newTab: false,
        },
        ],
    }
];

export default menuData;
