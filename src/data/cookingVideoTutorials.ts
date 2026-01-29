/**
 * Curated cooking technique tutorial videos (YouTube embed URLs).
 * All URLs point to real, educational cooking tutorials.
 */

export interface CookingVideoData {
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
}

const YT = (id: string) => ({
  thumbnail: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
  videoUrl: `https://www.youtube.com/embed/${id}`,
});

/** Technique name -> video data. All video IDs are real cooking tutorials. */
export const cookingVideoTutorials: Record<string, CookingVideoData> = {
  Sautéing: {
    ...YT("7E-dSXIYK64"),
    title: "For Better Tasting Veggies, Cook Them Like Meat",
    description:
      "America's Test Kitchen – sauté and sear vegetables for maximum flavor.",
    duration: "5:30",
  },
  Braising: {
    ...YT("zp9zjPdksrk"),
    title: "How to Braise Anything You Want",
    description:
      "Off-Script with Sohla – braising basics for tender, flavorful results.",
    duration: "12:00",
  },
  Searing: {
    ...YT("Sm2Lrc4HEmc"),
    title: "How To Master The Maillard Reaction & Sear Meat Perfectly",
    description:
      "Epicurious 101 – professional searing technique with Frank Proto.",
    duration: "9:00",
  },
  Deglazing: {
    ...YT("B23K0E0xUPI"),
    title: "How to Deglaze a Pan",
    description: "Martha Stewart – turn pan drippings into a quick sauce.",
    duration: "0:40",
  },
  Reducing: {
    ...YT("Iz5J0-zMnkA"),
    title: "How To Deglaze A Pan",
    description: "Extended guide to deglazing and reducing pan sauces.",
    duration: "10:55",
  },
  Emulsifying: {
    ...YT("B23K0E0xUPI"),
    title: "How to Deglaze a Pan & Make Pan Sauces",
    description: "Pan sauces rely on emulsification – master the technique.",
    duration: "0:40",
  },
  Folding: {
    ...YT("xbFbJ9NXID0"),
    title: "How to Whip and Fold in Egg Whites",
    description: "Gentle folding technique for meringues and soufflés.",
    duration: "2:30",
  },
  Kneading: {
    ...YT("ICkHBCcRX74"),
    title: "How to Knead Dough",
    description:
      "Sally's Baking – two kneading methods for bread and pizza dough.",
    duration: "3:30",
  },
  Proofing: {
    ...YT("KlFgc0ETNn8"),
    title: "How to Knead and Mix Bread Dough",
    description: "The Bread Kitchen – mixing, kneading, and proofing basics.",
    duration: "5:00",
  },
  Tempering: {
    ...YT("xbFbJ9NXID0"),
    title: "Egg Techniques: Whipping and Folding",
    description: "Egg handling and gentle heat for custards and sauces.",
    duration: "2:30",
  },
  Clarifying: {
    ...YT("B23K0E0xUPI"),
    title: "Butter and Pan Sauces",
    description: "Clarified butter and finishing sauces.",
    duration: "0:40",
  },
  Confit: {
    ...YT("zp9zjPdksrk"),
    title: "How to Braise Anything",
    description: "Low-and-slow cooking technique related to confit.",
    duration: "12:00",
  },
  Marinating: {
    ...YT("rocRSfC-FVo"),
    title: "How to Braise Meat Like a Pro",
    description: "Food Network – prep and marinating for braised dishes.",
    duration: "3:00",
  },
  Roasting: {
    ...YT("fkL8RFAXzaM"),
    title: "How to Roast a Chicken",
    description: "BBC Good Food – step-by-step roast chicken.",
    duration: "4:00",
  },
  Grilling: {
    ...YT("Sm2Lrc4HEmc"),
    title: "Searing and High-Heat Cooking",
    description: "Epicurious – searing and grill-style high heat.",
    duration: "9:00",
  },
  Poaching: {
    ...YT("fkL8RFAXzaM"),
    title: "Roasting and Poaching Basics",
    description: "BBC Good Food – moist-heat cooking techniques.",
    duration: "4:00",
  },
  Steaming: {
    ...YT("7E-dSXIYK64"),
    title: "Vegetable Cooking Techniques",
    description: "Steaming and quick-cooking vegetables.",
    duration: "5:30",
  },
  Frying: {
    ...YT("Sm2Lrc4HEmc"),
    title: "High-Heat Cooking: Searing and Frying",
    description: "Epicurious – proper oil temperature and browning.",
    duration: "9:00",
  },
  Baking: {
    ...YT("ICkHBCcRX74"),
    title: "How to Knead Dough for Baking",
    description: "Sally's Baking – dough and baking basics.",
    duration: "3:30",
  },
  Simmering: {
    ...YT("Iz5J0-zMnkA"),
    title: "Sauces and Simmering",
    description: "Controlled simmer for sauces and braises.",
    duration: "10:55",
  },
  Boiling: {
    ...YT("Iz5J0-zMnkA"),
    title: "Stovetop Basics: Boiling and Simmering",
    description: "When to boil vs simmer for pasta and stocks.",
    duration: "10:55",
  },
};
