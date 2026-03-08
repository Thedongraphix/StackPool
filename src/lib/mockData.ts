import { Pool } from "@/types";

export const mockPools: Pool[] = [
  {
    id: "1",
    title: "Mombasa Road Trip",
    description:
      "Collecting for 4 nights at Diani Beach. Split between 8 of us. Accommodation, transport, and meals all covered.",
    targetAmount: 0.008,
    currentAmount: 0.005,
    contributorCount: 5,
    creator: "chris.btc",
    recipient: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    deadline: "2026-04-15",
    status: "active",
    coverEmoji: "palm_tree",
    isPublic: true,
    contributors: [
      { address: "alice.btc", amount: 0.001, time: "2 hours ago" },
      { address: "bob.btc", amount: 0.0015, time: "5 hours ago" },
      { address: "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE", amount: 0.001, time: "1 day ago" },
      { address: "diana.btc", amount: 0.0005, time: "1 day ago" },
      { address: "SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE", amount: 0.001, time: "2 days ago" },
    ],
  },
  {
    id: "2",
    title: "January Chama Round",
    description:
      "Monthly contribution for the Kaizen investment chama. All 10 members must contribute before month end.",
    targetAmount: 0.02,
    currentAmount: 0.02,
    contributorCount: 10,
    creator: "wanjiku.btc",
    recipient: "SP1H1733V5MZ3SZ9XD19JZKK2M0ZD6CT4ZA5GERSP",
    deadline: "2026-01-31",
    status: "funded",
    coverEmoji: "chart_increasing",
    isPublic: true,
    contributors: [
      { address: "wanjiku.btc", amount: 0.002, time: "3 days ago" },
      { address: "kamau.btc", amount: 0.002, time: "3 days ago" },
      { address: "akinyi.btc", amount: 0.002, time: "4 days ago" },
      { address: "ochieng.btc", amount: 0.002, time: "5 days ago" },
      { address: "SP2N3BAG68W1E5R0SHK6MN65TRG79JKVDETWY3GCR", amount: 0.002, time: "5 days ago" },
      { address: "fatima.btc", amount: 0.002, time: "6 days ago" },
      { address: "mwangi.btc", amount: 0.002, time: "6 days ago" },
      { address: "njeri.btc", amount: 0.002, time: "7 days ago" },
      { address: "SP1K3S8T7RQ45GJ7N0H3ZF7N73V4VKZQ5SRTBM0K3", amount: 0.002, time: "7 days ago" },
      { address: "amina.btc", amount: 0.002, time: "8 days ago" },
    ],
  },
  {
    id: "3",
    title: "Office WiFi Subscription",
    description: "Splitting the quarterly Starlink subscription for the co-working space. 6 people sharing.",
    targetAmount: 0.003,
    currentAmount: 0.001,
    contributorCount: 2,
    creator: "dev.btc",
    recipient: "SP3WZFBT57YCAT1QX6E0H69VMP3KAT6DGZQGA8RAC",
    deadline: "2026-03-20",
    status: "active",
    coverEmoji: "globe_with_meridians",
    isPublic: true,
    contributors: [
      { address: "dev.btc", amount: 0.0005, time: "1 hour ago" },
      { address: "sarah.btc", amount: 0.0005, time: "3 hours ago" },
    ],
  },
  {
    id: "4",
    title: "Community Library Fund",
    description:
      "Harambee to buy 200 books for Kibera Community Library. Every contribution counts toward a brighter future.",
    targetAmount: 0.05,
    currentAmount: 0.032,
    contributorCount: 18,
    creator: "teacher.btc",
    recipient: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
    deadline: "2026-05-01",
    status: "active",
    coverEmoji: "books",
    isPublic: true,
    contributors: [
      { address: "teacher.btc", amount: 0.005, time: "6 hours ago" },
      { address: "parent1.btc", amount: 0.002, time: "1 day ago" },
      { address: "SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE", amount: 0.003, time: "1 day ago" },
    ],
  },
  {
    id: "5",
    title: "Birthday Dinner Split",
    description: "Splitting the bill from Nyama Mama dinner. Was an amazing night! Each person owes equal share.",
    targetAmount: 0.002,
    currentAmount: 0.002,
    contributorCount: 6,
    creator: "james.btc",
    recipient: "SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE",
    deadline: "2026-02-28",
    status: "funded",
    coverEmoji: "birthday_cake",
    isPublic: false,
    contributors: [],
  },
  {
    id: "6",
    title: "Startup Registration Fees",
    description: "Pooling funds for company registration, domain, and initial hosting. 3 co-founders contributing equally.",
    targetAmount: 0.01,
    currentAmount: 0.0033,
    contributorCount: 1,
    creator: "founder.btc",
    recipient: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    deadline: "2026-04-01",
    status: "active",
    coverEmoji: "rocket",
    isPublic: true,
    contributors: [
      { address: "founder.btc", amount: 0.0033, time: "12 hours ago" },
    ],
  },
];

export const mockStats = {
  totalPools: 142,
  totalSbtcPooled: 3.847,
  successfulPools: 98,
};

export function getPool(id: string): Pool | undefined {
  return mockPools.find((p) => p.id === id);
}

export function getPublicPools(): Pool[] {
  return mockPools.filter((p) => p.isPublic);
}
