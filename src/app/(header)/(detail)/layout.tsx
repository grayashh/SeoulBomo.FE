export const metadata = {
  title: "서울보모 : 상세페이지",
  description: "서울보모 상세 페이지",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
