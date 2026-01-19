import { APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { saveUser, User } from '../utils/dataManager';

export class DmoneyAPI {
    private request: APIRequestContext;
    private baseURL: string;
    private token: string;

    constructor(request: APIRequestContext) {
        this.request = request;
        this.baseURL = process.env.BASE_URL || 'https://dmoney.roadtocareer.net';
        this.token = process.env.ADMIN_TOKEN || '';
    }

    /**
     * Authenticate and get the token
     */
    async login(email: string, password: string): Promise<string> {
        const response = await this.request.post(`${this.baseURL}/user/login`, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                email: email,
                password: password
            }
        });

        const responseData = await response.json();

        if (response.ok() && responseData.token) {
            this.token = responseData.token;
            console.log(`Successfully logged in as: ${email}`);
            return this.token;
        } else {
            throw new Error(`Login failed: ${JSON.stringify(responseData)}`);
        }
    }

    /**
     * Public method to set token manually if needed
     */
    setToken(token: string): void {
        this.token = token;
    }

    /**
     * Create a new customer
     */
    async createCustomer(): Promise<User> {
        const user: User = {
            name: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            password: 'Pass@123',
            phone: '01500' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
            nid: '123456789',
            role: 'Customer'
        };

        const response = await this.request.post(`${this.baseURL}/user/create`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
                'X-AUTH-SECRET-KEY': 'ROADTOSDET'
            },
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
                phone_number: user.phone,
                nid: user.nid,
                role: user.role
            }
        });

        const responseData = await response.json();

        if (response.ok() && responseData.user) {
            user.id = responseData.user.id;
            saveUser(user);
            console.log(`Created Customer: ${user.name} | Phone: ${user.phone}`);
            return user;
        } else {
            console.error(`Create Customer failed [${response.status()}]:`, responseData);
            throw new Error(`Failed to create customer: ${JSON.stringify(responseData)}`);
        }
    }

    /**
     * Create a new agent
     */
    async createAgent(): Promise<User> {
        const user: User = {
            name: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            password: 'Pass@123',
            phone: '01600' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
            nid: '123456789',
            role: 'Agent'
        };

        const response = await this.request.post(`${this.baseURL}/user/create`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
                'X-AUTH-SECRET-KEY': 'ROADTOSDET'
            },
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
                phone_number: user.phone,
                nid: user.nid,
                role: user.role
            }
        });

        const responseData = await response.json();

        if (response.ok() && responseData.user) {
            user.id = responseData.user.id;
            saveUser(user);
            console.log(`Created Agent: ${user.name} | Phone: ${user.phone}`);
            return user;
        } else {
            throw new Error(`Failed to create agent: ${JSON.stringify(responseData)}`);
        }
    }

    /**
     * Create a new merchant
     */
    async createMerchant(): Promise<User> {
        const user: User = {
            name: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            password: 'Pass@123',
            phone: '01700' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
            nid: '123456789',
            role: 'Merchant'
        };

        const response = await this.request.post(`${this.baseURL}/user/create`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
                'X-AUTH-SECRET-KEY': 'ROADTOSDET'
            },
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
                phone_number: user.phone,
                nid: user.nid,
                role: user.role
            }
        });

        const responseData = await response.json();

        if (response.ok() && responseData.user) {
            user.id = responseData.user.id;
            saveUser(user);
            console.log(`Created Merchant: ${user.name} | Phone: ${user.phone}`);
            return user;
        } else {
            throw new Error(`Failed to create merchant: ${JSON.stringify(responseData)}`);
        }
    }

    /**
     * Deposit money from one account to another
     */
    async deposit(fromPhone: string, toPhone: string, amount: number): Promise<any> {
        const response = await this.request.post(`${this.baseURL}/transaction/deposit`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
                'X-AUTH-SECRET-KEY': 'ROADTOSDET'
            },
            data: {
                from_account: fromPhone,
                to_account: toPhone,
                amount: amount
            }
        });

        const responseData = await response.json();

        if (response.ok()) {
            console.log(`Deposit: ${fromPhone} -> ${toPhone} | Amount: ${amount} TK`);
            return responseData;
        } else {
            console.error(`Deposit failed [${response.status()}]:`, responseData);
            throw new Error(`Deposit failed: ${JSON.stringify(responseData)}`);
        }
    }

    /**
     * Withdraw money
     */
    async withdraw(fromPhone: string, toPhone: string, amount: number): Promise<any> {
        const response = await this.request.post(`${this.baseURL}/transaction/withdraw`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
                'X-AUTH-SECRET-KEY': 'ROADTOSDET'
            },
            data: {
                from_account: fromPhone,
                to_account: toPhone,
                amount: amount
            }
        });

        const responseData = await response.json();

        if (response.ok()) {
            console.log(`Withdraw: ${fromPhone} -> ${toPhone} | Amount: ${amount} TK`);
            return responseData;
        } else {
            throw new Error(`Withdraw failed: ${JSON.stringify(responseData)}`);
        }
    }

    /**
     * Send money to another user
     */
    async sendMoney(fromPhone: string, toPhone: string, amount: number): Promise<any> {
        const response = await this.request.post(`${this.baseURL}/transaction/sendMoney`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
                'X-AUTH-SECRET-KEY': 'ROADTOSDET'
            },
            data: {
                from_account: fromPhone,
                to_account: toPhone,
                amount: amount
            }
        });

        const responseData = await response.json();

        if (response.ok()) {
            console.log(`Send Money: ${fromPhone} -> ${toPhone} | Amount: ${amount} TK`);
            return responseData;
        } else {
            throw new Error(`Send money failed: ${JSON.stringify(responseData)}`);
        }
    }

    /**
     * Make payment to merchant
     */
    async payment(fromPhone: string, toPhone: string, amount: number): Promise<any> {
        const response = await this.request.post(`${this.baseURL}/transaction/payment`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
                'X-AUTH-SECRET-KEY': 'ROADTOSDET'
            },
            data: {
                from_account: fromPhone,
                to_account: toPhone,
                amount: amount
            }
        });

        const responseData = await response.json();

        if (response.ok()) {
            console.log(`Payment: ${fromPhone} -> ${toPhone} | Amount: ${amount} TK`);
            return responseData;
        } else {
            throw new Error(`Payment failed: ${JSON.stringify(responseData)}`);
        }
    }

    /**
     * Check account balance
     */
    async checkBalance(phone: string): Promise<number> {
        const response = await this.request.get(`${this.baseURL}/transaction/balance/${phone}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
                'X-AUTH-SECRET-KEY': 'ROADTOSDET'
            }
        });

        const responseData = await response.json();

        if (response.ok() && responseData.balance !== undefined) {
            console.log(`Balance for ${phone}: ${responseData.balance} TK`);
            return responseData.balance;
        } else {
            throw new Error(`Failed to check balance: ${JSON.stringify(responseData)}`);
        }
    }
}
