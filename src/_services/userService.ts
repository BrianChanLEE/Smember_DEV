// src/controller/userController.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/src/lib/prisma"; // Prisma Client 인스턴스
import { sendVerificationEmail } from "@/src/lib/mailer"; // nodemailer를 사용하는 이메일 전송 함수
import { logger } from "@/src/middleware/logger";
import { signJwtAccessToken } from "@/src/lib/jwt";
import bcrypt from "bcrypt";
import { now } from "next-auth/client/_utils";

//회원가입
export async function registerUser(req: any) {
  try {
    if (!req.email || !req.verificationCode) {
      return new Response(
        JSON.stringify({ error: "Missing email or verification code" }),
        { status: 401 }
      );
    }

    // 이메일 중복 확인
    const existingUser = await prisma.users.findUnique({
      where: { email: req.email },
    });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already in use" }), {
        status: 409,
      });
    }

    // 검증 코드 확인
    const validCode = await prisma.verification_codes.findFirst({
      where: {
        email: req.email,
        verification_code: req.verificationCode,
      },
    });
    if (!validCode) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired verification code" }),
        { status: 400 }
      );
    }

    // 사용자 데이터 저장
    const newUser = await prisma.users.create({
      data: {
        email: req.email,
        verificationCode: req.verificationCode,
        createdAt: new Date(),
        isVerified: false,
      },
    });

    // 사용자를 성공적으로 등록한 후 isVerified를 true로 업데이트
    const updatedUser = await prisma.users.update({
      where: {
        email: req.email,
      },
      data: {
        isVerified: true,
        updatedAt: new Date(),
      },
    });

    console.debug("New user registered and verified:", updatedUser);

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      console.error("Registration error:", error.message);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
      });
    }
  }
}

// 로그인 함수
export async function loginUser(req: any) {
  try {
    if (!req.username || !req.verificationCode) {
      return { error: "이메일과 검증 코드를 입력해 주세요.", status: 400 };
    }

    const user = await prisma.users.findUnique({
      where: { email: req.username },
    });

    if (!user) {
      return { error: "User not found", status: 404 };
    }

    if (await bcrypt.compare(req.verificationCode, user.verificationCode)) {
      const { verificationCode, ...userWithoutCode } = user;
      const accessToken = signJwtAccessToken(userWithoutCode);
      return { ...userWithoutCode, accessToken, status: 200 };
    } else {
      return { error: "Invalid verification code", status: 401 };
    }
  } catch (error) {
    logger.error(error.message);
    return { error: "Internal server error", status: 500 };
  }
}
// export async function loginUser(req: any) {
//   try {
//     // // 요청 본문 검증
//     // if (!req.username || !req.verificationCode) {
//     //   return new Response(
//     //     JSON.stringify({ error: "이메일과 검증 코드를 입력해 주세요." }),
//     //     { status: 400 }
//     //   );
//     // }

//     // 사용자 확인
//     const user = await prisma.users.findUnique({
//       where: { email: req.username },
//     });

//     if (!user) {
//       return new Response(JSON.stringify({ error: "User not found" }), {
//         status: 404,
//       });
//     }

//     // bcrypt를 사용하여 검증 코드 확인
//     if (user && (req.verificationCode, user.verificationCode)) {
//       // 검증 코드를 제외한 사용자 정보 추출
//       const { verificationCode, ...userWithoutCode } = user;

//       // JWT 토큰 생성
//       const accessToken = signJwtAccessToken(userWithoutCode);

//       const result = {
//         ...userWithoutCode,
//         accessToken,
//       };
//       return new Response(JSON.stringify(result), { status: 200 });
//     }

//     return new Response(
//       JSON.stringify({ error: "Invalid verification code" }),
//       { status: 401 }
//     );
//   } catch (error) {
//     if (error instanceof Error) {
//       logger.error(error.message);
//       console.error("Login error:", error.message);
//       return new Response(JSON.stringify({ error: "Internal server error" }), {
//         status: 500,
//       });
//     }
//   }
// }

