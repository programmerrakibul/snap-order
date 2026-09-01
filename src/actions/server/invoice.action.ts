"use server";

import { OrderStatus, Role } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { TInvoice } from "@/types/invoice.interface";
import { BadRequestError } from "http-errors-enhanced";
import { cacheLife, revalidatePath } from "next/cache";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import PDFDocument from "pdfkit";
import { isAuthenticated } from "./isAuthenticated";

const LOGO_URL =
  "https://res.cloudinary.com/dqh5dajig/image/upload/v1780568710/logo_gjx9bu.png";
const BRAND_NAME = "Snap Order";
const BRAND_SLOGAN =
  "Track stock, process orders, and grow — with clarity at every step.";

export const createInvoiceByOrderId = async (
  orderId: string,
): Promise<{ success: boolean; message: string; error?: string }> => {
  try {
    const user = await isAuthenticated();

    if (!user) {
      return { success: false, message: "Unauthorized!" };
    }

    if (user.role !== Role.ADMIN) {
      return {
        success: false,
        message: "Forbidden! Only admins can generate invoices.",
      };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          select: {
            totalPrice: true,
            discountAmount: true,
          },
        },
      },
    });

    if (!order) {
      throw new BadRequestError("Order not found!");
    }

    if (order.status !== OrderStatus.CONFIRMED) {
      return {
        success: false,
        message: "Invoice can only be generated for confirmed orders.",
      };
    }

    const existing = await prisma.invoice.findUnique({
      where: { orderId },
    });

    if (existing) {
      return {
        success: true,
        message: "Invoice already exists for this order.",
      };
    }

    const totalDiscount = order.items.reduce(
      (sum, item) => sum + (item.discountAmount?.toNumber() ?? 0),
      0,
    );

    await prisma.invoice.create({
      data: {
        orderId: order.id,
        customerId: order.customerId,
        totalAmount: order.totalAmount.toNumber(),
        discountAmount: totalDiscount > 0 ? totalDiscount : null,
      },
    });

    revalidatePath("/dashboard/invoices");

    return {
      success: true,
      message: "Invoice generated successfully!",
    };
  } catch (error: unknown) {
    console.error("Create invoice error: ", error);

    return {
      success: false,
      message: "Failed to create invoice!",
      error: (error as Error).message,
    };
  }
};

const serializeInvoice = (invoice: {
  id: string;
  orderId: string;
  totalAmount: unknown;
  discountAmount: unknown;
  createdAt: Date;
  updatedAt: Date;
  customer: { name: string | null; email: string };
  order: {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    confirmedAt: Date | null;
    shippedAt: Date | null;
    deliveredAt: Date | null;
    cancelledAt: Date | null;
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    shippingArea: string;
    shippingThana: string;
    shippingDistrict: string;
    shippingDivision: string;
    shippingPostalCode: string | null;
    shippingNote: string | null;
    customerNote: string | null;
    items: {
      id: string;
      quantity: number;
      totalPrice: unknown;
      discountAmount: unknown;
      productVariant: {
        sku: string;
        attributes: unknown;
        product: { name: string };
      };
    }[];
  };
}): TInvoice => {
  return {
    id: invoice.id,
    orderId: invoice.orderId,
    totalAmount: Number(invoice.totalAmount),
    discountAmount:
      invoice.discountAmount != null ? Number(invoice.discountAmount) : null,
    createdAt: invoice.createdAt.toISOString(),
    updatedAt: invoice.updatedAt.toISOString(),
    customer: {
      name: invoice.customer.name,
      email: invoice.customer.email,
    },
    order: {
      id: invoice.order.id,
      orderNumber: invoice.order.orderNumber,
      status: invoice.order.status,
      confirmedAt: invoice.order.confirmedAt?.toISOString() ?? null,
      shippedAt: invoice.order.shippedAt?.toISOString() ?? null,
      deliveredAt: invoice.order.deliveredAt?.toISOString() ?? null,
      cancelledAt: invoice.order.cancelledAt?.toISOString() ?? null,
      shippingName: invoice.order.shippingName,
      shippingPhone: invoice.order.shippingPhone,
      shippingAddress: invoice.order.shippingAddress,
      shippingArea: invoice.order.shippingArea,
      shippingThana: invoice.order.shippingThana,
      shippingDistrict: invoice.order.shippingDistrict,
      shippingDivision: invoice.order.shippingDivision,
      shippingPostalCode: invoice.order.shippingPostalCode,
      shippingNote: invoice.order.shippingNote,
      customerNote: invoice.order.customerNote,
      items: invoice.order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        totalPrice: Number(item.totalPrice),
        discountAmount:
          item.discountAmount != null ? Number(item.discountAmount) : null,
        productName: item.productVariant.product.name,
        variantSku: item.productVariant.sku,
        attributes: (item.productVariant.attributes ?? null) as Record<
          string,
          string
        > | null,
        unitPrice: Number(item.totalPrice) / item.quantity,
      })),
    },
  };
};

