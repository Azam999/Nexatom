// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//@ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { Hop } from '@onehop/js';
import { z } from 'zod';

const schema = z.object({
    id: z.string(),
    x: z.number(),
    y: z.number(),
    realm: z.string()
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

    const { id, x, y,realm } = result.data;

    const data = { id, x, y, realm };

    await hop.channels.publishMessage('messages', 'MESSAGE_CREATE', data);

    await hop.channels.setState('messages', (state) => ({
        atoms:
            state.atoms.length <= 0
                ? [data, ...state.atoms].slice(0, 20)
                : state.atoms.filter((e) => e.id == data.id).length > 0
                ? state.atoms.map((x) => {
                      const atom = [data].find(({ id }) => id === x.id);
                      return atom ? atom : x;
                  })
                : [data, ...state.atoms].slice(0, 20),
    }));

    res.json({
        success: true,
    });
}
