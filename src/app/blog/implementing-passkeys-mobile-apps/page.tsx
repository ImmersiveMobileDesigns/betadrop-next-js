import type { Metadata } from 'next';
import BlogLayout from '@/components/blog/BlogLayout';
import { getBlogPost } from '@/lib/blog';

const slug = 'implementing-passkeys-mobile-apps';
const post = getBlogPost(slug)!;

export const metadata: Metadata = {
  alternates: {
    canonical: `/blog/${post.slug}`,
  },
  title: post.title,
  description: post.metaDescription,
  keywords: [post.primaryKeyword, ...post.secondaryKeywords],
  authors: [{ name: post.author }],
  openGraph: {
    title: post.title,
    description: post.metaDescription,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
    images: [post.image!],
  },
};

export default function Page() {
  return (
    <BlogLayout post={post}>
       <p className="lead text-xl text-white/80 mb-8">
         For decades, passwords have been the weakest link in digital security. They are forgotten, reused, phished, and cracked. In 2026, we are finally seeing the widespread adoption of <strong>Passkeys (FIDO2)</strong>, making passwordless authentication the new standard for mobile apps.
       </p>

       <h2>What are Passkeys?</h2>
       <p>
         A Passkey is a digital credential tied to a user account and a specific website or app. Unlike a password, it is phishing-resistant.
       </p>
       <p>
         It relies on public-key cryptography. The private key is stored securely on the user's device (e.g., in the iPhone's Secure Enclave or Android's Titan M2 chip) and never leaves it. The public key is stored on your server. To log in, the user simply authenticates with FaceID, TouchID, or a device PIN.
       </p>

       <h2>Why Implement Passkeys Now?</h2>
       <ul>
         <li><strong>Enhanced Security:</strong> Eliminate credential stuffing attacks. Since there is no password to steal, there is nothing for hackers to replay.</li>
         <li><strong>Improved UX:</strong> Users hate typing passwords on mobile keyboards. Biometric login is faster and frictionless.</li>
         <li><strong>Platform Support:</strong> Apple, Google, and Microsoft have all committed to the FIDO standard, ensuring cross-platform compatibility.</li>
       </ul>

       <h2>Implementation Guide</h2>
       <div className="my-8 p-6 bg-white/5 border-l-4 border-primary-500 rounded-r-xl">
         <h4 className="text-white font-bold mb-2">Key Steps for iOS (Swift) & Android (Kotlin):</h4>
         <p className="mb-0 text-white/70 text-sm">
           1. <strong>Create a Relying Party (RP):</strong> Configure your backend to handle FIDO2 registration and authentication challenges.<br/>
           2. <strong>Associate Domain:</strong> Setup `apple-app-site-association` and `assetlinks.json` to link your app to your domain.<br/>
           3. <strong>Client Implementation:</strong> Use `ASAuthorizationController` on iOS and `Credential Manager` on Android to invoke the system UI for passkey creation and sign-in.
         </p>
       </div>

       <h2>Handling Cross-Device Sign-in</h2>
       <p>
         One concern with device-bound credentials is: "What if I lose my phone?" Passkeys are designed to sync securely via iCloud Keychain or Google Password Manager, allowing users to recover access on a new device seamlessly.
       </p>
       <p>
         For signing in on a <em>different</em> platform (e.g., logging into a desktop site with an iPhone), users can scan a QR code displayed on the screen, establishing a secure Bluetooth connection to verify proximity.
       </p>

       <h2>Conclusion</h2>
       <p>
         The password is dying, and mobile apps are leading the charge. By implementing passkeys today, you future-proof your application's security and provide the smooth login experience users expect in 2026.
       </p>
    </BlogLayout>
  );
}
