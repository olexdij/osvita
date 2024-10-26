import { PricingCard } from "./PricingCard";

const plans = [
  {
    title: "Start",
    price: "$49",
    features: [
      "Up to 100 students",
      "Basic analytics",
      "5 admin seats",
      "Email support",
      "Basic customization"
    ]
  },
  {
    title: "Pro",
    price: "$99",
    features: [
      "Up to 1,000 students",
      "Advanced analytics",
      "15 admin seats",
      "Priority support",
      "Custom branding"
    ],
    highlighted: true
  },
  {
    title: "Premium",
    price: "$199",
    features: [
      "Unlimited students",
      "Full analytics suite",
      "Unlimited admins",
      "24/7 support",
      "White-label solution"
    ]
  }
];

export function PricingSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Choose Your Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}