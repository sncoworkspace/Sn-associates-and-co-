
import { User, Product, Order, ClientDocument, SecurityLog } from '../types';

const STORAGE_KEYS = {
  USERS: 'sn_db_users',
  CURRENT_USER: 'sn_db_current_user',
  CART: 'sn_db_cart',
  ORDERS: 'sn_db_orders',
  DOCUMENTS: 'sn_db_documents',
  LOGS: 'sn_db_security_logs'
};

// Storage limit is no longer enforced in the UI, keeping constant for internal tracking only if needed
export const STORAGE_LIMIT = 10 * 1024 * 1024 * 1024; // Effectively increased to 10GB for backend headroom

// Initialize DB with Admin if not exists
const initDb = () => {
  const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
  let users: User[] = usersStr ? JSON.parse(usersStr) : [];
  
  // Check if admin exists, if not create default admin
  if (!users.find(u => u.email === 'admin@snassociates.com')) {
    const adminUser: any = {
      id: 'admin-001',
      name: 'Super Admin',
      email: 'admin@snassociates.com',
      password: 'Admin@12345',
      role: 'admin',
      purchasedCourses: [],
      joinedAt: new Date().toISOString(),
      storageUsed: 0
    };
    users.push(adminUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
};

initDb();

// --- AUTH DATABASE ---

export const authDb = {
  register: (name: string, email: string, password: string, phone?: string): { success: boolean; message: string } => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser: User = { 
      id: Math.random().toString(36).substr(2, 9),
      name, 
      email, 
      phone,
      purchasedCourses: [],
      role: 'user',
      joinedAt: new Date().toISOString(),
      storageUsed: 0
    };
    
    const userWithPass = { ...newUser, password };
    users.push(userWithPass);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    securityDb.addLog(newUser.id, "Account Created", "success");
    return { success: true, message: 'Account created successfully' };
  },

  login: (email: string, password: string): { success: boolean; user?: User; message: string } => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      if (user.isBlocked) {
        securityDb.addLog(user.id, "Blocked Login Attempt", "error");
        return { success: false, message: 'Account is blocked. Contact support.' };
      }
      const { password: _, ...safeUser } = user;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
      securityDb.addLog(user.id, "System Login", "success");
      return { success: true, user: safeUser, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid email or password' };
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  },

  logout: () => {
    const user = authDb.getCurrentUser();
    if (user) securityDb.addLog(user.id, "System Logout", "success");
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getAllUsers: (): User[] => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    return users.map((u: any) => {
        const { password, ...safe } = u;
        return safe;
    });
  },

  toggleUserBlock: (userId: string) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const updated = users.map((u: any) => {
        if (u.id === userId && u.role !== 'admin') {
            const newStatus = !u.isBlocked;
            securityDb.addLog(userId, newStatus ? "Account Blocked by Admin" : "Account Unblocked by Admin", "warning");
            return { ...u, isBlocked: newStatus };
        }
        return u;
    });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
  }
};

// --- SECURITY LOG DATABASE ---

