import LegalLayout from "../ui/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions">
      <section>
        <h2 className="text-2xl font-black text-[#333333] uppercase underline decoration-[#FFD166]">
          1. Subscription & Delivery
        </h2>
        <p>
          Meals are delivered 6 days a week (Monday-Saturday). Sunday is a
          holiday for our kitchen team. Delivery timings are fixed based on your
          chosen slot.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-black text-[#333333] uppercase underline decoration-[#FFD166]">
          2. Cancellations & Refunds
        </h2>
        <p>
          You can pause your subscription by contacting us 24 hours in advance.
          Refunds for partially used subscriptions are calculated on a pro-rata
          basis minus a small processing fee.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-black text-[#333333] uppercase underline decoration-[#FFD166]">
          3. Food Safety
        </h2>
        <p>
          Meals are prepared in a hygienic kitchen. We recommend consuming the
          food within 2 hours of delivery to ensure quality and safety.
        </p>
      </section>
    </LegalLayout>
  );
}
