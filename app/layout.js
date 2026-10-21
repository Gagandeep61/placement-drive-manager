import "./globals.css";

export const metadata = {
  title: "Placement Drive Manager",
  description: "Manage placement drives of campus",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >{children}</body>
    </html>
  );
}
