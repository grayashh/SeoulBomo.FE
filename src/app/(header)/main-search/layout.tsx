export const metadata = {
  title: "서울보모 : 키워드 검색",
  description: "서울보모 키워드 검색 페이지",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
