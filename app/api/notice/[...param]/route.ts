import * as noticeService from "@/src/_services/noticeService";
import { verifyJwt } from "@/src/lib/jwt";
interface createNoticeRequestBody {
  subject: string;
  contents: string;
}
interface findPublished {
  status: boolean;
}

interface noticesUpdateInput {
  subject?: string;
  contents?: string;
  status?: string;
  userId?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
}

const handler = async (req: any, { params }) => {
  const method = req.method;
  const param1 = params.param[0];
  const param2 = params.param[1];
  const accessToken = req.headers.get("authorization");
  switch (method) {
    case "POST":
      try {
        if (param1 === "write") {
          const token = verifyJwt(accessToken);
          const body: createNoticeRequestBody = await req.json();

          if (!accessToken || !verifyJwt(accessToken)) {
            return new Response(JSON.stringify({ error: "No Authorization" }), {
              status: 401,
            });
          }
          console.log(token);
          const userId = Number(token.id);

          if (!body.subject || !body.contents) {
            return new Response(
              JSON.stringify({ error: "제목과 내용을 입력해 주세요." }),
              { status: 400 }
            );
          }

          const response = await noticeService.noticeCreate(body, userId);
          const createNoticeResult = await response.json();
          if (!createNoticeResult || createNoticeResult.length === 0) {
            return new Response(
              JSON.stringify({
                success: false,
                message: "createNoticeResult failed",
              }),
              { status: 401 }
            );
          } else {
            return new Response(
              JSON.stringify({
                success: true,
                message: "createNoticeResult successful",
                data: createNoticeResult,
              }),
              { status: 200 }
            );
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
          );
        }
      }

      break;

    case "GET":
      try {
        if (param1 === "findAll") {
          const token = verifyJwt(accessToken);
          if (!accessToken || !verifyJwt(accessToken)) {
            return new Response(JSON.stringify({ error: "No Authorization" }), {
              status: 401,
            });
          }

          const response = await noticeService.findAllNotice(); // Response 객체를 받습니다.
          const findAll = await response.json(); // Response 객체에서 JSON 데이터를 추출합니다.

          if (!findAll || findAll.length === 0) {
            // findAll이 비어있는지도 확인
            return new Response(
              JSON.stringify({
                success: false,
                message: "findAll failed",
              }),
              { status: 401 }
            );
          } else {
            return new Response(
              JSON.stringify({
                success: true,
                message: "findAll successful",
                data: findAll,
              }),
              { status: 200 }
            );
          }
        } else if (param1 === "findOne") {
          const token = verifyJwt(accessToken);
          if (!accessToken || !verifyJwt(accessToken)) {
            return new Response(JSON.stringify({ error: "No Authorization" }), {
              status: 401,
            });
          }

          const id = Number(param2);
          console.log(id);

          const response = await noticeService.findNoticeById(id);
          const findOne = await response.json();
          if (!findOne || findOne.length === 0) {
            return new Response(
              JSON.stringify({
                success: false,
                message: "findOne failed",
              }),
              { status: 401 }
            );
          } else {
            return new Response(
              JSON.stringify({
                success: true,
                message: "findOne successful",
                data: findOne,
              }),
              { status: 200 }
            );
          }
        } else if (param1 === "Puble") {
          const token = verifyJwt(accessToken);
          if (!accessToken || !verifyJwt(accessToken)) {
            return new Response(JSON.stringify({ error: "No Authorization" }), {
              status: 401,
            });
          }

          const response = await noticeService.findAllPublishedNotice();
          const Public = await response.json();
          if (!Public || Public.length === 0) {
            return new Response(
              JSON.stringify({
                success: false,
                message: "Public failed",
              }),
              { status: 401 }
            );
          } else {
            return new Response(
              JSON.stringify({
                success: true,
                message: "Public successful",
                data: Public,
              }),
              { status: 200 }
            );
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
          );
        }
      }
      break;

    case "PUT":
      try {
        if (param1 === "update") {
          const token = verifyJwt(accessToken);
          if (!accessToken || !token) {
            return new Response(JSON.stringify({ error: "No Authorization" }), {
              status: 401,
            });
          }
          const id = Number(param2);
          if (isNaN(id)) {
            return new Response(JSON.stringify({ error: "Invalid ID" }), {
              status: 400,
            });
          }
          console.log("xxxxxx1");
          // 여기서 data 객체를 생성하고 필요한 값을 설정합니다.
          const requestBody = await req.json();
          const data = {
            subject: requestBody.body,
            contents: requestBody.body,
          };
          console.log("data: ", data.contents);
          console.log("xxxxxx2");

          // updateNotice 함수 호출
          const updateNoticeResult = await noticeService.updateNotice(id, data);

          if (updateNoticeResult && updateNoticeResult.status === 200) {
            const result = await updateNoticeResult.json();
            return new Response(
              JSON.stringify({
                success: true,
                message: "updateNoticeResult successful",
                data: result,
              }),
              { status: 200 }
            );
          } else {
            // 오류 처리
            return new Response(
              JSON.stringify({
                success: false,
                message: "updateNoticeResult failed",
              }),
              { status: 401 }
            );
          }
        } else {
          return new Response(JSON.stringify({ error: "Invalid request" }), {
            status: 400,
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
          );
        }
        return new Response(JSON.stringify({ error: "Unhandled request" }), {
          status: 500,
        });
      }

      break;

    case "DELETE":
      try {
        if (param1 === "delete") {
          const token = verifyJwt(accessToken);
          if (!accessToken || !verifyJwt(accessToken)) {
            return new Response(JSON.stringify({ error: "No Authorization" }), {
              status: 401,
            });
          }

          const id = Number(param2);
          const response = await noticeService.deletesNotice(id);
          const deleteNoticeResult = await response.json();

          if (!deleteNoticeResult || deleteNoticeResult.length === 0) {
            return new Response(
              JSON.stringify({
                success: false,
                message: "deleteNoticeResult failed",
              }),
              { status: 401 }
            );
          } else {
            return new Response(
              JSON.stringify({
                success: true,
                message: "deleteNoticeResult successful",
                deleteNoticeResult,
              }),
              { status: 200 }
            );
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
          );
        }
      }
  }
};

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };

