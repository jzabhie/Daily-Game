import "./globals.css";

export const metadata = {
  title: "SignalSprint",
  description: "A daily visual puzzle game with geography, events, landmarks, flags, and chart clues."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