export const securityDb = {
  addLog: (userId: string, action: string, status: SecurityLog['status']) => {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
    const newLog: SecurityLog = {
      id: `LOG-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      action,
      status,
      timestamp: new Date().toISOString(),
      ipAddress: "192.168.1.1" // Mock IP
    };
    logs.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs.slice(0, 50))); // Keep last 50
    window.dispatchEvent(new Event("storage"));
  },
  getLogs: (userId: string): SecurityLog[] => {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
    return logs.filter((l: SecurityLog) => l.userId === userId);
  }
};

// --- DOCUMENT DATABASE ---

export const documentDb = {
  getDocuments: (userId: string): ClientDocument[] => {
    const docs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCUMENTS) || '[]');
    return docs.filter((d: ClientDocument) => d.userId === userId);
  },

  uploadDocument: (userId: string, name: string, category: ClientDocument['category'], size: number, type: ClientDocument['type']): ClientDocument | null => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find((u: any) => u.id === userId);
    
    if (!user) return null;
    
    // Storage limit check removed to satisfy client request for removal of 1GB limit visibility/enforcement

    const newDoc: ClientDocument = {
      id: `DOC-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      name,
      category,
      size,
      type,
      uploadedAt: new Date().toISOString(),
      status: 'pending'
    };

    const docs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCUMENTS) || '[]');
    docs.unshift(newDoc);
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));

    // Update User Storage
    const updatedUsers = users.map((u: any) => {
      if (u.id === userId) {
        return { ...u, storageUsed: u.storageUsed + size };
      }
      return u;
    });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

    // Sync current session
    const currentUser = authDb.getCurrentUser();
    if (currentUser?.id === userId) {
      const updatedSession = { ...currentUser, storageUsed: currentUser.storageUsed + size };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedSession));
    }

    securityDb.addLog(userId, `Uploaded: ${name}`, "success");
    window.dispatchEvent(new Event("storage"));
    return newDoc;
  },

  deleteDocument: (userId: string, docId: string) => {
    const docs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCUMENTS) || '[]');
    const docToDelete = docs.find((d: ClientDocument) => d.id === docId && d.userId === userId);
    
    if (!docToDelete) return;

    const updatedDocs = docs.filter((d: ClientDocument) => d.id !== docId);
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updatedDocs));

    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const updatedUsers = users.map((u: any) => {
      if (u.id === userId) {
        return { ...u, storageUsed: Math.max(0, u.storageUsed - docToDelete.size) };
      }
      return u;
    });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

    const currentUser = authDb.getCurrentUser();
    if (currentUser?.id === userId) {
      const updatedSession = { ...currentUser, storageUsed: Math.max(0, currentUser.storageUsed - docToDelete.size) };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedSession));
    }
    
    securityDb.addLog(userId, `Deleted Document: ${docToDelete.name}`, "warning");
    window.dispatchEvent(new Event("storage"));
  }
};

// --- CART DATABASE ---

export const cartDb = {
  getCart: (): Product[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
  },

  addToCart: (product: Product) => {
    const cart = cartDb.getCart();
    if (!cart.find(p => p.id === product.id)) {
      cart.push(product);
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
    }
  },

  removeFromCart: (productId: string) => {
    let cart = cartDb.getCart();
    cart = cart.filter(p => p.id !== productId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  },

  clearCart: () => {
    localStorage.removeItem(STORAGE_KEYS.CART);
    window.dispatchEvent(new Event("cart-updated"));
  },

  getCount: (): number => {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    return cart.length;
  }
};

// --- ORDER DATABASE ---

export const orderDb = {
    createOrder: (userId: string, items: Product[], totalAmount: number, paymentId: string): Order => {
        const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        const user = users.find((u: any) => u.id === userId);

        const newOrder: Order = {
            id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            userId,
            userName: user ? user.name : 'Unknown',
            userEmail: user ? user.email : 'Unknown',
            items,
            totalAmount,
            status: 'success',
            paymentId,
            date: new Date().toISOString()
        };

        orders.unshift(newOrder);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

        if (user) {
           const updatedUsers = users.map((u: any) => {
               if (u.id === userId) {
                   const existingCourses = u.purchasedCourses || [];
                   const newCourseIds = items.map(i => i.id);
                   return { ...u, purchasedCourses: [...new Set([...existingCourses, ...newCourseIds])] };
               }
               return u;
           });
           localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
           
           const currentUser = authDb.getCurrentUser();
           if (currentUser && currentUser.id === userId) {
               const updatedSession = updatedUsers.find((u: any) => u.id === userId);
               const { password, ...safeSession } = updatedSession;
               localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeSession));
           }
        }

        securityDb.addLog(userId, `Successful Purchase: ₹${totalAmount}`, "success");
        return newOrder;
    },

    getAllOrders: (): Order[] => {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    },

    getStats: () => {
        const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
        const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        return {
            revenue: totalRevenue,
            totalOrders: orders.length,
            totalUsers: users.filter((u: any) => u.role !== 'admin').length
        };
    }
};

export const simHelpers = {
    generateOTP: () => Math.floor(1000 + Math.random() * 9000).toString(),
    sendEmail: (to: string, subject: string, body: string) => {
        console.log(`%c[EMAIL SERVICE] Sending to ${to}...`, 'color: cyan; font-weight: bold;');
        return true;
    }
};
