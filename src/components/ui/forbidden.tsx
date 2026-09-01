"use client";

import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { IconAlertTriangle, IconHome, IconLock } from "@tabler/icons-react";
import Link from "next/link";

const ForbiddenComponent = () => {
  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-slate-100 to-red-50 py-10 md:py-16">
        <Container className="max-w-5xl">
          <div className="animate-slide-in">
            {/* Alert Card */}
            <div className="relative">
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-linear-to-r from-red-500/10 to-red-600/10 rounded-2xl animate-pulse-glow blur-xl"></div>

              {/* Main Card */}
              <div className="relative bg-white border-2 border-red-200 rounded-2xl shadow-2xl overflow-hidden">
                {/* Top Red Alert Bar */}
                <div className="h-2 bg-linear-to-r from-red-600 via-red-500 to-red-600"></div>

                {/* Content */}
                <div className="p-4 sm:p-6 md:p-8">
                  {/* Icon Container */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl animate-pulse-glow"></div>
                      <div className="relative bg-linear-to-br from-red-100 to-red-50 rounded-full p-4 sm:p-6 border-2 border-red-200">
                        <IconAlertTriangle
                          className="size-9 sm:size-10 md:size-12 text-red-600 animate-float"
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Main Text */}
                  <div className="text-center space-y-4 mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter bg-linear-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                      Access Forbidden
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 font-medium flex items-center justify-center gap-2">
                      <IconLock className="w-5 h-5 text-red-500" />
                      403 Error
                    </p>
                  </div>

                  {/* Description */}
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-5 rounded-lg mb-8">
                    <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
                      You don&apos;t have permission to access this page. This
                      area is restricted to authorized users only. If you
                      believe this is a mistake, please contact the
                      administrator.
                    </p>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {[
                      {
                        title: "Status",
                        value: "Unauthorized Access",
                      },
                      {
                        title: "Action",
                        value: "Return to Dashboard",
                      },
                    ].map((item, idx) => (
                      <>
                        <div
                          key={item.title || idx}
                          className="bg-linear-to-br from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200"
                        >
                          <p className="text-xs sm:text-sm font-semibold text-slate-700 mb-1">
                            {item.title}
                          </p>
                          <p className="text-slate-600 text-sm sm:text-base">
                            {item.value}
                          </p>
                        </div>
                      </>
                    ))}
                  </div>

                  {/* Button */}
                  <div className="flex justify-center">
                    <Button size={"lg"} variant={"destructive"} asChild>
                      <Link
                        href={"/dashboard"}
                        replace
                        className="flex items-center gap-2"
                      >
                        <IconHome className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Back to Dashboard
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default ForbiddenComponent;
