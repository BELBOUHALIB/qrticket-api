import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import generator from 'generate-password';

// Configuration pour la génération de mot de passe sécurisé
const passwordConfig = {
  length: 12,
  numbers: true,
  symbols: true,
  uppercase: true,
  lowercase: true,
  strict: true,
  excludeSimilarCharacters: true
};

// Fonction utilitaire pour générer des bytes aléatoires
const getRandomBytes = (length: number): Uint8Array => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return array;
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  passwordHash: string;
}

interface UserStore {
  users: User[];
  currentUser: User | null;
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'passwordHash'> & { password: string }) => User;
  createUser: (name: string, email: string) => Promise<{ user: User; password: string }>;
  updateUser: (id: string, updates: Partial<Omit<User, 'id' | 'passwordHash'>>) => void;
  toggleUserStatus: (id: string) => void;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  getUserById: (id: string) => User | undefined;
  getUserByEmail: (email: string) => User | undefined;
  changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<string>;
  initializeAdmin: () => Promise<void>;
}

// Créer l'utilisateur admin par défaut
const createAdminUser = (): User => ({
  id: uuidv4(),
  email: 'admin@eventticket.com',
  name: 'Administrateur',
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
  passwordHash: bcrypt.hashSync('admin123!', bcrypt.genSaltSync(10))
});

// État initial avec un tableau users vide et l'utilisateur admin
const defaultState = {
  users: [createAdminUser()],
  currentUser: null
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...defaultState,

      addUser: (userData) => {
        if (!userData.email || !userData.name || !userData.password) {
          throw new Error('Tous les champs sont requis');
        }

        const currentUsers = Array.isArray(get().users) ? get().users : [];

        if (currentUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
          throw new Error('Un utilisateur avec cet email existe déjà');
        }

        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(userData.password, salt);

        const user: User = {
          id: uuidv4(),
          email: userData.email.toLowerCase(),
          name: userData.name,
          role: userData.role,
          isActive: true,
          createdAt: new Date(),
          passwordHash
        };

        set({ users: [...currentUsers, user] });
        return user;
      },

      createUser: async (name: string, email: string) => {
        if (!name || !email) {
          throw new Error('Le nom et l\'email sont requis');
        }

        const currentUsers = Array.isArray(get().users) ? get().users : [];

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedName = name.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
          throw new Error('Format d\'email invalide');
        }

        if (currentUsers.some(u => u.email === normalizedEmail)) {
          throw new Error('Un utilisateur avec cet email existe déjà');
        }

        const randomBytes = getRandomBytes(32);
        const password = Array.from(randomBytes)
          .map(byte => byte.toString(16).padStart(2, '0'))
          .join('')
          .slice(0, 12);

        const user = get().addUser({
          name: normalizedName,
          email: normalizedEmail,
          role: 'user',
          isActive: true,
          password
        });

        return { user, password };
      },

      updateUser: (id, updates) => {
        const currentUsers = Array.isArray(get().users) ? get().users : [];
        set({
          users: currentUsers.map(user => 
            user.id === id ? { ...user, ...updates } : user
          )
        });
      },

      toggleUserStatus: (id) => {
        const currentUsers = Array.isArray(get().users) ? get().users : [];
        set({
          users: currentUsers.map(user =>
            user.id === id ? { ...user, isActive: !user.isActive } : user
          )
        });
      },

      login: async (email, password) => {
        const currentUsers = Array.isArray(get().users) ? get().users : [];
        const user = currentUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
          throw new Error('Utilisateur non trouvé');
        }

        if (!user.isActive) {
          throw new Error('Ce compte est désactivé');
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          throw new Error('Mot de passe incorrect');
        }

        const updatedUser = { ...user, lastLogin: new Date() };
        set(state => ({
          users: (Array.isArray(state.users) ? state.users : []).map(u => 
            u.id === user.id ? updatedUser : u
          ),
          currentUser: updatedUser
        }));

        return updatedUser;
      },

      logout: () => {
        set({ currentUser: null });
      },

      getUserById: (id) => {
        const currentUsers = Array.isArray(get().users) ? get().users : [];
        return currentUsers.find(u => u.id === id);
      },

      getUserByEmail: (email) => {
        const currentUsers = Array.isArray(get().users) ? get().users : [];
        return currentUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      },

      changePassword: async (userId, currentPassword, newPassword) => {
        const user = get().getUserById(userId);
        if (!user) {
          throw new Error('Utilisateur non trouvé');
        }

        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValid) {
          throw new Error('Mot de passe actuel incorrect');
        }

        const salt = bcrypt.genSaltSync(10);
        const newPasswordHash = bcrypt.hashSync(newPassword, salt);

        const currentUsers = Array.isArray(get().users) ? get().users : [];
        set({
          users: currentUsers.map(u =>
            u.id === userId ? { ...u, passwordHash: newPasswordHash } : u
          )
        });
      },

      resetPassword: async (email) => {
        const user = get().getUserByEmail(email);
        if (!user) {
          throw new Error('Utilisateur non trouvé');
        }

        const randomBytes = getRandomBytes(32);
        const newPassword = Array.from(randomBytes)
          .map(byte => byte.toString(16).padStart(2, '0'))
          .join('')
          .slice(0, 12);

        const salt = bcrypt.genSaltSync(10);
        const newPasswordHash = bcrypt.hashSync(newPassword, salt);

        const currentUsers = Array.isArray(get().users) ? get().users : [];
        set({
          users: currentUsers.map(u =>
            u.id === user.id ? { ...u, passwordHash: newPasswordHash } : u
          )
        });

        return newPassword;
      },

      initializeAdmin: async () => {
        const currentUsers = Array.isArray(get().users) ? get().users : [];
        const existingAdmin = currentUsers.find(u => u.role === 'admin');
        
        if (!existingAdmin) {
          set({ users: [...currentUsers, createAdminUser()] });
        }
      }
    }),
    {
      name: 'user-storage',
      version: 2,
      storage: {
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name);
            if (!str) return null;
            const data = JSON.parse(str);
            if (data.state?.users) {
              data.state.users = data.state.users.map((user: any) => ({
                ...user,
                createdAt: new Date(user.createdAt),
                lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined
              }));
            }
            return data;
          } catch (error) {
            console.error('Erreur lors de la lecture du storage:', error);
            return defaultState;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error('Erreur lors de l\'écriture dans le storage:', error);
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch (error) {
            console.error('Erreur lors de la suppression du storage:', error);
          }
        }
      },
      migrate: (persistedState: any) => {
        if (!persistedState) {
          return defaultState;
        }

        try {
          const users = Array.isArray(persistedState.users) ? persistedState.users : [];
          const migratedUsers = users.map((user: any) => ({
            id: user.id || uuidv4(),
            email: user.email || '',
            name: user.name || '',
            role: user.role || 'user',
            isActive: typeof user.isActive === 'boolean' ? user.isActive : true,
            createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
            lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
            passwordHash: user.passwordHash || ''
          }));

          const hasAdmin = migratedUsers.some((user: any) => user.role === 'admin');
          if (!hasAdmin) {
            migratedUsers.push(createAdminUser());
          }

          return {
            users: migratedUsers,
            currentUser: null
          };
        } catch (error) {
          console.error('Erreur lors de la migration:', error);
          return defaultState;
        }
      }
    }
  )
);