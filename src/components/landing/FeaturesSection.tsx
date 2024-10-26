import { Brain, BookOpen, Award, Users, Zap, Globe } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Course Creation",
    description: "Create professional courses in minutes with our advanced AI technology"
  },
  {
    icon: BookOpen,
    title: "Comprehensive Learning",
    description: "Access a wide range of interactive content and assessments"
  },
  {
    icon: Award,
    title: "Certifications",
    description: "Earn recognized certificates upon course completion"
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Efficiently manage and track your team's progress"
  },
  {
    icon: Zap,
    title: "Analytics Dashboard",
    description: "Get detailed insights into learning performance"
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Learn anywhere, anytime with mobile-friendly content"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need to Succeed
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}