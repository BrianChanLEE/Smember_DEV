// src/controller/userController.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/src/lib/prisma"; // Prisma Client 인스턴스
import { sendVerificationEmail } from "@/src/lib/mailer"; // nodemailer를 사용하는 이메일 전송 함수
import { logger } from "@/src/middleware/logger";

interface RegisterRequestBody {
  email: string;
  verificationCode: number;
}

interface LoginRequestBody {
  email: string;
  verificationCode: number;
}

interface DeleteUserRequestBody {
  userId: number;
}

interface SendVerificationCodeRequestBody {
  email: string;
}

// 회원가입 함수
export async function registerUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = req.body as RegisterRequestBody;
    if (!body.email) {
      return res.status(400).json({ error: "이메일을 입력해 주세요." });
    }

    // 이메일 중복 확인
    const existingUser = await prisma.users.findUnique({
      where: { email: body.email },
    });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // 사용자 데이터 저장
    const newUser = await prisma.users.create({
      data: {
        email: body.email,
        verificationCode: body.verificationCode,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

// 로그인 함수
export async function loginUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = req.body as LoginRequestBody;
    if (!body.email || !body.verificationCode) {
      return res
        .status(400)
        .json({ error: "이메일과 검증 코드를 입력해 주세요." });
    }

    // 사용자 확인
    const user = await prisma.users.findUnique({
      where: { email: body.email },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // verificationCode 확인
    if (user.verificationCode !== body.verificationCode) {
      return res.status(401).json({ error: "Invalid verification code" });
    }

    // 로그인 성공 처리 (예: JWT 토큰 생성 및 반환)
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

// 회원탈퇴 함수
export async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = req.body.userId as DeleteUserRequestBody;
    if (!userId) {
      return res.status(400).json({ error: "사용자 ID를 입력해 주세요." });
    }

    // 사용자 확인
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 사용자 삭제
    await prisma.users.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

// 검증 코드 전송 함수
export async function sendVerificationCode(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const body = req.body as SendVerificationCodeRequestBody;
    if (!body.email) {
      return res.status(400).json({ error: "이메일을 입력해 주세요." });
    }

    // 사용자 확인
    const user = await prisma.users.findUnique({
      where: { email: body.email },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 검증 코드 생성
    const verificationCode = Math.random().toString(36).substring(2, 15);

    // 검증 코드를 DB에 저장
    await prisma.verification_codes.create({
      data: {
        email: body.email,
        verification_code: verificationCode,
      },
    });

    // 이메일 전송
    await sendVerificationEmail(body.email, verificationCode);

    res.status(200).json({ success: true, message: "Verification code sent" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending verification code: ", error.message);
      // 여기에 로거를 사용할 수 있습니다. 예: logger.error(error.message);
    }
    res.status(500).json({ error: "Failed to send verification code" });
  }
}
