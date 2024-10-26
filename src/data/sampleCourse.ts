import { nanoid } from 'nanoid';

export const webDevCourse = {
  id: nanoid(),
  title: "Lean Manufacturing Excellence",
  description: `<p>Master the principles of Lean Manufacturing and transform your production processes. This comprehensive course covers everything from the 5S methodology to Kaizen practices, helping you eliminate waste and optimize operational efficiency.</p>
  <p>Through practical examples and real-world case studies, you'll learn how to implement lean principles in your organization and achieve sustainable improvements in productivity and quality.</p>`,
  thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
  students: 245,
  progress: 0,
  createdAt: new Date().toISOString(),
  modules: [
    {
      id: nanoid(),
      title: "Foundations of Lean Manufacturing",
      lessons: [
        {
          id: nanoid(),
          title: "Introduction to Lean Principles",
          content: `<h3>Understanding Lean Manufacturing</h3>
          <p>Lean manufacturing is a methodology that focuses on minimizing waste within manufacturing systems while simultaneously maximizing productivity. It is based on the Toyota Production System (TPS) and has revolutionized manufacturing worldwide.</p>
          <h4>Key Concepts:</h4>
          <ul>
            <li>Value Stream Mapping</li>
            <li>Just-in-Time Production</li>
            <li>Continuous Flow</li>
            <li>Pull Systems</li>
          </ul>`,
          videoUrl: null
        }
      ],
      assessment: {
        title: "Lean Foundations Assessment",
        description: "Test your understanding of basic lean manufacturing principles",
        passingScore: 70,
        questions: [
          {
            id: nanoid(),
            type: "multiple-choice",
            text: "Which of the following is NOT one of the 8 wastes in lean manufacturing?",
            options: [
              "Defects",
              "Overproduction",
              "Marketing",
              "Transportation"
            ],
            correctAnswer: "Marketing",
            points: 10
          }
        ]
      }
    }
  ]
};