//검증코드 발송
export async function sendVerificationCode(req: any) {
  try {
    // 사용자 확인
    const user = await prisma.users.findUnique({
      where: { email: req.email },
    });
    console.log("user :" + req.email);

    // 검증 코드 생성
    const verificationCode = Math.random().toString(36).substring(2, 15);

    if (!user) {
      // 새 사용자인 경우, 검증 코드를 DB에 저장
      await prisma.verification_codes.create({
        data: {
          email: req.email,
          verification_code: verificationCode,
          expires_at: new Date(Date.now() + 180000), //시간제한 3분 제한시간후 데이터 삭제
        },
      });
      setTimeout(async () => {
        await prisma.verification_codes.deleteMany({
          where: {
            expires_at: {
              lt: new Date(), // 현재 시간보다 이전인 만료 시간을 가진 데이터 삭제
            },
          },
        });
      }, 60000); // 매 분마다 확인
    } else {
      // 기존 사용자인 경우, 사용자의 검증 코드를 업데이트
      await prisma.users.update({
        where: { email: req.email },
        data: { verificationCode: verificationCode },
      });
    }

    // 이메일 전송
    const emailSendResult = await sendVerificationEmail(
      req.email,
      verificationCode
    );
    if (emailSendResult.success) {
      console.log("xxxxx");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Verification code sent successfully",
        })
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to send verification code",
        })
      );
    }
  } catch (error) {
    // 에러 처리
    console.error("Error sending verification code:", error.message);
    return new Response(
      JSON.stringify({ success: false, message: error.message })
    );
  }
}

// // 회원탈퇴 함수
// export async function deleteUser(req: any) {
//   try {
//     const { email, verificationCode }: DeleteUserRequestBody = await req.json();

//     // 요청 본문 검증
//     if (!email || !verificationCode) {
//       return new Response(
//         JSON.stringify({ error: "사용자 ID와 검증 코드를 입력해 주세요." }),
//         { status: 400 }
//       );
//     }

//     // 사용자 확인
//     const user = await prisma.users.findUnique({ where: { email: email } });
//     if (!user) {
//       return new Response(JSON.stringify({ error: "User not found" }), {
//         status: 404,
//       });
//     }

//     // 검증 코드 확인
//     if (user.verificationCode !== verificationCode) {
//       return new Response(
//         JSON.stringify({ error: "Invalid verification code" }),
//         { status: 401 }
//       );
//     }

//     // 사용자 삭제
//     await prisma.users.delete({ where: { email: email } });

//     return new Response(
//       JSON.stringify({ message: "User successfully deleted" }),
//       { status: 200 }
//     );
//   } catch (error) {
//     // 에러 처리
//     console.error("Delete user error:", error.message);
//     return new Response(JSON.stringify({ error: "Internal server error" }), {
//       status: 500,
//     });
//   }
// }
// // src/controller/userController.ts

// import { NextApiRequest, NextApiResponse } from "next";
// import prisma from "@/src/lib/prisma"; // Prisma Client 인스턴스
// import { sendVerificationEmail } from "@/src/lib/mailer"; // nodemailer를 사용하는 이메일 전송 함수
// import { logger } from "@/src/middleware/logger";
// import { signJwtAccessToken } from "@/src/lib/jwt";
// import bcrypt from "bcrypt";

// interface RegisterRequestBody {
//   email: string;
//   verificationCode: number;
// }

// interface LoginRequestBody {
//   username: string;
//   verificationCode: number;
// }

// interface DeleteUserRequestBody {
//   email: string;
//   verificationCode: number;
// }

// interface SendVerificationCodeRequestBody {
//   email: string;
// }

// //회원가입
// export async function registerUser(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const body = req.body as RegisterRequestBody;
//     if (!body.email || !body.verificationCode) {
//       return res
//         .status(400)
//         .json({ error: "이메일과 검증 코드를 모두 입력해 주세요." });
//     }

//     // 이메일 중복 확인
//     const existingUser = await prisma.users.findUnique({
//       where: { email: body.email },
//     });
//     if (existingUser) {
//       return res.status(409).json({ error: "Email already in use" });
//     }

