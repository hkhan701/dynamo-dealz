import {
  Paintbrush,
  Car,
  Baby,
  HeartPulse,
  Shirt,
  Gamepad2,
  Utensils,
  Hammer,
  Leaf,
  Briefcase,
  PawPrint,
  Gift,
  ShoppingBag,
  Activity,
  ClipboardList,
  Package,
} from "lucide-react";

export const GENERAL_CATEGORIES = {
  "Electronics": {
    icon: Gamepad2,
    label: "Electronics",
  },
  "Home & Kitchen": {
    icon: Utensils,
    label: "Home & Kitchen",
  },
  "Kitchen & Dining": {
    icon: Utensils,
    label: "Kitchen & Dining",
  },
  "Toys & Games": {
    icon: Gift,
    label: "Toys & Games",
  },
  "Beauty & Personal Care": {
    icon: HeartPulse,
    label: "Beauty & Personal Care",
  },
  "Health & Household": {
    icon: ClipboardList,
    label: "Health & Household",
  },
  "Sports & Outdoors": {
    icon: Activity,
    label: "Sports & Outdoors",
  },
  "Tools & Home Improvement": {
    icon: Hammer,
    label: "Tools & Home Improvement",
  },
  "Clothing, Shoes & Jewelry": {
    icon: Shirt,
    label: "Clothing, Shoes & Jewelry",
  },
  "Jewelry": {
    icon: ShoppingBag,
    label: "Jewelry",
  },
  "Automotive": {
    icon: Car,
    label: "Automotive",
  },
  "Pet Supplies": {
    icon: PawPrint,
    label: "Pet Supplies",
  },
  "Baby Products": {
    icon: Baby,
    label: "Baby Products",
  },
  "Office Products": {
    icon: Briefcase,
    label: "Office Products",
  },
  "Arts, Crafts & Sewing": {
    icon: Paintbrush,
    label: "Arts, Crafts & Sewing",
  },
  "Industrial & Scientific": {
    icon: Package,
    label: "Industrial & Scientific",
  },
  "Patio, Lawn & Garden": {
    icon: Leaf,
    label: "Patio, Lawn & Garden",
  },
  "Travel Essentials": {
    icon: Package,
    label: "Travel Essentials",
  },
} as const;

export type GeneralCategory = keyof typeof GENERAL_CATEGORIES;



