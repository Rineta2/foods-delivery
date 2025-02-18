import { FiHome, FiSettings } from "react-icons/fi";

import { RiAdminFill } from "react-icons/ri";

import { MdFeaturedPlayList } from "react-icons/md";

import { GiCardboardBoxClosed } from "react-icons/gi";

import { GrArticle } from "react-icons/gr";

export const menuItems = [
  {
    icon: FiHome,
    label: "Dashboard",
    href: "/dashboard/seller",
  },

  {
    icon: RiAdminFill,
    label: "Seller",
    href: "/dashboard/seller/seller",
    subItems: [{ label: "Daftar Seller", href: "/dashboard/seller/seller" }],
  },

  {
    icon: MdFeaturedPlayList,
    label: "Featured",
    href: "/dashboard/seller/featured",
    subItems: [
      { label: "Daftar Featured", href: "/dashboard/seller/featured" },
    ],
  },

  {
    icon: GiCardboardBoxClosed,
    label: "Produk",
    href: "/dashboard/seller/products",
    subItems: [
      { label: "Daftar Produk", href: "/dashboard/seller/products" },
      { label: "Kategori", href: "/dashboard/seller/products/category" },
      {
        label: "Jenis Kelamin",
        href: "/dashboard/seller/products/gender",
      },
      {
        label: "Merek",
        href: "/dashboard/seller/products/merek",
      },
    ],
  },

  {
    icon: GrArticle,
    label: "Article",
    href: "/dashboard/seller/article",
    subItems: [
      { label: "Daftar Article", href: "/dashboard/seller/article" },
      { label: "Category", href: "/dashboard/seller/article/category" },
      { label: "Tags", href: "/dashboard/seller/article/tags" },
    ],
  },

  {
    icon: FiSettings,
    label: "Pengaturan",
    href: "/dashboard/seller/settings",
    subItems: [
      { label: "Profile", href: "/dashboard/seller/settings/profile" },
      { label: "Security", href: "/dashboard/seller/settings/security" },
    ],
  },

  {
    icon: FiHome,
    label: "Home",
    href: "/",
  },
];
