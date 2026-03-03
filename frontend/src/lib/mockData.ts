import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomSuite from "@/assets/room-suite.jpg";
import roomStandard from "@/assets/room-standard.jpg";
import roomPenthouse from "@/assets/room-penthouse.jpg";

export interface Room {
  id: string;
  name: string;
  type: "standard" | "deluxe" | "suite" | "penthouse";
  price: number;
  description: string;
  shortDescription: string;
  images: string[];
  amenities: string[];
  maxGuests: number;
  size: number;
  available: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: "confirmed" | "cancelled" | "pending";
  totalPrice: number;
  createdAt: string;
}

export const rooms: Room[] = [
  {
    id: "1",
    name: "Classic Comfort Room",
    type: "standard",
    price: 149,
    description: "Our Classic Comfort Room offers a serene retreat with modern amenities and refined décor. Featuring a plush queen-size bed, marble bathroom, and city views, this room provides the perfect blend of comfort and elegance for the discerning traveler.",
    shortDescription: "A serene retreat with modern amenities and city views.",
    images: [roomStandard, roomDeluxe, roomSuite],
    amenities: ["Free Wi-Fi", "Air Conditioning", "Mini Bar", "Room Service", "Smart TV", "Safe"],
    maxGuests: 2,
    size: 32,
    available: true,
  },
  {
    id: "2",
    name: "Deluxe King Room",
    type: "deluxe",
    price: 249,
    description: "Indulge in the spacious Deluxe King Room, featuring a luxurious king-size bed with premium linens, a seating area, and panoramic views. The oversized marble bathroom includes a rain shower and separate soaking tub.",
    shortDescription: "Spacious luxury with king bed and panoramic views.",
    images: [roomDeluxe, roomStandard, roomSuite],
    amenities: ["Free Wi-Fi", "Air Conditioning", "Mini Bar", "Room Service", "Smart TV", "Safe", "Bathrobe & Slippers", "Nespresso Machine"],
    maxGuests: 2,
    size: 45,
    available: true,
  },
  {
    id: "3",
    name: "Executive Suite",
    type: "suite",
    price: 449,
    description: "The Executive Suite offers an expansive living area separate from the bedroom, ideal for both work and relaxation. Floor-to-ceiling windows frame stunning city views, while the marble bathroom features dual vanities and a deep soaking tub.",
    shortDescription: "Expansive suite with separate living area and stunning views.",
    images: [roomSuite, roomPenthouse, roomDeluxe],
    amenities: ["Free Wi-Fi", "Air Conditioning", "Mini Bar", "Room Service", "Smart TV", "Safe", "Bathrobe & Slippers", "Nespresso Machine", "Living Area", "Work Desk", "Butler Service"],
    maxGuests: 3,
    size: 72,
    available: true,
  },
  {
    id: "4",
    name: "Royal Penthouse",
    type: "penthouse",
    price: 899,
    description: "The crown jewel of our collection, the Royal Penthouse offers unparalleled luxury across two levels. Featuring a private terrace, gourmet kitchen, grand living spaces, and 360-degree panoramic views, this is the pinnacle of hospitality.",
    shortDescription: "Two-level pinnacle of luxury with private terrace.",
    images: [roomPenthouse, roomSuite, roomDeluxe],
    amenities: ["Free Wi-Fi", "Air Conditioning", "Mini Bar", "Room Service", "Smart TV", "Safe", "Bathrobe & Slippers", "Nespresso Machine", "Living Area", "Work Desk", "Butler Service", "Private Terrace", "Jacuzzi", "Kitchen"],
    maxGuests: 4,
    size: 150,
    available: true,
  },
  {
    id: "5",
    name: "Garden View Standard",
    type: "standard",
    price: 129,
    description: "Wake up to lush garden views in this charming standard room. Thoughtfully designed with warm wood accents and soft textiles, it provides a peaceful sanctuary for rest and rejuvenation.",
    shortDescription: "Charming room with lush garden views and warm décor.",
    images: [roomStandard, roomDeluxe],
    amenities: ["Free Wi-Fi", "Air Conditioning", "Mini Bar", "Room Service", "Smart TV", "Safe"],
    maxGuests: 2,
    size: 28,
    available: true,
  },
  {
    id: "6",
    name: "Premium Deluxe",
    type: "deluxe",
    price: 299,
    description: "Elevated luxury awaits in the Premium Deluxe room. A generous king bed, designer furnishings, and a private balcony create an unforgettable stay experience.",
    shortDescription: "Elevated luxury with private balcony and designer furnishings.",
    images: [roomDeluxe, roomPenthouse],
    amenities: ["Free Wi-Fi", "Air Conditioning", "Mini Bar", "Room Service", "Smart TV", "Safe", "Bathrobe & Slippers", "Nespresso Machine", "Private Balcony"],
    maxGuests: 2,
    size: 50,
    available: false,
  },
];

export const bookings: Booking[] = [
  {
    id: "b1",
    roomId: "2",
    roomName: "Deluxe King Room",
    checkIn: "2026-03-15",
    checkOut: "2026-03-18",
    guests: 2,
    status: "confirmed",
    totalPrice: 747,
    createdAt: "2026-02-28",
  },
  {
    id: "b2",
    roomId: "3",
    roomName: "Executive Suite",
    checkIn: "2026-04-01",
    checkOut: "2026-04-05",
    guests: 3,
    status: "pending",
    totalPrice: 1796,
    createdAt: "2026-02-25",
  },
  {
    id: "b3",
    roomId: "1",
    roomName: "Classic Comfort Room",
    checkIn: "2026-02-10",
    checkOut: "2026-02-12",
    guests: 1,
    status: "cancelled",
    totalPrice: 298,
    createdAt: "2026-01-20",
  },
];

// Mock API helpers
export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const mockApi = {
  getRooms: async (): Promise<Room[]> => {
    await delay(600);
    return rooms;
  },
  getRoom: async (id: string): Promise<Room | undefined> => {
    await delay(400);
    return rooms.find((r) => r.id === id);
  },
  getBookings: async (): Promise<Booking[]> => {
    await delay(500);
    return bookings;
  },
  login: async (email: string, _password: string) => {
    await delay(800);
    return { user: { id: "u1", email, name: "John Guest" }, token: "mock-jwt" };
  },
  register: async (name: string, email: string, _password: string) => {
    await delay(800);
    return { user: { id: "u2", email, name }, token: "mock-jwt" };
  },
};
