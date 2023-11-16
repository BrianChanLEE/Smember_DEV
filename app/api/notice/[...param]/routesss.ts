// import * as noticeService from "@/src/_services/noticeService";
// import { verifyJwt } from "@/src/lib/jwt";
// interface createNoticeRequestBody {
//   subject: string;
//   contents: string;
// }
// interface findPublished {
//   status: boolean;
// }

// interface noticesUpdateInput {
//   status: boolean;
// }

// const handler = async (req: any, { params }) => {
//   const method = req.method;
//   const param1 = params.param[0];
//   const param2 = params.param[1];
//   const accessToken = req.headers.get("authorization");
//   switch (method) {
//     case "POST":
//       try {
//         if (param1 === "write") {
//           const token = verifyJwt(accessToken);
//           const body: createNoticeRequestBody = await req.json();

//           if (!accessToken || !verifyJwt(accessToken)) {
//             return new Response(JSON.stringify({ error: "No Authorization" }), {
//               status: 401,
//             });
//           }
//           console.log(token);
//           const userId = Number(token.id);

//           if (!body.subject || !body.contents) {
//             return new Response(
//               JSON.stringify({ error: "제목과 내용을 입력해 주세요." }),
//               { status: 400 }
//             );
//           }

//           const response = await noticeService.noticeCreate(body, userId);
//           const createNoticeResult = await response.json();
//           if (!createNoticeResult || createNoticeResult.length === 0) {
//             return new Response(
//               JSON.stringify({
//                 success: false,
//                 message: "createNoticeResult failed",
//               }),
//               { status: 401 }
//             );
//           } else {
//             return new Response(
//               JSON.stringify({
//                 success: true,
//                 message: "createNoticeResult successful",
//                 data: createNoticeResult,
//               }),
//               { status: 200 }
//             );
//           }
//         }
//       } catch (error) {
//         if (error instanceof Error) {
//           console.error(error.message);
//           return new Response(
//             JSON.stringify({ error: "Internal server error" }),
//             { status: 500 }
//           );
//         }
//       }

//       break;

//     case "GET":
//       try {
//         if (param1 === "findAll") {
//           const token = verifyJwt(accessToken);
//           if (!accessToken || !verifyJwt(accessToken)) {
//             return new Response(JSON.stringify({ error: "No Authorization" }), {
//               status: 401,
//             });
//           }

//           const response = await noticeService.findAllNotice(); // Response 객체를 받습니다.
//           const findAll = await response.json(); // Response 객체에서 JSON 데이터를 추출합니다.

//           if (!findAll || findAll.length === 0) {
//             // findAll이 비어있는지도 확인
//             return new Response(
//               JSON.stringify({
//                 success: false,
//                 message: "findAll failed",
//               }),
//               { status: 401 }
//             );
//           } else {
//             return new Response(
//               JSON.stringify({
//                 success: true,
//                 message: "findAll successful",
//                 data: findAll,
//               }),
//               { status: 200 }
//             );
//           }
//         } else if (param1 === "findOne") {
//           const token = verifyJwt(accessToken);
//           if (!accessToken || !verifyJwt(accessToken)) {
//             return new Response(JSON.stringify({ error: "No Authorization" }), {
//               status: 401,
//             });
//           }

//           const id = Number(param2);

//           const response = await noticeService.findOneNotice(id);
//           const findOne = await response.json();
//           if (!findOne || findOne.length === 0) {
//             return new Response(
//               JSON.stringify({
//                 success: false,
//                 message: "findOne failed",
//               }),
//               { status: 401 }
//             );
//           } else {
//             return new Response(
//               JSON.stringify({
//                 success: true,
//                 message: "findOne successful",
//                 data: findOne,
//               }),
//               { status: 200 }
//             );
//           }
//         } else if (param1 === "Puble") {
//           const token = verifyJwt(accessToken);
//           if (!accessToken || !verifyJwt(accessToken)) {
//             return new Response(JSON.stringify({ error: "No Authorization" }), {
//               status: 401,
//             });
//           }

//           const response = await noticeService.findAllPublishedNotice();
//           const Public = await response.json();
//           if (!Public || Public.length === 0) {
//             return new Response(
//               JSON.stringify({
//                 success: false,
//                 message: "Public failed",
//               }),
//               { status: 401 }
//             );
//           } else {
//             return new Response(
//               JSON.stringify({
//                 success: true,
//                 message: "Public successful",
//                 data: Public,
//               }),
//               { status: 200 }
//             );
//           }
//         }
//       } catch (error) {
//         if (error instanceof Error) {
//           console.error(error.message);
//           return new Response(
//             JSON.stringify({ error: "Internal server error" }),
//             { status: 500 }
//           );
//         }
//       }
//       break;

//     case "PUT":
//       try {
//         if (param1 === "update") {
//           const token = verifyJwt(accessToken);
//           if (!accessToken || !token) {
//             return new Response(JSON.stringify({ error: "No Authorization" }), {
//               status: 401,
//             });
//           }
//           const id = Number(param2);
//           if (isNaN(id)) {
//             return new Response(JSON.stringify({ error: "Invalid ID" }), {
//               status: 400,
//             });
//           }

//           const response = await noticeService.updateNotice(id);
//           const updateNoticeResult = await response.json();

//           if (!updateNoticeResult || updateNoticeResult.length === 0) {
//             return new Response(
//               JSON.stringify({
//                 success: false,
//                 message: "updateNoticeResult failed",
//               }),
//               { status: 401 }
//             );
//           } else {
//             return new Response(
//               JSON.stringify({
//                 success: true,
//                 message: "updateNoticeResult successful",
//                 data: updateNoticeResult,
//               }),
//               { status: 200 }
//             );
//           }
//         } else {
//           return new Response(JSON.stringify({ error: "Invalid request" }), {
//             status: 400,
//           });
//         }
//       } catch (error) {
//         if (error instanceof Error) {
//           console.error(error.message);
//           return new Response(
//             JSON.stringify({ error: "Internal server error" }),
//             { status: 500 }
//           );
//         }
//         return new Response(JSON.stringify({ error: "Unhandled request" }), {
//           status: 500,
//         });
//       }
//   }
// };

// //     case "DELETE":
// //       try {
// //         if (param1 === "delete") {
// //           const token = verifyJwt(accessToken);
// //           if (!accessToken || !verifyJwt(accessToken)) {
// //             return new Response(JSON.stringify({ error: "No Authorization" }), {
// //               status: 401,
// //             });
// //           }

// //           const id = Number(param2);
// //           const response = await noticeService.deletesNotice(id);
// //           const deleteNoticeResult = await response.json();

// //           if (!deleteNoticeResult || deleteNoticeResult.length === 0) {
// //             return new Response(
// //               JSON.stringify({
// //                 success: false,
// //                 message: "deleteNoticeResult failed",
// //               }),
// //               { status: 401 }
// //             );
// //           } else {
// //             return new Response(
// //               JSON.stringify({
// //                 success: true,
// //                 message: "deleteNoticeResult successful",
// //                 deleteNoticeResult,
// //               }),
// //               { status: 200 }
// //             );
// //           }
// //         }
// //       } catch (error) {
// //         if (error instanceof Error) {
// //           console.error(error.message);
// //           return new Response(
// //             JSON.stringify({ error: "Internal server error" }),
// //             { status: 500 }
// //           );
// //         }
// //       }
// //   }
// // };

// export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
