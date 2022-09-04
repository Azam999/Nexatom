//@ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { Hop } from '@onehop/js';
import { z } from 'zod';

const schema = z.object({
    id: z.string(),
});

const hop = new Hop(process.env.HOP_PROJECT_TOKEN);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Must POST' });
    }

    const result = schema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({ success: false, message: 'Invalid body' });
        return;
    }

    const { id } = result.data;
    const data = { id };

    await hop.channels.setState('messages', (state) => ({
        atoms: state.atoms.filter((e) => e.id !== data.id),
    }))
}