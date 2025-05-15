import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  eventName: string;
  eventDate: Date;
  location: string;
  ticketType: string;
  price: number;
  purchaseDate: Date;
  qrCode: string;
  used: boolean;
  image?: string;
}

interface TicketStore {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'qrCode' | 'purchaseDate' | 'used'>) => Ticket;
  getTicketsByUser: (userId: string) => Ticket[];
  getTicketsByEvent: (eventId: string) => Ticket[];
  markTicketAsUsed: (ticketId: string) => void;
  generateFreeTicket: (eventId: string, userId: string) => Ticket;
  getTotalSpentByUser: (userId: string) => number;
}

// Créer quelques tickets de test avec les montants exacts
const testTickets: Ticket[] = [
  {
    id: uuidv4(),
    eventId: "test-event-1",
    userId: "admin",
    eventName: "Festival de Musique 2024",
    eventDate: new Date("2024-07-15"),
    location: "Complexe Mohammed V, Casablanca",
    ticketType: "Standard",
    price: 500,
    purchaseDate: new Date(),
    qrCode: "TEST-1",
    used: false,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3"
  },
  {
    id: uuidv4(),
    eventId: "test-event-2",
    userId: "admin",
    eventName: "Tech Conference 2024",
    eventDate: new Date("2024-08-20"),
    location: "Hyatt Regency, Casablanca",
    ticketType: "VIP",
    price: 1000,
    purchaseDate: new Date(),
    qrCode: "TEST-2",
    used: false,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
  },
  {
    id: uuidv4(),
    eventId: "test-event-3",
    userId: "admin",
    eventName: "Concert Hip-Hop",
    eventDate: new Date("2024-09-05"),
    location: "Stade Ibn Batouta, Tanger",
    ticketType: "Standard",
    price: 300,
    purchaseDate: new Date(),
    qrCode: "TEST-3",
    used: false,
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3"
  }
];

export const useTicketStore = create<TicketStore>()(
  persist(
    (set, get) => ({
      tickets: testTickets,
      addTicket: (ticketData) => {
        // Ensure price is a number
        const price = Number(ticketData.price);
        if (isNaN(price)) {
          throw new Error('Invalid price value');
        }

        const ticket: Ticket = {
          id: uuidv4(),
          qrCode: `TICKET-${uuidv4()}`,
          purchaseDate: new Date(),
          used: false,
          ...ticketData,
          price // Use the converted number
        };
        
        set((state) => ({ tickets: [...state.tickets, ticket] }));
        return ticket;
      },
      getTicketsByUser: (userId) => {
        return get().tickets.filter(ticket => ticket.userId === userId);
      },
      getTicketsByEvent: (eventId) => {
        return get().tickets.filter(ticket => ticket.eventId === eventId);
      },
      markTicketAsUsed: (ticketId) => {
        set((state) => ({
          tickets: state.tickets.map(ticket =>
            ticket.id === ticketId ? { ...ticket, used: true } : ticket
          )
        }));
      },
      generateFreeTicket: (eventId: string, userId: string) => {
        const ticket: Ticket = {
          id: uuidv4(),
          eventId,
          userId,
          eventName: "Test Event",
          eventDate: new Date(),
          location: "Test Location",
          ticketType: "Free",
          price: 0,
          purchaseDate: new Date(),
          qrCode: `FREE-${uuidv4()}`,
          used: false
        };

        set((state) => ({ tickets: [...state.tickets, ticket] }));
        return ticket;
      },
      getTotalSpentByUser: (userId: string) => {
        const userTickets = get().tickets.filter(ticket => ticket.userId === userId);
        return userTickets.reduce((total, ticket) => total + Number(ticket.price), 0);
      }
    }),
    {
      name: 'ticket-storage'
    }
  )
);