import LegalLayout from "../ui/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <section>
        <h2 className="text-2xl font-black text-[#333333] uppercase underline decoration-[#FF8C42]">
          1. Data We Collect
        </h2>
        <p>
          We collect your name, phone number, and delivery address to ensure
          your Dabba reaches you hot and fresh. We do not sell your data to any
          third parties.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-black text-[#333333] uppercase underline decoration-[#FF8C42]">
          2. Payment Security
        </h2>
        <p>
          All payments are processed through Razorpay. DabbaNation does not
          store your credit card or UPI details on our servers.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-black text-[#333333] uppercase underline decoration-[#FF8C42]">
          3. Communication
        </h2>
        <p>
          By signing up, you agree to receive WhatsApp/SMS updates regarding
          your meal delivery and subscription status.
        </p>
      </section>
    </LegalLayout>
  );
}
