import { FiHome, FiSettings } from "react-icons/fi";

import { RiAdminFill } from "react-icons/ri";

export const menuItems = [
  {
    icon: FiHome,
    label: "Dashboard",
    href: "/dashboard/user",
  },

  {
    icon: RiAdminFill,
    label: "Order",
    href: "/dashboard/user/order",
    subItems: [{ label: "Daftar Order", href: "/dashboard/user/order" }],
  },

  {
    icon: FiSettings,
    label: "Pengaturan",
    href: "/dashboard/user/settings",
    subItems: [
      { label: "Profile", href: "/dashboard/user/settings/profile" },
      { label: "Security", href: "/dashboard/user/settings/security" },
    ],
  },

  {
    icon: FiHome,
    label: "Home",
    href: "/",
  },
];
