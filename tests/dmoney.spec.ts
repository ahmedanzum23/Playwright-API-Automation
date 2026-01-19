import { test, expect } from '@playwright/test';
import { DmoneyAPI } from '../services/DmoneyAPI';
import { clearUsers } from '../utils/dataManager';

test.describe('Dmoney API Automation - Complete Transaction Flow', () => {

    test.beforeAll(async () => {
        // Clear previous test data
        clearUsers();
    });

    test('Complete Dmoney transaction flow with all requirements', async ({ request }) => {
        const api = new DmoneyAPI(request);

        console.log('\nStarting Dmoney API Automation...\n');

        // Step 0: Login (or use existing token)
        console.log('Authenticating...');
        if (process.env.ADMIN_TOKEN) {
            console.log('Using existing token from .env');
            api.setToken(process.env.ADMIN_TOKEN);
        } else {
            const email = process.env.ADMIN_EMAIL || 'admin@roadtocareer.net';
            const password = process.env.ADMIN_PASSWORD || '1234';
            await api.login(email, password);
        }

        // Step 1: Create 2 customers
        console.log('\nStep 1: Creating 2 customers...');
        const customer1 = await api.createCustomer();
        const customer2 = await api.createCustomer();
        expect(customer1.id).toBeDefined();
        expect(customer2.id).toBeDefined();

        // Step 2: Create 1 agent
        console.log('\nStep 2: Creating 1 agent...');
        const agent = await api.createAgent();
        expect(agent.id).toBeDefined();

        // Step 3: Create 1 merchant
        console.log('\nStep 3: Creating 1 merchant...');
        const merchant = await api.createMerchant();
        expect(merchant.id).toBeDefined();

        // Step 4: System gives 2000 TK to agent
        console.log('\nStep 4: System -> Agent (2000 TK)...');
        const SYSTEM_ACCOUNT = 'SYSTEM'; // System account phone number
        const depositResp = await api.deposit(SYSTEM_ACCOUNT, agent.phone, 2000);
        expect(depositResp.message).toContain('Deposit successful');

        // Step 5: Agent deposits 1500 TK to customer1
        console.log('\nStep 5: Agent -> Customer1 Deposit (1500 TK)...');
        await api.deposit(agent.phone, customer1.phone, 1500);

        // Step 6: Customer1 withdraws 500 TK to agent
        console.log('\nStep 6: Customer1 -> Agent Withdraw (500 TK)...');
        await api.withdraw(customer1.phone, agent.phone, 500);

        // Step 7: Customer1 sends 500 TK to customer2
        console.log('\nStep 7: Customer1 -> Customer2 Send Money (500 TK)...');
        await api.sendMoney(customer1.phone, customer2.phone, 500);

        // Step 8: Customer2 pays 100 TK to merchant
        console.log('\nStep 8: Customer2 -> Merchant Payment (100 TK)...');
        await api.payment(customer2.phone, merchant.phone, 100);

        // Step 9: Check balance of customer2
        console.log('\nStep 9: Checking Customer2 balance...');
        const customer2Balance = await api.checkBalance(customer2.phone);

        // Final Assertions
        console.log('\nRunning final assertions...');

        // Customer2 should have 395 TK (500 received - 100 paid - 5 fee)
        expect(customer2Balance).toBe(395);
        console.log(`Customer2 balance verified: ${customer2Balance} TK (including 5 TK fee)`);

        console.log('\nAll tests passed successfully!\n');
    });
});