//     // 검증 코드 확인
//     const validCode = await prisma.verification_codes.findFirst({
//       where: {
//         email: body.email,
//         verification_code: body.verificationCode,
//       },
//     });
//     if (!validCode) {
//       return res
//         .status(400)
//         .json({ error: "Invalid or expired verification code" });
//     }

//     // 사용자 데이터 저장
//     const newUser = await prisma.users.create({
//       data: {
//         email: body.email,
//         verificationCode: body.verificationCode,
//       },
//     });

//     res.status(201).json(newUser);
//   } catch (error) {
//     if (error instanceof Error) {
//       logger.error(error.message);
//       console.error(error.message);
//       res.status(500).json({ error: error.message });
//     }
//   }
// }

// // 로그인 함수
// export async function loginUser(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const body: LoginRequestBody = await req.json();

//     if (!body.username || !body.verificationCode) {
//       return res
//         .status(400)
//         .json({ error: "이메일과 검증 코드를 입력해 주세요." });
//     }

//     // 사용자 확인
//     const user = await prisma.users.findUnique({
//       where: { email: body.username },
//     });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // bcrypt를 사용하여 verificationCode 확인
//     if (
//       user &&
//       (await bcrypt.compare(body.verificationCode, user.verificationCode))
//     ) {
//       // verificationCode를 제외한 사용자 정보 추출
//       const { verificationCode, ...userWithoutCode } = user;

//       // JWT 토큰 생성
//       const accessToken = signJwtAccessToken(userWithoutCode);

//       const result = {
//         ...userWithoutCode,
//         accessToken,
//       };

//       return res.status(200).json(result);
//     }

//     return res.status(401).json({ error: "Invalid verification code" });
//   } catch (error) {
//     if (error instanceof Error) {
//       logger.error(error.message);
//       console.error(error.message);
//       res.status(500).json({ error: error.message });
//     }
//   }
// }

// // 회원탈퇴 함수
// export async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const { email, verificationCode }: DeleteUserRequestBody = await req.json();
//     if (!email || !verificationCode) {
//       return res
//         .status(400)
//         .json({ error: "사용자 ID와 검증 코드를 입력해 주세요." });
//     }

//     // 사용자 확인
//     const user = await prisma.users.findUnique({
//       where: { email: email },
//     });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // 검증 코드 확인
//     if (user.verificationCode !== verificationCode) {
//       return res.status(401).json({ error: "Invalid verification code" });
//     }

//     // 사용자 삭제
//     await prisma.users.delete({
//       where: { email: email },
//     });

//     res.status(200).json({ message: "User successfully deleted" });
//   } catch (error) {
//     if (error instanceof Error) {
//       logger.error(error.message);
//       console.error(error.message);
//       res.status(500).json({ error: error.message });
//     }
//   }
// }

// //검증코드 발송
// export async function sendVerificationCode(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     const body = req.body as SendVerificationCodeRequestBody;
//     if (!body.email) {
//       return res.status(400).json({ error: "이메일을 입력해 주세요." });
//     }

//     // 사용자 확인
//     const user = await prisma.users.findUnique({
//       where: { email: body.email },
//     });

//     // 검증 코드 생성
//     const verificationCode = Math.random().toString(36).substring(2, 15);

//     if (!user) {
//       // 새 사용자인 경우, 검증 코드를 DB에 저장
//       await prisma.verification_codes.create({
//         data: {
//           email: body.email,
//           verification_code: verificationCode,
//         },
//       });
//     } else {
//       // 기존 사용자인 경우, 사용자의 검증 코드를 업데이트
//       await prisma.users.update({
//         where: { email: body.email },
//         data: { verificationCode: verificationCode },
//       });
//     }

//     // 이메일 전송
//     await sendVerificationEmail(body.email, verificationCode);

//     res.status(200).json({ success: true, message: "Verification code sent" });
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("Error sending verification code: ", error.message);
//     }
//     res.status(500).json({ error: "Failed to send verification code" });
//   }
// }
