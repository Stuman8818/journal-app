"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";
import theme from "./theme";

export default function ClientProviders({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any; // import ServerSession type if you want stronger typing
}) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
