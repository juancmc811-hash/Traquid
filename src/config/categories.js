const categories = [
  {
    id: "food",
    name: "Comida",
    icon: "restaurant-outline",
    color: "#BD784E",
    bg: "#FAECDD",
  },
  {
    id: "market",
    name: "Supermercado",
    icon: "cart-outline",
    color: "#52856C",
    bg: "#E7F0E6",
  },
  {
    id: "transport",
    name: "Transporte",
    icon: "bus-outline",
    color: "#628DA6",
    bg: "#E7EFF7",
  },
  {
    id: "fun",
    name: "Ocio",
    icon: "game-controller-outline",
    color: "#9B83B1",
    bg: "#EFEAF6",
  },
  {
    id: "home",
    name: "Hogar",
    icon: "home-outline",
    color: "#90845C",
    bg: "#F1EEDD",
  },
  {
    id: "health",
    name: "Salud",
    label: "Salud",
    icon: "heart-outline",
    color: "#B76D74",
    bg: "#F9E6E8",
  },
  {
    id: "shop",
    name: "Compras",
    icon: "bag-outline",
    color: "#9E86B5",
    bg: "#F0EAF5",
  },
  {
    id: "other",
    name: "Otros",
    icon: "ellipsis-horizontal",
    color: "#7B8980",
    bg: "#EBEEE8",
  },
];
const catFor = (id) => categories.find((c) => c.id === id) || categories[7];
export { categories, catFor };
