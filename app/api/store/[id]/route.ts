import * as storeService from "@/src/_services/storeService";
import { verifyJwt } from "@/src/lib/jwt";

interface joinSotreRequestBody {
  name: string;
  zip_code: string;
  address: string;
  address_etc: string;
  phone: string;
  referral_code: string;
  member_id: number;
}
export const handler = async (req: any, { params }) => {
  const method = req.method;
  const param1 = params.param[0];
  const param2 = params.param[1];
  const accessToken = req.headers.get("authorization");

  switch (method) {
    case "POST":
      try {
        if (param1 === "joinStore") {
          if (!accessToken || !verifyJwt(accessToken)) {
            return new Response(JSON.stringify({ error: "No Authorization" }), {
              status: 401,
            });
          }

          const body: joinSotreRequestBody = await req.json();
          const response = await storeService.JoinStore(body);
          // const joinStoreResult = await response.json();
          if (!response) {
            return new Response(
              JSON.stringify({
                success: false,
                message: "joinStoreResult failed",
              }),
              { status: 401 }
            );
          } else {
            return new Response(
              JSON.stringify({
                success: true,
                message: "joinStoreResult successful",
                data: response,
              }),
              { status: 200 }
            );
          }
        }
      } catch (error) {}
  }
};
export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
