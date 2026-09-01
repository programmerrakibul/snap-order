"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadInvoicePdf } from "@/actions/server/invoice.action";
import { IconDownload } from "@tabler/icons-react";

interface DownloadReceiptButtonProps {
  invoiceId: string;
  fileName: string;
}

export default function DownloadReceiptButton({
  invoiceId,
  fileName,
}: DownloadReceiptButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await downloadInvoicePdf(invoiceId);

      if (result.success && result.pdfBase64) {
        const byteCharacters = atob(result.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.fileName ?? fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success("Receipt downloaded successfully!");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Download receipt error:", error);
      toast.error("Failed to download receipt!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={isLoading}
      className="w-full gap-2"
    >
      {isLoading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"></span>
      ) : (
        <IconDownload className="h-4 w-4" />
      )}
      {isLoading ? "Preparing..." : "Download Receipt"}
    </Button>
  );
}
