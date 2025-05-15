import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  category: string;
  capacity: number;
  image: string;
  logo?: string;
  whatsappNumber: string;
  ticketsSold: number;
  revenue: number;
  organizerId: string;
  ticketTypes: {
    name: string;
    price: number;
    quantity: number;
    description: string;
  }[];
}

interface EventStore {
  events: Event[];
  addEvent: (event: Event) => void;
  getEvent: (id: string) => Event | undefined;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  getEventsByOrganizer: (organizerId: string) => Event[];
}

// Créer un événement de test
const testEvent: Event = {
  id: uuidv4(),
  title: "Festival de Musique 2024",
  description: "Un grand festival de musique avec de nombreux artistes",
  date: new Date("2024-12-31"),
  startTime: "18:00",
  endTime: "23:59",
  location: "Complexe Mohammed V",
  address: "Boulevard Ibn Tachfine, Casablanca",
  category: "Musique",
  capacity: 1000,
  image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
  whatsappNumber: "+212612345678",
  ticketsSold: 0,
  revenue: 0,
  organizerId: "admin",
  ticketTypes: [
    {
      name: "Pass Standard",
      price: 500, // Prix en MAD
      quantity: 500,
      description: "Accès à tous les concerts"
    },
    {
      name: "Pass VIP",
      price: 1000, // Prix en MAD
      quantity: 100,
      description: "Accès VIP avec espace privilégié"
    }
  ]
};

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      events: [testEvent],
      addEvent: (event) => set((state) => ({ 
        events: [...state.events, { 
          ...event,
          ticketsSold: 0,
          revenue: 0
        }] 
      })),
      getEvent: (id) => get().events.find(event => event.id === id),
      updateEvent: (id, updates) => set((state) => ({
        events: state.events.map(event =>
          event.id === id ? { ...event, ...updates } : event
        )
      })),
      getEventsByOrganizer: (organizerId) => get().events.filter(event => event.organizerId === organizerId)
    }),
    {
      name: 'event-storage'
    }
  )
);