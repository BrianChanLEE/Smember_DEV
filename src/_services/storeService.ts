import { id } from "./../../node_modules/next-auth/client/__tests__/helpers/mocks.d";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/src/middleware/logger";

const prisma = new PrismaClient();

interface joinSotreRequestBody {
  name: string;
  zip_code: string;
  address: string;
  address_etc: string;
  phone: string;
  referral_code: string;
  member_id: number;
}

interface upgradestoreInput {
  email: string;
  enabled: boolean;
}

export async function JoinStore(req: any) {
  try {
    const {
      name,
      zip_code,
      address,
      address_etc,
      phone,
      referral_code,
      member_id,
    } = req.body;

    const newStore = await prisma.store.create({
      data: {
        name,
        zip_code,
        address,
        address_etc,
        phone,
        referral_code,
        member_id,
      },
    });
    return { success: true, data: newStore };
  } catch (error) {
    console.error("Error in JoinStore:", error.message);
    return { success: false, error: error.message };
  }
}

//     return new Response(JSON.stringify({ joninStore }), {
//       status: 201,
//     });
//   } catch (error) {
//     console.error("JoinStore error:", error.message);
//     return new Response(JSON.stringify({ error: "Internal server error" }), {
//       status: 500,
//     });
//   }
// }

export async function upgradeStore(req: any): Promise<Response> {
  try {
    await prisma.store.findMany;
    const updatedStore = await prisma.store.update({
      where: { email: email },
      data: req.body,
    });

    if (updatedStore) {
      return new Response(
        JSON.stringify({ message: `${email} store was enabled successfully.` })
      );
    } else {
      return new Response(
        JSON.stringify({
          message: `Cannot update store with email=${email}. Maybe store was not found or req.body is empty!`,
        }),
        { status: 404 }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      console.error(error.message);
    }
    return new Response(
      JSON.stringify({ message: "Error updating store with email=" + email }),
      { status: 500 }
    );
  }
}

export async function findNotenabled(req: any): Promise<Response> {
  try {
    const stores = await prisma.store.findMany({
      where: { enabled: false },
    });
    return new Response(JSON.stringify({ stores: stores }), { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message); // 로깅
      console.error(error.message);
    }
    return new Response(
      JSON.stringify({ message: "Error occurred while fetching stores" }),
      { status: 500 }
    );
  }
}

export async function storeList(req: any): Promise<Response> {
  try {
    const stores = await prisma.store.findMany({
      where: { enabled: true },
    });
    return new Response(JSON.stringify({ stores: stores }), { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      console.error(error.message);
    }
    return new Response(
      JSON.stringify({ message: "Error occurred while fetching stores" }),
      { status: 500 }
    );
  }
}
