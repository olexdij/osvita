import { toast } from "sonner";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

interface CourseStructure {
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  prerequisites: string[];
  learningObjectives: string[];
  modules: Array<{
    title: string;
    description: string;
    duration: string;
    lessons: Array<{
      title: string;
      content: string;
      type: "video" | "text" | "quiz" | "exercise";
      duration: string;
      resources?: Array<{
        title: string;
        url: string;
        type: "document" | "video" | "link";
      }>;
    }>;
    assessment: {
      title: string;
      description: string;
      questions: Array<{
        text: string;
        type: "multiple-choice" | "essay";
        options?: string[];
        correctAnswer?: string;
        points: number;
      }>;
    };
  }>;
}

export async function generateCourseContent(prompt: string): Promise<CourseStructure> {
  if (!OPENAI_API_KEY) {
    toast.error("OpenAI API key is not configured. Please add it to your .env file.");
    throw new Error("OpenAI API key is missing. Add VITE_OPENAI_API_KEY to your .env file");
  }

  const systemPrompt = `You are an expert course creator and instructional designer. Create a detailed, production-ready course structure based on the user's prompt.

  Guidelines for course creation:
  1. Course Structure:
     - Create a comprehensive title that accurately reflects the content
     - Write an engaging description with clear value proposition
     - Define clear learning objectives
     - Include prerequisites if necessary
     - Suggest a relevant Unsplash image URL for the thumbnail
     - Specify course level and estimated duration

  2. Modules:
     - Create 3-5 logically sequenced modules
     - Each module should have a clear theme and learning outcomes
     - Include estimated duration for each module
     - Mix different types of content (video, text, interactive)

  3. Lessons:
     - Design engaging lessons with practical examples
     - Include a mix of theory and hands-on practice
     - Add relevant external resources and references
     - Keep lessons focused and digestible (15-30 minutes each)

  4. Assessments:
     - Create meaningful assessments that test understanding
     - Include a mix of question types
     - Provide clear, helpful explanations for answers
     - Ensure questions align with learning objectives

  Format your response as a JSON object with this exact structure:
  {
    "title": "Course Title",
    "description": "Comprehensive course description with HTML formatting",
    "thumbnail": "Unsplash image URL",
    "duration": "Estimated total duration",
    "level": "beginner|intermediate|advanced",
    "prerequisites": ["prerequisite 1", "prerequisite 2"],
    "learningObjectives": ["objective 1", "objective 2"],
    "modules": [
      {
        "title": "Module Title",
        "description": "Module description",
        "duration": "Module duration",
        "lessons": [
          {
            "title": "Lesson Title",
            "content": "Detailed lesson content with HTML formatting",
            "type": "video|text|quiz|exercise",
            "duration": "Lesson duration",
            "resources": [
              {
                "title": "Resource Title",
                "url": "Resource URL",
                "type": "document|video|link"
              }
            ]
          }
        ],
        "assessment": {
          "title": "Assessment Title",
          "description": "Assessment description",
          "questions": [
            {
              "text": "Question text",
              "type": "multiple-choice|essay",
              "options": ["option 1", "option 2"],
              "correctAnswer": "Correct option",
              "points": 10
            }
          ]
        }
      }
    ]
  }

  Ensure:
  - All HTML formatting is properly escaped
  - All URLs are valid
  - Content is professional and engaging
  - Proper JSON structure
  - Realistic durations
  - Clear learning progression`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { 
            role: "system", 
            content: systemPrompt 
          },
          { 
            role: "user", 
            content: `Create a detailed, professional course about: ${prompt}. 
            Consider the target audience, required prerequisites, and ensure a logical learning progression.
            Include practical exercises and real-world examples where appropriate.
            Format the response as specified in the system message.` 
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate course content");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from OpenAI API");
    }

    // Clean and validate JSON string
    const cleanedContent = content
      .trim()
      .replace(/^```json/g, '')
      .replace(/```$/g, '')
      .trim();

    let courseContent: CourseStructure;
    try {
      courseContent = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error("Failed to parse course content. The AI response was not valid JSON.");
    }

    // Validate course structure
    const validateCourse = (course: CourseStructure) => {
      if (!course.title || typeof course.title !== 'string') {
        throw new Error("Invalid course title");
      }

      if (!course.description || typeof course.description !== 'string') {
        throw new Error("Invalid course description");
      }

      if (!course.level || !['beginner', 'intermediate', 'advanced'].includes(course.level)) {
        throw new Error("Invalid course level");
      }

      if (!Array.isArray(course.prerequisites)) {
        throw new Error("Invalid prerequisites");
      }

      if (!Array.isArray(course.learningObjectives)) {
        throw new Error("Invalid learning objectives");
      }

      if (!Array.isArray(course.modules)) {
        throw new Error("Invalid modules structure");
      }

      course.modules.forEach((module, moduleIndex) => {
        if (!module.title || typeof module.title !== 'string') {
          throw new Error(`Invalid title in module ${moduleIndex + 1}`);
        }

        if (!Array.isArray(module.lessons)) {
          throw new Error(`Invalid lessons array in module ${moduleIndex + 1}`);
        }

        module.lessons.forEach((lesson, lessonIndex) => {
          if (!lesson.title || typeof lesson.title !== 'string') {
            throw new Error(`Invalid title in lesson ${lessonIndex + 1} of module ${moduleIndex + 1}`);
          }

          if (!lesson.content || typeof lesson.content !== 'string') {
            throw new Error(`Invalid content in lesson ${lessonIndex + 1} of module ${moduleIndex + 1}`);
          }

          if (!lesson.type || !['video', 'text', 'quiz', 'exercise'].includes(lesson.type)) {
            throw new Error(`Invalid lesson type in lesson ${lessonIndex + 1} of module ${moduleIndex + 1}`);
          }
        });

        if (!module.assessment || typeof module.assessment !== 'object') {
          throw new Error(`Invalid assessment in module ${moduleIndex + 1}`);
        }
      });
    };

    validateCourse(courseContent);
    return courseContent;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error("Network error: Unable to connect to OpenAI API");
    }

    throw error instanceof Error 
      ? error 
      : new Error("An unexpected error occurred while generating course content");
  }
}