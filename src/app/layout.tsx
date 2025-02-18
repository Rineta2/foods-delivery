import { metadata } from "@/components/meta/metadata";

metadata.manifest = "/manifest.json";

export { metadata };

import "@/styles/globals.css";

import Providers from "@/layout/router/Provider";

import Pathname from "@/layout/router/Pathname";

import { openSans } from "@/components/fonts/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.variable} antialiased`}
      >
        <Providers>
          <Pathname>
            {children}
          </Pathname>
        </Providers>
      </body>
    </html>
  );
}
