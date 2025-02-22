import { FiHome, FiSettings } from "react-icons/fi";

import { RiAdminFill } from "react-icons/ri";

import { MdFeaturedPlayList } from "react-icons/md";

import { GiCardboardBoxClosed } from "react-icons/gi";

import { GrArticle } from "react-icons/gr";

import { FiLayout } from "react-icons/fi";

export const menuItems = [
  {
    icon: FiHome,
    label: "Dashboard",
    href: "/dashboard/super-admins",
  },

  {
    icon: FiLayout,
    label: "Layout",
    href: "/dashboard/super-admins/layout",
    subItems: [
      { label: "Banner", href: "/dashboard/super-admins/layout/banner" },

      {
        label: "Discount",
        href: "/dashboard/super-admins/layout/discount",
      },

      {
        label: "Category Discount",
        href: "/dashboard/super-admins/layout/category-discount",
      },

      {
        label: "Category Product",
        href: "/dashboard/super-admins/layout/category-product",
      },

      {
        label: "Brand",
        href: "/dashboard/super-admins/layout/brand",
      },

      {
        label: "Partner",
        href: "/dashboard/super-admins/layout/partner",
      },

      {
        label: "FAQS",
        href: "/dashboard/super-admins/layout/faqs",
      },
    ],
  },

  {
    icon: RiAdminFill,
    label: "Seller",
    href: "/dashboard/super-admins/seller",
    subItems: [
      { label: "Daftar Seller", href: "/dashboard/super-admins/seller" },
    ],
  },

  {
    icon: MdFeaturedPlayList,
    label: "Featured",
    href: "/dashboard/super-admins/featured",
    subItems: [
      { label: "Daftar Featured", href: "/dashboard/super-admins/featured" },
    ],
  },

  {
    icon: GiCardboardBoxClosed,
    label: "Produk",
    href: "/dashboard/super-admins/products",
    subItems: [
      { label: "Daftar Produk", href: "/dashboard/super-admins/products" },
      { label: "Kategori", href: "/dashboard/super-admins/products/category" },
      {
        label: "Jenis Kelamin",
        href: "/dashboard/super-admins/products/gender",
      },
      {
        label: "Merek",
        href: "/dashboard/super-admins/products/merek",
      },
    ],
  },

  {
    icon: GrArticle,
    label: "Article",
    href: "/dashboard/super-admins/article",
    subItems: [
      { label: "Daftar Article", href: "/dashboard/super-admins/article" },
      { label: "Category", href: "/dashboard/super-admins/article/category" },
      { label: "Tags", href: "/dashboard/super-admins/article/tags" },
    ],
  },

  {
    icon: FiSettings,
    label: "Pengaturan",
    href: "/dashboard/super-admins/settings",
    subItems: [
      { label: "Profile", href: "/dashboard/super-admins/settings/profile" },
      { label: "Security", href: "/dashboard/super-admins/settings/security" },
    ],
  },

  {
    icon: FiHome,
    label: "Home",
    href: "/",
  },
];
