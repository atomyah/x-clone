import { ReactNode } from 'react';

interface ProfileLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

export default function ProfileLayout({ children, modal }: ProfileLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
