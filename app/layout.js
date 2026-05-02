import "./globals.css";

export const metadata = {
  title: "Intercopa Gaming",
  description: "Inscrição Campeonato FIFA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
