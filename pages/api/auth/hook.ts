import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, secret } = req.body;
  if (req.method !== "POST") {
    return res.status(403).json({ message: "method not allowed!! use POST" });
  }

  if (secret !== process.env.AUTH0_HOOK_SECRET) {
    return res.status(403).json({ message: "You must provide correct secret" });
  }

  if (email) {
    await prisma.user.create({
      data: { email },
    });
    return res.status(200).json({
      message: `user with email: ${email} has been created successfully`,
    });
  }
};

export default handler;
