import * as fs from 'fs';
import * as path from 'path';

const DATA_FILE = path.join(__dirname, '../data/users.json');

export interface User {
    name: string;
    email: string;
    password: string;
    phone: string;
    nid: string;
    role: string;
    id?: number;
}

export interface UsersData {
    customers: User[];
    agents: User[];
    merchants: User[];
}

/**
 * Load all users from JSON file
 */
export function loadUsers(): UsersData {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.log('No existing users file, returning empty data');
        return { customers: [], agents: [], merchants: [] };
    }
}

/**
 * Save user to JSON file
 */
export function saveUser(user: User): void {
    const users = loadUsers();

    if (user.role === 'Customer') {
        users.customers.push(user);
    } else if (user.role === 'Agent') {
        users.agents.push(user);
    } else if (user.role === 'Merchant') {
        users.merchants.push(user);
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    console.log(`Saved ${user.role}: ${user.name} (${user.phone})`);
}

/**
 * Get user by role
 */
export function getUserByRole(role: string, index: number = 0): User | null {
    const users = loadUsers();

    if (role === 'Customer' && users.customers[index]) {
        return users.customers[index];
    } else if (role === 'Agent' && users.agents[index]) {
        return users.agents[index];
    } else if (role === 'Merchant' && users.merchants[index]) {
        return users.merchants[index];
    }

    return null;
}

/**
 * Clear all users (useful for testing)
 */
export function clearUsers(): void {
    const emptyData: UsersData = { customers: [], agents: [], merchants: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(emptyData, null, 2));
    console.log('Cleared all users');
}