export const CATEGORY_MAP: Record<string, string> = {
  // ✅ Electronics
  gaming_keyboards: "Electronics",
  gaming_mice: "Electronics",
  gaming_headsets: "Electronics",
  gaming_laptops: "Electronics",
  gaming_monitors: "Electronics",
  phones: "Electronics",
  tablets: "Electronics",
  laptops: "Electronics",
  monitors: "Electronics",
  printers: "Electronics",
  wireless_earbuds: "Electronics",
  wired_earbuds: "Electronics",
  usb_chargers: "Electronics",
  power_banks: "Electronics",
  workstation: "Electronics",
  bluetooth_speakers: "Electronics",
  microphones: "Electronics",
  wifi_projector: "Electronics",
  memory_card_usb: "Electronics",
  wireless_charger: "Electronics",
  fast_charger: "Electronics",
  wifi_security_camera: "Electronics",
  smart_tv: "Electronics",
  tripods: "Electronics",
  video_light: "Electronics",
  photography_accessories: "Electronics",

  // ✅ Home & Kitchen
  home_organization: "Home & Kitchen",
  home_decor: "Home & Kitchen",
  furniture: "Home & Kitchen",
  area_rugs: "Home & Kitchen",
  led_lights: "Home & Kitchen",
  indoor_lighting: "Home & Kitchen",
  outdoor_lighting: "Home & Kitchen",
  kitchen_appliances: "Kitchen & Dining",
  cookware: "Kitchen & Dining",
  cutlery: "Kitchen & Dining",
  kitchen_accessories: "Kitchen & Dining",
  bedding: "Home & Kitchen",
  bedroom_accessories: "Home & Kitchen",
  pillows: "Home & Kitchen",
  sofas: "Home & Kitchen",
  coffee_tables: "Home & Kitchen",
  living_room_accessories: "Home & Kitchen",
  dining_tables: "Home & Kitchen",
  dining_chairs: "Home & Kitchen",
  dining_room_accessories: "Home & Kitchen",
  towels: "Home & Kitchen",
  shower_curtains: "Home & Kitchen",
  bathroom_accessories: "Home & Kitchen",
  storage_solutions: "Home & Kitchen",
  garage_tools: "Tools & Home Improvement",
  solar_light: "Home & Kitchen",
  floor_lamps: "Home & Kitchen",
  ceiling_lights: "Home & Kitchen",
  desk_lamps: "Home & Kitchen",
  cleaning_supplies: "Health & Household",
  blankets: "Home & Kitchen",
  mirrors: "Home & Kitchen",
  knife_sets: "Kitchen & Dining",
  shelving_racks: "Home & Kitchen",
  room_decor: "Home & Kitchen",
  door_locks: "Tools & Home Improvement",
  locks: "Tools & Home Improvement",
  space_heaters: "Home & Kitchen",

  // ✅ Toys & Games
  action_figures: "Toys & Games",
  board_games: "Toys & Games",
  educational_toys: "Toys & Games",
  rc_car: "Toys & Games",

  // ✅ Beauty & Personal Care
  skincare: "Beauty & Personal Care",
  makeup: "Beauty & Personal Care",
  haircare: "Beauty & Personal Care",
  personal_care: "Beauty & Personal Care",
  nail_kits: "Beauty & Personal Care",

  // ✅ Health & Household
  health_supplements: "Health & Household",
  electric_toothbrush: "Health & Household",
  smart_scales: "Health & Household",

  // ✅ Sports & Outdoors
  fitness_equipment: "Sports & Outdoors",
  sports_equipment: "Sports & Outdoors",
  athletic_wear: "Sports & Outdoors",
  camping_gear: "Sports & Outdoors",
  hiking_equipment: "Sports & Outdoors",
  fishing_tools: "Sports & Outdoors",
  camping_bags: "Sports & Outdoors",

  // ✅ Tools & Home Improvement
  hand_tools: "Tools & Home Improvement",
  power_tools: "Tools & Home Improvement",
  garden_tools: "Tools & Home Improvement",

  // ✅ Jewelry
  necklaces: "Clothing, Shoes & Jewelry",
  bracelets: "Clothing, Shoes & Jewelry",
  earrings: "Clothing, Shoes & Jewelry",
  rings: "Clothing, Shoes & Jewelry",
  watches_for_men: "Clothing, Shoes & Jewelry",

  // ✅ Automotive
  car_accessories: "Automotive",
  car_chargers: "Automotive",
  car_tools: "Automotive",
  dashcams: "Automotive",

  // ✅ Pet Supplies
  pet_food: "Pet Supplies",
  dog_accessories: "Pet Supplies",
  cat_accessories: "Pet Supplies",

  // ✅ Baby Products
  baby_care_products: "Baby Products",

  // ✅ Office Products
  office_accessories: "Office Products",
  stationery: "Office Products",

  // ✅ Clothing, Shoes & Jewelry
  womens_clothing: "Clothing, Shoes & Jewelry",
  mens_clothing: "Clothing, Shoes & Jewelry",
  women_shoes: "Clothing, Shoes & Jewelry",
  men_shoes: "Clothing, Shoes & Jewelry",
  womens_boots: "Clothing, Shoes & Jewelry",
  mens_boots: "Clothing, Shoes & Jewelry",
  slippers_for_woman: "Clothing, Shoes & Jewelry",
  slippers_for_men: "Clothing, Shoes & Jewelry",
  womens_wallets: "Clothing, Shoes & Jewelry",
  mens_wallets: "Clothing, Shoes & Jewelry",
  womens_hats: "Clothing, Shoes & Jewelry",
  mens_hats: "Clothing, Shoes & Jewelry",
  womens_sunglasses: "Clothing, Shoes & Jewelry",
  mens_sunglasses: "Clothing, Shoes & Jewelry",
  women_socks: "Clothing, Shoes & Jewelry",
  mens_socks: "Clothing, Shoes & Jewelry",
  handbags: "Clothing, Shoes & Jewelry",
  jackets: "Clothing, Shoes & Jewelry",

  // ✅ Arts, Crafts & Sewing
  art_supplies: "Arts, Crafts & Sewing",
  handcrafted_items: "Arts, Crafts & Sewing",

  // ✅ Industrial & Scientific
  "3d_printer_filament": "Industrial & Scientific",
  "3d_printers": "Industrial & Scientific",

  // ✅ Patio, Lawn & Garden
  garden_decor: "Patio, Lawn & Garden",

  // ✅ Travel
  luggage: "Travel Essentials",
  travel_essentials: "Travel Essentials",

  // ✅ Vacuums
  vacuums: "Home & Kitchen",
  robot_vacuums: "Home & Kitchen",

  // ✅ Solar & Renewable
  solar_panel: "Tools & Home Improvement",

  // ✅ Cameras
  fpv_drone: "Electronics",
  action_camera: "Electronics",
};
