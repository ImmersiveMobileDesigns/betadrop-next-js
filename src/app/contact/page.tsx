import { Metadata } from "next";
import ContactPageClient from "@/components/contact/ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | BetaDrop",
  description:
    "Get in touch with the BetaDrop team. We're here to help with your app distribution needs.",
  openGraph: {
    title: "Contact Us | BetaDrop",
    description: "Get in touch with the BetaDrop team.",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
