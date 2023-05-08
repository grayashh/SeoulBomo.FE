import { Pretendard } from "@/utils/font";
import "./globals.css";

export const metadata = {
  title: "서울보모",
  description: "서울 보육의 모든 것",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={Pretendard.className}>{children}</body>
    </html>
  );
}
