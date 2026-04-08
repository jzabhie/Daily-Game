import "./globals.css";

export const metadata = {
  title: "SignalSprint – Daily Visual Puzzle",
  description: "Guess the answer from maps, flags, events, charts, and clues. New puzzle every day. 5 guesses only."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