export const getAllInvoices = async (): Promise<TInvoice[]> => {
  "use cache: private";
  cacheLife("weeks");

  try {
    const user = await isAuthenticated();

    if (!user || user.role === Role.ADMIN) return [];

    const invoices = await prisma.invoice.findMany({
      where: {
        customerId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            confirmedAt: true,
            shippedAt: true,
            deliveredAt: true,
            cancelledAt: true,
            shippingName: true,
            shippingPhone: true,
            shippingAddress: true,
            shippingArea: true,
            shippingThana: true,
            shippingDistrict: true,
            shippingDivision: true,
            shippingPostalCode: true,
            shippingNote: true,
            customerNote: true,
            items: {
              include: {
                productVariant: {
                  select: {
                    sku: true,
                    attributes: true,
                    product: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return invoices.map((invoice) => serializeInvoice(invoice));
  } catch (error: unknown) {
    console.error("Error fetching invoices: ", error);
    return [];
  }
};

export const downloadInvoicePdf = async (
  invoiceId: string,
): Promise<{
  success: boolean;
  message: string;
  pdfBase64?: string;
  fileName?: string;
}> => {
  try {
    const user = await isAuthenticated();

    if (!user || user.role === Role.ADMIN) {
      return { success: false, message: "Unauthorized!" };
    }

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        customerId: user.id,
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
        order: {
          include: {
            items: {
              include: {
                productVariant: {
                  select: {
                    sku: true,
                    attributes: true,
                    product: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      return { success: false, message: "Invoice not found!" };
    }

    const data = serializeInvoice(invoice);
    const pdfBuffer = await buildInvoicePdf(data);

    return {
      success: true,
      message: "Invoice PDF generated!",
      pdfBase64: pdfBuffer.toString("base64"),
      fileName: `${data.order.orderNumber}.pdf`,
    };
  } catch (error: unknown) {
    console.error("Error downloading invoice: ", error);
    return { success: false, message: "Failed to download invoice!" };
  }
};

let cachedFontBuffer: Buffer | null = null;

const FONT_FILE = join(
  process.cwd(),
  "src",
  "assets",
  "fonts",
  "NotoSansBengali-Regular.ttf",
);

const loadFontBuffer = async (): Promise<Buffer> => {
  if (cachedFontBuffer) return cachedFontBuffer;
  cachedFontBuffer = await readFile(FONT_FILE);
  return cachedFontBuffer;
};

const buildInvoicePdf = async (invoice: TInvoice): Promise<Buffer> => {
  const fontBuffer = await loadFontBuffer();

  const doc = new PDFDocument({
    size: "A4",
    margin: 45,
    bufferPages: true,
    info: {
      Title: `Invoice ${invoice.order.orderNumber}`,
      Author: BRAND_NAME,
    },
  });

  doc.registerFont("Noto", fontBuffer);

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  const money = (value: number) => `৳${value.toFixed(2)}`;

  const blue = "#2563eb";
  const slate = "#334155";
  const muted = "#64748b";
  const light = "#eff6ff";
  const border = "#cbd5e1";

  const pageWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const left = doc.page.margins.left;
  const right = pageWidth + left;
  const bottom = doc.page.height - doc.page.margins.bottom;
  const contentBottom = bottom - 46;

  const sectionTitle = (text: string, x: number, size = 11, color = blue) => {
    doc.font("Noto").fontSize(size).fillColor(color).text(text, x);
  };

  const bodyText = (
    text: string,
    x: number,
    opts: {
      size?: number;
      color?: string;
      width?: number;
      align?: "left" | "right" | "center" | "justify";
    } = {},
  ) => {
    const { size = 10, color = slate, width, align } = opts;
    const y = doc.y;
    doc.font("Noto").fontSize(size).fillColor(color).text(text, x, y, {
      width,
      align,
      lineBreak: true,
    });
    doc.y = y + doc.heightOfString(text, { width });
  };

  const headerTop = left;

  // ---- Header (right column) ----
  doc
    .font("Noto")
    .fontSize(13)
    .fillColor(blue)
    .text("INVOICE", left, headerTop, {
      align: "right",
      width: pageWidth,
      lineBreak: false,
    });
  doc
    .font("Noto")
    .fontSize(9)
    .fillColor(slate)
    .text(
      `Invoice #: ${invoice.id.slice(-10).toUpperCase()}`,
      left,
      headerTop + 16,
      { align: "right", width: pageWidth, lineBreak: false },
    );
  doc
    .font("Noto")
    .fontSize(9)
    .fillColor(muted)
    .text(
      `Issued: ${new Date(invoice.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      left,
      headerTop + 28,
      { align: "right", width: pageWidth },
    );

  // ---- Header (left: logo / brand) ----
  try {
    const logoRes = await fetch(LOGO_URL, { cache: "no-store" });
    if (logoRes.ok) {
      const logoBuffer = Buffer.from(await logoRes.arrayBuffer());
      doc.image(logoBuffer, left, headerTop, { width: 130 });
    }
  } catch {
    doc
      .font("Noto")
      .fontSize(20)
      .fillColor(blue)
      .text(BRAND_NAME, left, headerTop);
  }

  doc
    .moveTo(left, headerTop + 52)
    .lineTo(right, headerTop + 52)
    .lineWidth(1)
    .strokeColor(border)
    .stroke();

  doc.y = headerTop + 64;
  doc
    .font("Noto")
    .fontSize(10)
    .fillColor(slate)
    .text(BRAND_SLOGAN, left, doc.y, { width: 0.66 * pageWidth });
  doc.y += 18;

  // ---- Billed To / Order Details ----
  const topLine = doc.y;
  sectionTitle("BILLED TO", left, 11);
  bodyText(invoice.order.shippingName, left);
  bodyText(invoice.customer.email || "-", left);
  bodyText(invoice.order.shippingPhone, left);

  const fullAddress = [
    invoice.order.shippingAddress,
    invoice.order.shippingArea,
    invoice.order.shippingThana,
    invoice.order.shippingDistrict,
    invoice.order.shippingDivision,
    invoice.order.shippingPostalCode,
  ]
    .filter(Boolean)
    .join(", ");
  bodyText(fullAddress, left, {
    width: 0.58 * pageWidth,
    size: 9,
    color: muted,
  });

  doc.y = topLine;
  const rightCol = right - 0.34 * pageWidth;
  sectionTitle("ORDER DETAILS", rightCol, 11);
  doc.y = topLine + 15;
  bodyText(`Order: ${invoice.order.orderNumber}`, rightCol);
  bodyText(`Status: ${invoice.order.status}`, rightCol);
  bodyText(
    `Order date: ${new Date(
      invoice.order.confirmedAt ?? invoice.createdAt,
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`,
    rightCol,
  );
  bodyText(
    `Total items: ${invoice.order.items.reduce((s, i) => s + i.quantity, 0)}`,
    rightCol,
  );

  // Resume to the lowest point used by either column
  doc.y = Math.max(doc.y, topLine + 4 + 15 * 4);
  doc.y += 6;

  // ---- Items table ----
  const tableLeft = left;
  const colX = {
    product: tableLeft,
    sku: tableLeft + 0.4 * pageWidth,
    qty: tableLeft + 0.55 * pageWidth,
    price: tableLeft + 0.68 * pageWidth,
    amount: tableLeft + 0.82 * pageWidth,
  };
  const productWidth = colX.sku - colX.product - 10;
  const amountWidth = right - colX.amount - 8;
  const HEADER_H = 22;

  const drawHeader = () => {
    doc.rect(tableLeft, doc.y, pageWidth, HEADER_H).fill(light);
    doc.font("Noto").fontSize(9).fillColor(blue);
    doc.text("PRODUCT", colX.product + 7, doc.y + 6);
    doc.text("SKU", colX.sku, doc.y - 12);
    doc.text("QTY", colX.qty, doc.y - 12);
    doc.text("PRICE", colX.price, doc.y - 12);
    doc.text("AMOUNT", colX.amount, doc.y - 12, {
      align: "right",
      width: amountWidth,
    });
    doc
      .moveTo(tableLeft, doc.y + HEADER_H)
      .lineTo(right, doc.y + HEADER_H)
      .lineWidth(1)
      .strokeColor(border)
      .stroke();
  };

  const rowHeightFor = (item: TInvoice["order"]["items"][number]) => {
    const attrLine = item.attributes
      ? Object.entries(item.attributes)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")
      : "";
    const linesNeeded = doc
      .font("Noto")
      .fontSize(9)
      .heightOfString(item.productName + (attrLine ? ` (${attrLine})` : ""), {
        width: productWidth,
      });
    return Math.max(22, linesNeeded + 8);
  };

  drawHeader();

  invoice.order.items.forEach((item, index) => {
    const rh = rowHeightFor(item);
    const rowTop = doc.y;
    const rowBottom = rowTop + rh;

    if (rowBottom > contentBottom) {
      doc.addPage();
      doc.y = left;
      drawHeader();
    }

    const rowTop2 = doc.y;
    if (index % 2 === 0) {
      doc.rect(tableLeft, rowTop2, pageWidth, rh).fill("#f8fafc");
    }

    const attrLine = item.attributes
      ? Object.entries(item.attributes)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")
      : "";
    const fullProduct = item.productName + (attrLine ? ` (${attrLine})` : "");

    doc.y = rowTop2 + 5;
    doc
      .font("Noto")
      .fontSize(9)
      .fillColor(slate)
      .text(fullProduct, colX.product + 7, doc.y, { width: productWidth });
    doc.text(item.variantSku, colX.sku, rowTop2 + 6);
    doc.text(String(item.quantity), colX.qty, rowTop2 + 6);
    doc.text(money(item.unitPrice), colX.price, rowTop2 + 6);
    doc
      .font("Noto")
      .fontSize(9)
      .fillColor(slate)
      .text(money(item.totalPrice), colX.amount, rowTop2 + 6, {
        align: "right",
        width: amountWidth,
      });

    doc.y = rowBottom;
  });

  doc
    .moveTo(tableLeft, doc.y)
    .lineTo(right, doc.y)
    .lineWidth(1)
    .strokeColor(border)
    .stroke();
  doc.y += 14;

  // ---- Totals ----
  const totalsLeft = right - 0.36 * pageWidth;

  if (invoice.discountAmount && invoice.discountAmount > 0) {
    const lineY = doc.y;
    doc
      .font("Noto")
      .fontSize(10)
      .fillColor(slate)
      .text("Discount", totalsLeft, lineY);
    doc
      .font("Noto")
      .fontSize(10)
      .fillColor(slate)
      .text(`- ${money(invoice.discountAmount)}`, right, lineY, {
        align: "right",
      });
    doc.y += 20;
  }

  const totalY = doc.y;
  doc
    .roundedRect(totalsLeft, totalY - 6, right - totalsLeft, 34, 6)
    .fill(light);
  doc
    .font("Noto")
    .fontSize(12)
    .fillColor(blue)
    .text("TOTAL DUE", totalsLeft + 10, totalY);
  doc
    .font("Noto")
    .fontSize(14)
    .fillColor(slate)
    .text(money(invoice.totalAmount), totalsLeft, totalY, {
      align: "right",
    });
  doc.y = totalY + 34;

  // ---- Gratitude ----
  doc.y += 14;
  const gratitude =
    "Thank you for shopping with us! Your order has been confirmed and is being prepared. We truly appreciate your trust in Snap Order and look forward to serving you again. If you have any questions about this invoice, feel free to reach out to our support team.";
  doc
    .font("Noto")
    .fontSize(10)
    .fillColor(slate)
    .text("Thank you for your purchase!", left, doc.y);
  doc.font("Noto").fontSize(9).fillColor(muted).text(gratitude, left, doc.y, {
    width: pageWidth,
    align: "justify",
  });

  // ---- Footer (pinned to bottom of the last page) ----
  const pageCount = doc.bufferedPageRange().count;
  doc.switchToPage(pageCount - 1);

  const footerY = doc.page.height - doc.page.margins.bottom - 44;
  doc
    .moveTo(left, footerY)
    .lineTo(right, footerY)
    .lineWidth(1)
    .strokeColor(border)
    .stroke();
  doc
    .font("Noto")
    .fontSize(8.5)
    .fillColor(muted)
    .text(`${BRAND_NAME} — ${BRAND_SLOGAN}`, left, footerY + 10, {
      align: "center",
      width: pageWidth,
    });
  doc
    .font("Noto")
    .fontSize(8)
    .fillColor(muted)
    .text(
      "This is an electronically generated invoice and does not require a physical signature.",
      left,
      footerY + 23,
      { align: "center", width: pageWidth },
    );

  doc.end();

  return new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
};
