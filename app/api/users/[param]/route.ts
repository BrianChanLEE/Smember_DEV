// app/api/users/[param]/route.ts

import {
  registerUser,
  loginUser,
  deleteUser,
} from "@/src/controllers/userController";

export default function userRoute(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      // 사용자 정보 조회 로직
      break;
    case "POST":
      // 회원가입 또는 로그인 로직
      break;
    case "DELETE":
      // 회원탈퇴 로직
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
