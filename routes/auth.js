import { UnipileClient } from "unipile-node-sdk";
import express from 'express';
import { createUser, createUnipileEntry, getPasswordByUserId, getAccountByUserId, accountExists } from '../db/index.js';

// SDK setup
const BASE_URL = "https://api11.unipile.com:14141";
const ACCESS_TOKEN = "8jFgCxS8.FHvDskdntvvqqguuZlG7kHKfnC+brXYW+MwxWJA1A2M=";
const provider = "LINKEDIN";
let account_id = "account_id";
let code = "2FA/OTP code";

const router = express.Router();

router.post('/signin', async (req, res) => {
    let { username, password } = req.body;
    try {
        const savedPassword = await getPasswordByUserId(username);
        if (savedPassword && savedPassword.password === password) {
            return res.json({ success: true, user_id: username });
        } else {
            return res.status(401).json({ success: false, error: 'Invalid credentials.' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});


router.post('/signup', async (req, res) => {
    let { username, password } = req.body;
    try {
        const savedAccount = await getPasswordByUserId(username);
        if (savedAccount) {
            return res.status(409).json({ success: false, error: 'User already exists. Please log in.' });
        } else {
            await createUser(username, password);

            return res.json({ success: true, user_id: username });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});



router.post('/connectlinkedin', async (req, res) => {
    let { userId, username, password } = req.body;
    const client = new UnipileClient(BASE_URL, ACCESS_TOKEN);

    try {

        let response;
        
        response = await client.account.connect({
            username,
            password,
            provider,
        });

        console.log(response);
        account_id = response.account_id;


        const exists = await accountExists(userId, account_id, provider);
        console.log('Account exists:', exists);
        if (!exists) {
            // Account does not exist, create new entry
            await createUnipileEntry(userId, account_id, provider);
        }

        res.json({ success: true, account_id: response.account_id });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to connect LinkedIn.' });
    }
});

router.post('/connectlinkedincookie', async (req, res) => {
    // Example: Use Unipile SDK or API to connect LinkedIn for the user
    const { userId, li_at, li_a } = req.body;
    const client = new UnipileClient(BASE_URL, ACCESS_TOKEN);

    try {

        const response = await client.account.connect({
            access_token: li_at,
            provider,
        });
        account_id = response.account_id;


        const exists = await accountExists(account_id);
        console.log('Account exists:', exists);
        
        if (!exists) {
            // Account does not exist, create new entry
            await createUnipileEntry(userId, account_id, provider);
        }

        res.json({ success: true, account_id: response.account_id });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to connect LinkedIn.' });
    }
});


export default router;