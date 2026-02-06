import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quick Share - Upload App Without Login | BetaDrop',
  description: 'Upload iOS and Android apps instantly without creating an account. Share secure installation links for beta testing. Links expire in 24 hours.',
  alternates: {
    canonical: '/guest',
  },
};

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
