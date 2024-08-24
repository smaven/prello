export default function BoardsLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
