import { Quote, Star } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHeading } from "./features";

const testimonials = [
  {
    quote:
      "It helps me turn a vague production issue into a focused investigation plan before the incident channel gets noisy.",
    name: "Maya Chen",
    role: "Staff Platform Engineer",
  },
  {
    quote:
      "The explanation layer is the difference. Junior developers see the reasoning, not just a patch they cannot defend.",
    name: "Daniel Okafor",
    role: "Engineering Manager",
  },
  {
    quote:
      "CodeMedic feels like a patient second set of eyes for the unglamorous edge cases that deserve attention.",
    name: "Elena Petrov",
    role: "Security-Focused Full Stack Developer",
  },
];

export function Testimonials() {
  return (
    <section className="border-y border-slate-800/80 bg-slate-950/35 px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Built for the way engineers think"
            title="Useful when the details matter."
            description="Developer-focused feedback that makes the next edit clearer, whether you are moving fast or reviewing carefully."
          />
        </Reveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 0.08}>
              <figure className="glass-panel h-full rounded-2xl p-6">
                <Quote className="size-6 text-cyan-300" />
                <blockquote className="mt-5 text-base leading-7 text-slate-300">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-7 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{testimonial.role}</p>
                  </div>
                  <div className="flex gap-0.5 text-amber-300" aria-label="Five stars">
                    {Array.from({ length: 5 }, (_, star) => (
                      <Star key={star} className="size-3.5 fill-current" />
                    ))}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
