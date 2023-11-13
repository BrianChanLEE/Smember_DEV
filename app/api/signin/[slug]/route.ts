import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
interface SendVerificationCodeRequestBody {
  email: string;
}

// import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
// // app/api/users/[query]/route.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import { logger } from "@/src/middleware/logger";

// import {
//   registerUser,
//   loginUser,
//   deleteUser,
//   sendVerificationCode,
// } from "@/src/controllers/userController";

// const userHandler = async (
//   req: NextApiRequest,
//   res: NextApiResponse,
//   { params }: { params: { param: string } }
// ) => {
//   const method = req.method;
//   const param1 = req.params.param[0];
//   const param2 = req.query.param[1];

//   switch (method) {
//     case "POST":
//       try {
//         if (param1 === "code") {
//           await sendVerificationCode(req, res);
//         } else if (param1 === "Registration") {
//           await registerUser(req, res);
//         } else if (param1 === "login") {
//           await loginUser(req, res);
//         }
//       } catch (error) {
//         if (error instanceof Error) {
//           logger.error(error.message);
//           res.status(500).json({ message: "Internal Server Error" });
//         }
//       }
//       break;

//     case "DELETE":
//       try {
//         if (param1 === "DELETE") {
//           await deleteUser(req, res);
//         }
//       } catch (error) {
//         if (error instanceof Error) {
//           logger.error(error.message);
//           res.status(500).json({ message: "Internal Server Error" });
//         }
//       }
//       break;

//     default:
//       res.status(400).json({ error: "잘못된 param 입니다" });
//       break;
//   }
// };

// export { userHandler as POST, userHandler as DELETE };

// // import {
// //   registerUser,
// //   loginUser,
// //   deleteUser,
// //   sendVerificationCode,
// // } from "@/src/controllers/userController";

// // export default function userRoute(req, res) {
// //   const { method } = req;

// //   switch (method) {
// //     case "GET":
// //       break;
// //     case "POST":
// //       // 회원가입 또는 로그인 로직
// //       break;
// //     case "DELETE":
// //       // 회원탈퇴 로직
// //       break;
// //     default:
// //       res.setHeader("Allow", ["GET", "POST", "DELETE"]);
// //       res.status(405).end(`Method ${method} Not Allowed`);
// //   }
// // }

// import { logger } from "@/src/middleware/logger";
// import {
//   registerUser,
//   loginUser,
//   sendVerificationCode,
// } from "@/src/controllers/userController";
// import { NextApiRequest, NextApiResponse } from "next";

// export async function POST(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   { params }: { params: { param: string } }
// ) {
//   const param = params.param;
//   switch (param) {
//     case "code":
//       try {
//         await sendVerificationCode(req, res);
//       } catch (error) {
//         if (error instanceof Error) {
//           logger.error(error.message);
//           res.status(500).json({ message: "Internal Server Error" });
//         }
//       }
//       break;

//     case "Registration":
//       try {
//         await registerUser(req, res);
//       } catch (error) {
//         if (error instanceof Error) {
//           logger.error(error.message);
//           res.status(500).json({ message: "Internal Server Error" });
//         }
//       }
//       break;

//     case "login":
//       try {
//         await loginUser(req, res);
//       } catch (error) {
//         if (error instanceof Error) {
//           logger.error(error.message);
//           res.status(500).json({ message: "Internal Server Error" });
//         }
//       }
//       break;
//   }
// }

// src/api/signin/[..param]/route.ts

// // src/api/signin/[..param]/route.ts

// import { NextApiRequest, NextApiResponse } from "next";
// import {
//   loginUser,
//   registerUser,
//   deleteUser,
//   sendVerificationCode,
// } from "@/src/controllers/userController";

// // 공통 처리 함수
// const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {

//   try {
//     if (req.method === "POST") {
//       switch (param[0]) {
//         case "login":
//           await loginUser(req, res);
//           break;
//         case "register":
//           await registerUser(req, res);
//           break;
//         case "send-verification":
//           await sendVerificationCode(req, res);
//           break;
//         default:
//           res.status(404).json({ error: "Not found" });
//       }
//     } else if (req.method === "DELETE") {
//       if (param[0] === "delete") {
//         await deleteUser(req, res);
//       } else {
//         res.status(404).json({ error: "Not found" });
//       }
//     } else {
//       res.status(405).json({ error: "Method not allowed" });
//     }
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error(error.message);
//       res.status(500).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: "Unknown server error" });
//     }
//   }
// };

// export { handleRequest as POST, handleRequest as DELETE };

// src/api/signin/[id]/route.ts

// import {
//   loginUser,
//   registerUser,
//   deleteUser,
//   sendVerificationCode,
// } from "@/src/_services/userService";

// const handler = async (request: Request, { params }) => {
//   const method = request.method;
//   const param1 = params.params[0];
//   const param2 = params.params[1];
//   try {
//     switch (method) {
//       case "POST":
//         // POST 요청 처리
//         if (param1 === "login") {
//           await loginUser(request);
//         } else if (param1 === "register") {
//           // const id = Number(param2);
//           await registerUser(id);
//         } else if (param1 === "send-verification") {
//           await sendVerificationCode(request);
//         } else {
//           Response.json({ error: "Not found" }), { status: 404 };
//         }
//         break;

//       case "DELETE":
//         // DELETE 요청 처리
//         if (param1 === "delete") {
//           await deleteUser(request);
//         } else {
//           Response.json({ error: "Not found" }), { status: 404 };
//         }
//         break;

//       default:
//         // 그 외 요청에 대한 처리
//         Response.json({ error: "Method not allowed" }), { status: 405 };
//         break;
//     }
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error(error.message);
//       Response.json({ error: error.message }), { status: 500 };
//     } else {
//       Response.json({ error: "Unknown server error" }), { status: 500 };
//     }
//   }
// };
// export { handler as POST, handler as DELETE };

import {
  loginUser,
  registerUser,
  deleteUser,
  sendVerificationCode,
} from "@/src/_services/userService";

export async function POST(
  request: Request,

  { params }: { params: { slug: string } }
) {
  const actionKind = params.slug;
  console.log("actionKind :" + actionKind);
  switch (actionKind) {
    case "login":
      try {
        await loginUser(request);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
      break;

    case "register":
      try {
        await registerUser(request);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
      break;

    case "Code":
      try {
        const data = await request.json();
        const body: SendVerificationCodeRequestBody = data;
        // console.log("body :" + body);
        // 요청 본문 검증
        if (!body.email) {
          return new Response(
            JSON.stringify({ error: "이메일을 입력해 주세요." }),
            { status: 400 }
          );
        }
        // console.log(" sendVerificationCode:" + "start");
        // console.log("body :" + body);
        await sendVerificationCode(body);
        console.log("body :" + body);
        return new Response(
          JSON.stringify({ success: true, message: "Verification code sent" }),
          { status: 200 }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Failed to send verification code" }),
          { status: 500 }
        );
      }
      break;

    default:
      return new Response(JSON.stringify({ error: "잘못된 param 입니다" }), {
        status: 400,
      });
      break;
  }
}