// import * as noticeService from "@/src/_services/noticeService";
// import { verifyJwt } from "@/src/lib/jwt";

// // 비동기 함수로 선언하여 비동기 호출을 적절히 처리합니다.
// export default async function handler(req, res) {
//     // 요청 메서드를 구조 분해 할당으로 추출합니다.
//     const { method } = req;
//     // req.params에서 param1과 param2를 구조 분해 할당으로 추출합니다.
//     const [param1, param2] = req.params;

//     // GET 메서드가 아닌 경우, 405 Method Not Allowed 오류를 반환합니다.
//     if (method !== "GET") {
//         res.status(405).json({ error: "Method not allowed" });
//         return;
//     }

//     // 요청 헤더에서 인증 토큰을 추출합니다.
//     const accessToken = req.headers.authorization;

//     // 인증 토큰이 없거나 유효하지 않은 경우, 401 Unauthorized 오류를 반환합니다.
//     if (!accessToken || !verifyJwt(accessToken)) {
//         res.status(401).json({ error: "No Authorization" });
//         return;
//     }

//     try {
//         // param1의 값에 따라 다른 동작을 수행합니다.
//         switch (param1) {
//             case "findAll":
//                 // 모든 공지사항을 조회합니다.
//                 const findAllResponse = await noticeService.findAllNotice();
//                 const findAllData = await findAllResponse.json();
//                 if (!findAllData || findAllData.length === 0) {
//                     res.status(404).json({ success: false, message: "No notices found" });
//                 } else {
//                     res.status(200).json({ success: true, data: findAllData });
//                 }
//                 break;

//             case "findOne":
//                 // 특정 ID를 가진 공지사항을 조회합니다.
//                 const id = Number(param2);
//                 const findOneResponse = await noticeService.findOneNotice(id);
//                 const findOneData = await findOneResponse.json();
//                 if (!findOneData) {
//                     res.status(404).json({ success: false, message: "Notice not found" });
//                 } else {
//                     res.status(200).json({ success: true, data: findOneData });
//                 }
//                 break;

//             case "public":
//                 // 게시된 모든 공지사항을 조회합니다.
//                 const publicResponse = await noticeService.findAllPublishedNotice();
//                 const publicData = await publicResponse.json();
//                 if (!publicData || publicData.length === 0) {
//                     res.status(404).json({ success: false, message: "No published notices found" });
//                 } else {
//                     res.status(200).json({ success: true, data: publicData });
//                 }
//                 break;

//             default:
//                 // 잘못된 요청에 대해 400 Bad Request 오류를 반환합니다.
//                 res.status(400).json({ error: "Invalid request" });
//         }
//     } catch (error) {
//         // 에러 처리: 서버 내부 오류 발생 시 500 Internal Server Error 반환
//         console.error(error.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }
