import express from 'express';
import { getAccountByUserId } from '../db/index.js';


const router = express.Router();


router.post('/getaccounts', async (req, res) => {
    const { userId } = req.body;
    console.log('Received userId:', userId);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const accounts = await getAccountByUserId(userId);
        console.log(accounts);
        res.json({success: true, accounts: accounts });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch accounts' });
    };
});

export default router;