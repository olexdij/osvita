import { TestimonialCard } from "./TestimonialCard";

const testimonials = [
  {
    content: "ENUM's AI-powered course creation tools have revolutionized how we develop training materials. What used to take weeks now takes hours.",
    author: "Sarah Johnson",
    role: "Training Manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    content: "The analytics dashboard in ENUM provides invaluable insights into our team's learning progress. It's helped us identify and address skill gaps effectively.",
    author: "Michael Chen",
    role: "HR Director",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  {
    content: "ENUM's flexibility and customization options allowed us to create a learning environment that perfectly matches our brand identity.",
    author: "Emma Rodriguez",
    role: "CEO",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  }
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Trusted by Industry Leaders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}