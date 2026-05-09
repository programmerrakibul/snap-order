import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const res = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      omit: {
        password: true,
      },
    });

    const users = res.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
      lastLoggedIn: u.lastLoggedIn.toISOString(),
    }));

    return NextResponse.json(
      { success: true, message: "Users fetched successfully!", data: users },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Something went wrong!" },
      {
        status: 500,
      },
    );
  }
};
