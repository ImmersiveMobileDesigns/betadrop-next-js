import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - BetaDrop',
  description: 'Sign in to BetaDrop to distribute your mobile apps and manage access.',
  alternates: {
    canonical: '/login',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
