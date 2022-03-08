import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "octokit";

const ORG = "42js";
const EMAIL_PROVIDER = "student.42seoul.kr";
const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { login } = req.body as {
    login?: string;
  };

  if (!login) return res.status(400).json({ message: "invaild body field..." });

  const email = `${login.trim()}@${EMAIL_PROVIDER}`;
  try {
    const { data } = await octokit.request("POST /orgs/{org}/invitations", {
      org: ORG,
      email,
    });
    return res.status(201).json({ message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "something was wrong..." });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return postHandler(req, res);
  }
  res.status(405).json({
    message: "method not allowed",
  });
}
