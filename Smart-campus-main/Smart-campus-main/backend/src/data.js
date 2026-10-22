import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const hashPassword = (value) => bcrypt.hashSync(value, 8);

export const db = {
  users: [
    {
      id: uuidv4(),
      name: "Aarav Student",
      email: "student@campus.local",
      password: hashPassword("student123"),
      role: "student",
    },
    {
      id: uuidv4(),
      name: "Priya Admin",
      email: "admin@campus.local",
      password: hashPassword("admin123"),
      role: "admin",
    },
    {
      id: uuidv4(),
      name: "Chef Vendor",
      email: "vendor@campus.local",
      password: hashPassword("vendor123"),
      role: "vendor",
    },
  ],
  printJobs: [],
  printers: [
    { id: "PR-1", name: "Library Printer", status: "Idle", currentJobId: null },
    { id: "PR-2", name: "Lab Printer", status: "Idle", currentJobId: null },
    { id: "PR-3", name: "Hostel Printer", status: "Idle", currentJobId: null },
  ],
  diningOrders: [],
  menuItems: [
    {
      id: "M1",
      name: "Veg Wrap",
      price: 80,
      category: "Snacks",
      prepMinutes: 8,
      description: "Fresh veggies, cheese, and mint mayo.",
    },
    {
      id: "M2",
      name: "Paneer Bowl",
      price: 120,
      category: "Meals",
      prepMinutes: 12,
      description: "Rice bowl with paneer tikka and salad.",
    },
    {
      id: "M3",
      name: "Cold Coffee",
      price: 60,
      category: "Beverages",
      prepMinutes: 4,
      description: "Chilled campus favorite with ice cream.",
    },
    {
      id: "M4",
      name: "Masala Dosa",
      price: 95,
      category: "Breakfast",
      prepMinutes: 10,
      description: "Crispy dosa with potato filling and chutneys.",
    },
  ],
};
