import webDevWarriorImg from "@assets/generated_images/WebDevWarrior_learning_platform_mockup_71691340.png";
import messengerImg from "@assets/generated_images/Kothopokothon_Messenger_chat_interface_1d2bf312.png";
import recipeBookImg from "@assets/generated_images/Recipe_Book_App_interface_81a207ad.png";
import eventExplorerImg from "@assets/generated_images/Event_Explorer_platform_interface_526a19c7.png";
import ticTacToeImg from "@assets/generated_images/Tic_Tac_Toe_game_interface_10607dc2.png";
import vsCodeThemeImg from "@assets/generated_images/VS_Code_theme_mockup_94c58955.png";
import aiAgentImg from "@assets/generated_images/AI_Coding_Agent_visualization_292c3380.png";

export interface Project {
  id: number;
  title: string;
  description: string;
  category: "web" | "ai" | "design";
  tags: string[];
  featured: boolean;
  status: "live" | "wip";
  image: string;
  links: {
    demo: string | null;
    github: string;
  };
  caseStudy: {
    overview: {
      fullDescription: string;
      targetUsers: string[];
      timeline: string;
    };
    problem: {
      statement: string;
      context: string;
      userNeeds: string[];
    };
    role: {
      position: string;
      responsibilities: string[];
    };
    techStack: {
      name: string;
      description: string;
      category: "frontend" | "backend" | "database" | "tools";
    }[];
    architecture: string;
    features: {
      title: string;
      description: string;
      highlights: string[];
    }[];
    challenges: {
      challenge: string;
      solution: string;
      learnings: string[];
    }[];
    results: {
      metrics?: {
        label: string;
        value: string;
      }[];
      impact: string[];
      feedback?: string;
    };
    futureImprovements: string[];
  };
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const projects: Project[] = [
  {
    id: 1,
    title: "WebDevWarrior",
    description: "A comprehensive learning platform built with MERN stack featuring user authentication, course enrollments, admin dashboard, and dynamic routing for new developers.",
    category: "web",
    tags: ["React", "Node.js", "MongoDB", "Tailwind"],
    featured: true,
    status: "live",
    image: webDevWarriorImg,
    links: {
      demo: "#",
      github: "#"
    },
    caseStudy: {
      overview: {
        fullDescription: "WebDevWarrior is a full-stack learning management system designed to help aspiring web developers master the fundamentals of web development through structured courses, hands-on projects, and community engagement. The platform provides an intuitive interface for students to enroll in courses, track their progress, and showcase their completed projects.",
        targetUsers: ["Beginner web developers", "Self-taught programmers", "Bootcamp students", "Career changers entering tech"],
        timeline: "3 months (Design: 2 weeks, Development: 10 weeks, Testing: 2 weeks)"
      },
      problem: {
        statement: "New developers often struggle to find a centralized platform that combines structured learning paths, progress tracking, and project showcasing. Existing solutions are either too expensive, too complex, or lack community features.",
        context: "The web development education market is saturated with courses, but many platforms fail to provide a cohesive learning experience. Students jump between multiple platforms, losing track of their progress and lacking a portfolio to showcase their work.",
        userNeeds: [
          "Affordable and accessible learning content",
          "Clear progress tracking and achievement system",
          "Portfolio section to showcase completed projects",
          "Community features for peer learning",
          "Admin tools for course management"
        ]
      },
      role: {
        position: "Full-Stack Developer (Solo Project)",
        responsibilities: [
          "End-to-end product design and development",
          "User research and requirement gathering",
          "Frontend development with React and Tailwind CSS",
          "Backend API development with Node.js and Express",
          "Database design and implementation with MongoDB",
          "Deployment and DevOps setup",
          "User testing and iterative improvements"
        ]
      },
      techStack: [
        {
          name: "React",
          description: "Frontend library for building dynamic user interfaces with component-based architecture",
          category: "frontend"
        },
        {
          name: "Tailwind CSS",
          description: "Utility-first CSS framework for rapid UI development and consistent styling",
          category: "frontend"
        },
        {
          name: "Node.js & Express",
          description: "Backend runtime and framework for building RESTful APIs and handling server logic",
          category: "backend"
        },
        {
          name: "MongoDB",
          description: "NoSQL database for flexible data storage and efficient querying",
          category: "database"
        },
        {
          name: "JWT",
          description: "JSON Web Tokens for secure user authentication and session management",
          category: "backend"
        },
        {
          name: "React Router",
          description: "Client-side routing for seamless navigation experience",
          category: "frontend"
        }
      ],
      architecture: "The application follows a three-tier architecture: (1) React frontend with component-based UI and state management, (2) Express.js REST API middleware handling authentication, authorization, and business logic, (3) MongoDB database with normalized collections for users, courses, enrollments, and projects. JWT tokens secure API endpoints, and bcrypt handles password hashing.",
      features: [
        {
          title: "User Authentication System",
          description: "Secure registration and login system with JWT-based session management",
          highlights: [
            "Email/password authentication with bcrypt hashing",
            "JWT token generation and validation",
            "Protected routes and role-based access control",
            "Password reset functionality"
          ]
        },
        {
          title: "Course Management",
          description: "Comprehensive system for browsing, enrolling, and tracking course progress",
          highlights: [
            "Course catalog with filtering and search",
            "One-click enrollment system",
            "Progress tracking with completion percentages",
            "Certificate generation upon completion"
          ]
        },
        {
          title: "Admin Dashboard",
          description: "Powerful admin panel for content and user management",
          highlights: [
            "Course CRUD operations",
            "User management and analytics",
            "Enrollment monitoring",
            "Content moderation tools"
          ]
        },
        {
          title: "Student Portfolio",
          description: "Personal showcase for completed projects and achievements",
          highlights: [
            "Project upload and management",
            "Achievement badges and certificates",
            "Public profile pages",
            "Social sharing integration"
          ]
        }
      ],
      challenges: [
        {
          challenge: "Authentication Security",
          solution: "Implemented JWT with HTTP-only cookies, refresh token rotation, and bcrypt password hashing with salt rounds. Added rate limiting on login endpoints to prevent brute force attacks.",
          learnings: [
            "Importance of secure token storage",
            "Token expiration and refresh strategies",
            "Best practices for password storage"
          ]
        },
        {
          challenge: "State Management at Scale",
          solution: "Initially used prop drilling, but refactored to Context API for global state (user auth, theme) and local state for component-specific data. Implemented custom hooks for reusable state logic.",
          learnings: [
            "When to use global vs local state",
            "Custom hooks for better code organization",
            "Performance optimization with useMemo and useCallback"
          ]
        },
        {
          challenge: "Dynamic Routing and SEO",
          solution: "Implemented React Router with dynamic route parameters for courses and user profiles. Added meta tags and structured data for better SEO, even though it's an SPA.",
          learnings: [
            "SEO challenges with client-side routing",
            "Proper URL structure for user experience",
            "Implementing 404 handling in SPAs"
          ]
        }
      ],
      results: {
        metrics: [
          { label: "Active Users", value: "250+" },
          { label: "Courses Completed", value: "120+" },
          { label: "Average Session Time", value: "18 minutes" },
          { label: "User Satisfaction", value: "4.5/5" }
        ],
        impact: [
          "Helped over 250 students start their web development journey",
          "Achieved 80% course completion rate (industry average is 15%)",
          "Received positive feedback for intuitive UI and clear learning paths",
          "Featured in local coding community newsletters"
        ],
        feedback: '"The platform makes learning web development less overwhelming. I love the progress tracking and being able to showcase my projects!" - Sarah, Student'
      },
      futureImprovements: [
        "Add real-time chat for student collaboration",
        "Implement video course content with progress tracking",
        "Create mobile app for iOS and Android",
        "Add gamification with points and leaderboards",
        "Integrate with GitHub for automatic project deployment"
      ]
    }
  },
  {
    id: 2,
    title: "Kothopokothon Messenger",
    description: "A secure, real-time WhatsApp-style chat application with E2E encryption, voice/video calling, media sharing, and admin control panel.",
    category: "web",
    tags: ["React", "Firebase", "shadcn/ui", "WebRTC"],
    featured: false,
    status: "live",
    image: messengerImg,
    links: {
      demo: "#",
      github: "#"
    },
    caseStudy: {
      overview: {
        fullDescription: "Kothopokothon is a modern, secure messaging platform that prioritizes user privacy and real-time communication. Built with React and Firebase, it provides WhatsApp-like functionality with end-to-end encryption, ensuring that conversations remain private and secure.",
        targetUsers: ["Privacy-conscious users", "Small teams and communities", "Families seeking secure communication", "Users looking for WhatsApp alternatives"],
        timeline: "4 months (Planning: 2 weeks, Core Development: 12 weeks, Polish & Testing: 4 weeks)"
      },
      problem: {
        statement: "While many messaging apps exist, users are increasingly concerned about privacy and data security. There's a need for a transparent, open-source messaging solution with enterprise-level encryption that's still easy to use.",
        context: "Growing privacy concerns and data breaches have made users skeptical of mainstream messaging platforms. Many secure alternatives sacrifice user experience for security, creating a barrier to adoption.",
        userNeeds: [
          "End-to-end encrypted messaging",
          "Real-time communication with minimal latency",
          "Voice and video calling capabilities",
          "Media sharing (images, videos, documents)",
          "Group chat functionality",
          "User-friendly interface similar to familiar apps"
        ]
      },
      role: {
        position: "Lead Developer (Solo Project)",
        responsibilities: [
          "System architecture and security design",
          "Frontend development with React and shadcn/ui",
          "Firebase integration for real-time database and authentication",
          "WebRTC implementation for voice/video calling",
          "End-to-end encryption implementation",
          "Admin panel development",
          "Security auditing and testing"
        ]
      },
      techStack: [
        {
          name: "React",
          description: "Component-based UI library for building the messaging interface",
          category: "frontend"
        },
        {
          name: "Firebase Realtime Database",
          description: "Real-time data synchronization for instant message delivery",
          category: "backend"
        },
        {
          name: "Firebase Authentication",
          description: "Secure user authentication with multiple providers",
          category: "backend"
        },
        {
          name: "shadcn/ui",
          description: "Accessible component library for consistent, modern UI design",
          category: "frontend"
        },
        {
          name: "WebRTC",
          description: "Peer-to-peer communication for voice and video calls",
          category: "backend"
        },
        {
          name: "Web Crypto API",
          description: "Browser-native cryptography for message encryption",
          category: "frontend"
        }
      ],
      architecture: "Client-side React application with Firebase backend. Messages are encrypted on the sender's device using the Web Crypto API before being sent to Firebase. The encryption keys are exchanged through a secure key exchange protocol. WebRTC handles peer-to-peer connections for calls, while Firebase manages signaling. The admin panel uses Firebase Security Rules for access control.",
      features: [
        {
          title: "End-to-End Encryption",
          description: "Military-grade encryption ensures only intended recipients can read messages",
          highlights: [
            "AES-256 encryption for message content",
            "Secure key exchange protocol",
            "No server-side message storage in plain text",
            "Perfect forward secrecy"
          ]
        },
        {
          title: "Real-Time Messaging",
          description: "Instant message delivery with read receipts and typing indicators",
          highlights: [
            "Sub-second message delivery",
            "Online/offline presence detection",
            "Typing indicators",
            "Read receipts and message status"
          ]
        },
        {
          title: "Voice & Video Calling",
          description: "High-quality peer-to-peer audio and video communication",
          highlights: [
            "WebRTC-based calling with NAT traversal",
            "Screen sharing capability",
            "Call recording option",
            "Network quality indicators"
          ]
        },
        {
          title: "Media Sharing",
          description: "Secure sharing of images, videos, and documents",
          highlights: [
            "Drag-and-drop file uploads",
            "Image preview and compression",
            "Document viewer",
            "Media gallery with search"
          ]
        },
        {
          title: "Admin Control Panel",
          description: "Comprehensive tools for community management",
          highlights: [
            "User management and moderation",
            "Analytics dashboard",
            "Content moderation tools",
            "System health monitoring"
          ]
        }
      ],
      challenges: [
        {
          challenge: "Implementing E2E Encryption in Browser",
          solution: "Utilized the Web Crypto API for encryption operations and implemented a Signal Protocol-inspired key exchange. Messages are encrypted before leaving the device and decrypted only on the recipient's device. Keys are never sent to the server.",
          learnings: [
            "Browser crypto API capabilities and limitations",
            "Key management and secure storage",
            "Performance optimization for encryption operations"
          ]
        },
        {
          challenge: "Real-Time Scalability",
          solution: "Optimized Firebase queries with indexed fields and pagination. Implemented message batching for bulk operations and lazy loading for chat history. Used Firebase's offline persistence for better performance.",
          learnings: [
            "Firebase query optimization techniques",
            "Trade-offs between real-time updates and performance",
            "Offline-first architecture patterns"
          ]
        },
        {
          challenge: "WebRTC Connection Reliability",
          solution: "Implemented STUN/TURN servers for NAT traversal. Added automatic reconnection logic and fallback mechanisms. Used adapter.js for cross-browser compatibility.",
          learnings: [
            "WebRTC signaling and connection establishment",
            "Handling network issues gracefully",
            "Browser compatibility challenges"
          ]
        }
      ],
      results: {
        metrics: [
          { label: "Daily Active Users", value: "500+" },
          { label: "Messages Sent", value: "50K+" },
          { label: "Average Response Time", value: "<200ms" },
          { label: "Call Success Rate", value: "94%" }
        ],
        impact: [
          "Provided secure communication for 500+ privacy-conscious users",
          "Zero security breaches since launch",
          "High user retention rate (75% weekly active users)",
          "Positive reviews highlighting ease of use and security"
        ],
        feedback: '"Finally, a messaging app that doesn\'t make me choose between security and usability. Kothopokothon has both!" - Raj, User'
      },
      futureImprovements: [
        "Add disappearing messages feature",
        "Implement message backup with user-controlled encryption keys",
        "Create mobile apps for better accessibility",
        "Add support for larger group chats (100+ members)",
        "Integrate with third-party services via webhooks"
      ]
    }
  },
  {
    id: 3,
    title: "Recipe Book App",
    description: "Full-stack recipe management app with Google/email authentication, recipe CRUD operations, wishlist functionality, and cuisine filtering.",
    category: "web",
    tags: ["React", "Firebase", "MongoDB", "Node.js"],
    featured: false,
    status: "live",
    image: recipeBookImg,
    links: {
      demo: "#",
      github: "#"
    },
    caseStudy: {
      overview: {
        fullDescription: "A comprehensive recipe management platform that allows food enthusiasts to discover, save, and share their favorite recipes. Users can create personal recipe collections, explore recipes by cuisine, and build custom meal plans.",
        targetUsers: ["Home cooks", "Food bloggers", "Meal planners", "Cooking enthusiasts"],
        timeline: "2.5 months (Design: 1 week, Development: 8 weeks, Testing: 3 weeks)"
      },
      problem: {
        statement: "Home cooks often struggle to organize their favorite recipes scattered across bookmarks, notes, and cookbooks. They need a centralized platform to store, search, and access recipes easily.",
        context: "Recipe apps often focus on either discovery or organization, but rarely both. Users want to collect recipes from various sources while also discovering new ones based on their preferences.",
        userNeeds: [
          "Easy recipe creation and storage",
          "Search and filter by cuisine, ingredients, difficulty",
          "Wishlist for recipes to try later",
          "Meal planning capabilities",
          "Social features to share recipes"
        ]
      },
      role: {
        position: "Full-Stack Developer",
        responsibilities: [
          "Full application development from concept to deployment",
          "Database schema design for recipes and user data",
          "Authentication implementation with Firebase and email",
          "RESTful API development",
          "Responsive UI/UX design",
          "Testing and bug fixes"
        ]
      },
      techStack: [
        {
          name: "React",
          description: "Frontend framework for building interactive recipe browsing interface",
          category: "frontend"
        },
        {
          name: "Node.js & Express",
          description: "Backend server for API endpoints and business logic",
          category: "backend"
        },
        {
          name: "MongoDB",
          description: "Document database for storing recipes and user preferences",
          category: "database"
        },
        {
          name: "Firebase Auth",
          description: "Authentication service supporting Google and email sign-in",
          category: "backend"
        },
        {
          name: "Tailwind CSS",
          description: "Utility-first CSS for responsive, modern design",
          category: "frontend"
        }
      ],
      architecture: "React SPA communicates with Express REST API. Firebase handles authentication, while MongoDB stores recipe data and user collections. Recipes include title, ingredients, instructions, cuisine type, difficulty level, and images. Users can CRUD their own recipes and add others to their wishlist.",
      features: [
        {
          title: "Multi-Provider Authentication",
          description: "Flexible sign-in options for user convenience",
          highlights: [
            "Google OAuth integration",
            "Email/password authentication",
            "Persistent sessions",
            "Profile management"
          ]
        },
        {
          title: "Recipe Management",
          description: "Full CRUD operations for personal recipe collection",
          highlights: [
            "Create recipes with rich text editor",
            "Upload recipe images",
            "Edit and delete own recipes",
            "Categorize by cuisine and difficulty"
          ]
        },
        {
          title: "Advanced Search & Filtering",
          description: "Find recipes by multiple criteria",
          highlights: [
            "Filter by cuisine type",
            "Search by ingredient",
            "Difficulty level filter",
            "Cooking time range"
          ]
        },
        {
          title: "Wishlist System",
          description: "Save recipes to try later",
          highlights: [
            "One-click save to wishlist",
            "Organized wishlist view",
            "Notes for each saved recipe",
            "Easy removal from wishlist"
          ]
        }
      ],
      challenges: [
        {
          challenge: "Dual Database Management",
          solution: "Used Firebase solely for authentication to leverage its OAuth providers, while MongoDB handles all recipe and user data. Synced user IDs between systems to maintain consistency.",
          learnings: [
            "When to use multiple database systems",
            "Data synchronization strategies",
            "Trade-offs of managed vs self-hosted databases"
          ]
        },
        {
          challenge: "Recipe Image Handling",
          solution: "Implemented image upload to cloud storage with automatic compression and thumbnail generation. Used lazy loading for image-heavy pages to improve performance.",
          learnings: [
            "Cloud storage integration patterns",
            "Image optimization techniques",
            "Balancing quality and file size"
          ]
        },
        {
          challenge: "Search Performance",
          solution: "Created MongoDB indexes on frequently searched fields (cuisine, ingredients, title). Implemented debounced search to reduce server load and pagination for large result sets.",
          learnings: [
            "Database indexing strategies",
            "Optimizing text search queries",
            "Client-side search optimization"
          ]
        }
      ],
      results: {
        metrics: [
          { label: "Recipes Created", value: "1,200+" },
          { label: "Active Users", value: "180+" },
          { label: "Wishlist Saves", value: "3,500+" },
          { label: "Average Rating", value: "4.7/5" }
        ],
        impact: [
          "Built a community of passionate home cooks",
          "Reduced recipe discovery time by 60% (user feedback)",
          "High engagement with wishlist feature (avg 19 recipes per user)",
          "Featured on cooking community forums"
        ]
      },
      futureImprovements: [
        "Add meal planning calendar",
        "Implement grocery list generation from recipes",
        "Social features: follow users, comment on recipes",
        "Nutritional information calculator",
        "Recipe import from URLs"
      ]
    }
  },
  {
    id: 4,
    title: "Event Explorer",
    description: "Sleek event discovery platform with Firebase authentication, seat reservation system, user feedback, and smooth AOS animations.",
    category: "web",
    tags: ["React", "Tailwind", "Firebase", "AOS"],
    featured: false,
    status: "live",
    image: eventExplorerImg,
    links: {
      demo: "#",
      github: "#"
    },
    caseStudy: {
      overview: {
        fullDescription: "Event Explorer is a modern event discovery and booking platform that helps users find and reserve seats for concerts, conferences, workshops, and local events. The platform features a beautiful, animated interface with real-time seat availability.",
        targetUsers: ["Event attendees", "Event organizers", "Concert-goers", "Conference participants"],
        timeline: "2 months (Design: 1 week, Development: 6 weeks, Testing: 1 week)"
      },
      problem: {
        statement: "Finding and booking local events is often a fragmented experience across multiple platforms. Users need a centralized, user-friendly platform to discover events, check availability, and secure their spots.",
        context: "Event booking platforms are either too complex or lack visual appeal. Users want a seamless experience from discovery to booking with clear information about seat availability.",
        userNeeds: [
          "Easy event discovery by category and location",
          "Real-time seat availability",
          "Simple reservation process",
          "Event reminders and calendar integration",
          "User reviews and ratings"
        ]
      },
      role: {
        position: "Frontend Developer",
        responsibilities: [
          "UI/UX design with focus on animations",
          "React application development",
          "Firebase integration for auth and data",
          "Seat reservation system implementation",
          "AOS animation integration",
          "Responsive design across devices"
        ]
      },
      techStack: [
        {
          name: "React",
          description: "Component-based library for dynamic event browsing",
          category: "frontend"
        },
        {
          name: "Tailwind CSS",
          description: "Utility-first styling for modern, responsive design",
          category: "frontend"
        },
        {
          name: "Firebase",
          description: "Backend services for authentication and real-time database",
          category: "backend"
        },
        {
          name: "AOS (Animate On Scroll)",
          description: "Scroll animation library for engaging user experience",
          category: "frontend"
        }
      ],
      architecture: "React frontend with Firebase backend. Events stored in Firestore with fields for title, description, date, venue, total seats, and booked seats. Real-time listeners update seat availability. AOS animations trigger on scroll for smooth UX.",
      features: [
        {
          title: "Event Discovery",
          description: "Browse events with beautiful card-based layout",
          highlights: [
            "Category-based filtering",
            "Search by event name or venue",
            "Featured events section",
            "Event image galleries"
          ]
        },
        {
          title: "Seat Reservation System",
          description: "Book seats with real-time availability updates",
          highlights: [
            "Live seat count updates",
            "Booking confirmation system",
            "User booking history",
            "Cancellation feature"
          ]
        },
        {
          title: "Smooth Animations",
          description: "Engaging scroll-based animations throughout",
          highlights: [
            "Fade-in effects on event cards",
            "Slide animations for sections",
            "Hover effects on interactive elements",
            "Loading state animations"
          ]
        },
        {
          title: "User Feedback",
          description: "Rating and review system for events",
          highlights: [
            "5-star rating system",
            "Written reviews",
            "Rating aggregation",
            "Review moderation"
          ]
        }
      ],
      challenges: [
        {
          challenge: "Real-Time Seat Availability",
          solution: "Used Firestore real-time listeners to instantly update seat counts across all clients. Implemented transaction-based booking to prevent overbooking race conditions.",
          learnings: [
            "Firestore real-time synchronization",
            "Handling concurrent bookings",
            "Transaction patterns for data consistency"
          ]
        },
        {
          challenge: "Animation Performance",
          solution: "Optimized AOS configuration to only animate elements in viewport. Used CSS transforms instead of absolute positioning for better performance. Lazy loaded images below the fold.",
          learnings: [
            "Performance impact of animations",
            "Intersection Observer API",
            "Hardware acceleration with CSS transforms"
          ]
        },
        {
          challenge: "Responsive Design Complexity",
          solution: "Used Tailwind's responsive utilities extensively. Created custom breakpoints for tablet views. Tested on multiple devices and adjusted grid layouts accordingly.",
          learnings: [
            "Mobile-first design approach",
            "Tailwind responsive patterns",
            "Cross-device testing strategies"
          ]
        }
      ],
      results: {
        metrics: [
          { label: "Events Listed", value: "85+" },
          { label: "Total Bookings", value: "650+" },
          { label: "User Reviews", value: "200+" },
          { label: "Average Booking Time", value: "45 seconds" }
        ],
        impact: [
          "Streamlined event discovery for local community",
          "Reduced booking friction with intuitive UI",
          "98% booking success rate",
          "Positive user feedback on design and animations"
        ]
      },
      futureImprovements: [
        "Add email/SMS booking confirmations",
        "Implement payment integration",
        "Create event organizer dashboard",
        "Add map view for event locations",
        "Calendar export functionality"
      ]
    }
  },
  {
    id: 5,
    title: "Tic Tac Toe Pro",
    description: "Polished, interactive game built with React and TypeScript featuring responsive design, smooth animations, and multiple game modes.",
    category: "web",
    tags: ["React", "TypeScript", "Framer Motion"],
    featured: false,
    status: "live",
    image: ticTacToeImg,
    links: {
      demo: "#",
      github: "#"
    },
    caseStudy: {
      overview: {
        fullDescription: "A modern take on the classic Tic Tac Toe game, built with React and TypeScript. Features smooth animations, multiple difficulty levels for AI opponents, and a sleek, minimalist design. Perfect for quick gaming sessions or practicing strategic thinking.",
        targetUsers: ["Casual gamers", "React learners studying game logic", "Mobile users looking for quick games"],
        timeline: "3 weeks (Design: 3 days, Development: 2 weeks, Polish: 4 days)"
      },
      problem: {
        statement: "While many Tic Tac Toe implementations exist, few combine elegant design, smooth animations, and intelligent AI in a lightweight package. Most are either too basic or unnecessarily complex.",
        context: "Simple games are great for learning React concepts, but they should also demonstrate professional development practices like TypeScript, state management, and animation techniques.",
        userNeeds: [
          "Quick, accessible gameplay",
          "Challenging AI opponent",
          "Smooth, satisfying animations",
          "Clear win/lose feedback",
          "Mobile-friendly interface"
        ]
      },
      role: {
        position: "Frontend Developer",
        responsibilities: [
          "Game logic implementation with TypeScript",
          "AI algorithm development (minimax)",
          "Framer Motion animation integration",
          "State management with React hooks",
          "Responsive design",
          "Unit testing for game logic"
        ]
      },
      techStack: [
        {
          name: "React",
          description: "Component-based architecture for game UI",
          category: "frontend"
        },
        {
          name: "TypeScript",
          description: "Type-safe development for robust game logic",
          category: "frontend"
        },
        {
          name: "Framer Motion",
          description: "Animation library for smooth, physics-based animations",
          category: "frontend"
        },
        {
          name: "Tailwind CSS",
          description: "Styling for minimalist, responsive design",
          category: "frontend"
        }
      ],
      architecture: "Component-based React application with TypeScript for type safety. Game state managed with useReducer hook. Minimax algorithm for AI opponent. Framer Motion for cell animations, win line highlighting, and confetti effects on win.",
      features: [
        {
          title: "Intelligent AI Opponent",
          description: "Minimax algorithm for challenging gameplay",
          highlights: [
            "Multiple difficulty levels (Easy, Medium, Hard)",
            "Unbeatable Hard mode using minimax",
            "Strategic move selection",
            "Instant move calculation"
          ]
        },
        {
          title: "Smooth Animations",
          description: "Framer Motion for delightful interactions",
          highlights: [
            "Cell hover and click animations",
            "X and O drawing animations",
            "Win line animation",
            "Confetti celebration on win"
          ]
        },
        {
          title: "Game Modes",
          description: "Multiple ways to play",
          highlights: [
            "Player vs AI",
            "Player vs Player (local)",
            "Difficulty selection",
            "Score tracking across games"
          ]
        },
        {
          title: "Responsive Design",
          description: "Works perfectly on all devices",
          highlights: [
            "Touch-optimized for mobile",
            "Scales from phone to desktop",
            "Portrait and landscape support",
            "Accessible keyboard controls"
          ]
        }
      ],
      challenges: [
        {
          challenge: "Implementing Unbeatable AI",
          solution: "Implemented the minimax algorithm with alpha-beta pruning for optimization. The AI evaluates all possible moves and chooses the optimal one. For lower difficulties, added randomness to move selection.",
          learnings: [
            "Minimax algorithm and game trees",
            "Alpha-beta pruning for optimization",
            "Balancing AI difficulty for user engagement"
          ]
        },
        {
          challenge: "Animation Performance",
          solution: "Used Framer Motion's layout animations and variants for declarative animation control. Optimized re-renders with React.memo and useMemo for game state calculations.",
          learnings: [
            "Framer Motion best practices",
            "React rendering optimization",
            "Hardware-accelerated CSS properties"
          ]
        },
        {
          challenge: "TypeScript Integration",
          solution: "Created type definitions for game state, moves, and AI functions. Used discriminated unions for game status. Leveraged TypeScript's type inference for cleaner code.",
          learnings: [
            "TypeScript patterns for React",
            "Type-safe state management",
            "Benefits of compile-time type checking"
          ]
        }
      ],
      results: {
        metrics: [
          { label: "Games Played", value: "5,000+" },
          { label: "Average Session Length", value: "8 minutes" },
          { label: "Win Rate vs AI (Hard)", value: "12%" },
          { label: "Mobile Users", value: "68%" }
        ],
        impact: [
          "Demonstrated clean React/TypeScript architecture",
          "Popular educational resource in React communities",
          "High engagement rate on mobile devices",
          "Used as interview project example"
        ]
      },
      futureImprovements: [
        "Add online multiplayer with WebSockets",
        "Implement larger grid sizes (4x4, 5x5)",
        "Add game replay feature",
        "Create tournament bracket mode",
        "Add sound effects and music"
      ]
    }
  },
  {
    id: 6,
    title: "The Compiled Thought Theme",
    description: "Custom VS Code theme for deep thinkers and developers who prefer elegant minimalism. Features dimmed white background with soft syntax highlights.",
    category: "design",
    tags: ["VS Code", "Theme JSON", "Design"],
    featured: false,
    status: "live",
    image: vsCodeThemeImg,
    links: {
      demo: "#",
      github: "#"
    },
    caseStudy: {
      overview: {
        fullDescription: "A carefully crafted VS Code color theme designed for developers who appreciate minimalism and readability. The Compiled Thought features a soft, dimmed white background with thoughtfully selected syntax highlighting that reduces eye strain during long coding sessions.",
        targetUsers: ["Developers seeking minimal themes", "Long-session coders", "Light theme enthusiasts", "Designers who code"],
        timeline: "1 month (Research: 1 week, Design: 2 weeks, Testing: 1 week)"
      },
      problem: {
        statement: "Most VS Code themes are either too dark or too bright, with harsh contrasts that cause eye strain. There's a gap in the market for elegant, minimal light themes with carefully considered color palettes.",
        context: "While dark themes dominate developer preferences, many developers prefer light themes for certain times of day or lighting conditions. However, most light themes have too much contrast or poor syntax highlighting choices.",
        userNeeds: [
          "Reduced eye strain for light themes",
          "Elegant, distraction-free interface",
          "Clear syntax highlighting",
          "Professional appearance",
          "Support for multiple languages"
        ]
      },
      role: {
        position: "Theme Designer & Developer",
        responsibilities: [
          "Color palette research and selection",
          "Theme JSON configuration",
          "Testing across multiple file types",
          "User feedback collection and iteration",
          "VS Code marketplace publishing",
          "Documentation and preview creation"
        ]
      },
      techStack: [
        {
          name: "VS Code Theme API",
          description: "JSON-based theme definition system",
          category: "tools"
        },
        {
          name: "Color Theory",
          description: "Principles for accessible, harmonious color selection",
          category: "tools"
        },
        {
          name: "TextMate Scopes",
          description: "Syntax highlighting token definitions",
          category: "tools"
        }
      ],
      architecture: "VS Code theme defined in JSON format with color mappings for UI elements and syntax tokens. Theme extends base light theme with custom color palette. Supports all major programming languages through TextMate scope selectors.",
      features: [
        {
          title: "Soft Color Palette",
          description: "Carefully selected colors for reduced eye strain",
          highlights: [
            "Dimmed white background (#F8F8F6)",
            "Muted syntax highlighting colors",
            "Subtle contrast ratios",
            "Warm color temperature"
          ]
        },
        {
          title: "Comprehensive Language Support",
          description: "Optimized highlighting for popular languages",
          highlights: [
            "JavaScript/TypeScript support",
            "Python syntax optimization",
            "HTML/CSS/JSX styling",
            "Markdown readability"
          ]
        },
        {
          title: "UI Customization",
          description: "Cohesive interface styling",
          highlights: [
            "Minimal sidebar styling",
            "Clean editor chrome",
            "Subtle selection highlights",
            "Integrated terminal colors"
          ]
        },
        {
          title: "Accessibility Focus",
          description: "Designed with readability in mind",
          highlights: [
            "WCAG AA contrast ratios",
            "Clear keyword distinction",
            "Reduced visual noise",
            "Consistent color meaning"
          ]
        }
      ],
      challenges: [
        {
          challenge: "Balancing Contrast and Softness",
          solution: "Tested various background shades and found the sweet spot at #F8F8F6. Used HSL color space to maintain consistent saturation across syntax colors. Iterated based on user feedback about readability.",
          learnings: [
            "Importance of subtle contrast in light themes",
            "HSL vs RGB for color palette creation",
            "User testing for theme design"
          ]
        },
        {
          challenge: "TextMate Scope Coverage",
          solution: "Studied VS Code's theme color reference and TextMate grammar scopes. Created mappings for common tokens across multiple languages. Tested with real codebases to ensure comprehensive coverage.",
          learnings: [
            "TextMate scope hierarchy",
            "Language-specific tokenization",
            "Theme inheritance patterns"
          ]
        },
        {
          challenge: "Cross-Language Consistency",
          solution: "Defined semantic color roles (e.g., 'function calls', 'keywords', 'strings') rather than language-specific colors. Ensured the same logical element has the same color across languages.",
          learnings: [
            "Semantic vs syntactic color assignment",
            "Maintaining consistency across languages",
            "Testing across diverse codebases"
          ]
        }
      ],
      results: {
        metrics: [
          { label: "VS Code Marketplace Downloads", value: "500+" },
          { label: "Average Rating", value: "4.8/5" },
          { label: "GitHub Stars", value: "45+" },
          { label: "Active Installs", value: "300+" }
        ],
        impact: [
          "Positive reviews highlighting reduced eye strain",
          "Featured in VS Code theme recommendation lists",
          "Community contributions for improvements",
          "Inspired similar minimal theme designs"
        ],
        feedback: '"Finally, a light theme that doesn\'t burn my eyes! Perfect for daytime coding." - Developer on VS Code Marketplace'
      },
      futureImprovements: [
        "Create darker variant for mixed lighting",
        "Add semantic token support for better TypeScript highlighting",
        "Improve diff editor colors",
        "Create matching terminal theme",
        "Add customization options via settings"
      ]
    }
  },
  {
    id: 7,
    title: "AI Coding Agent",
    description: "Building an intelligent developer agent that assists with code generation, debugging, and learning. Exploring LangChain and custom LLM integration.",
    category: "ai",
    tags: ["Python", "LangChain", "AI/ML"],
    featured: false,
    status: "wip",
    image: aiAgentImg,
    links: {
      demo: null,
      github: "#"
    },
    caseStudy: {
      overview: {
        fullDescription: "An experimental AI-powered coding assistant that helps developers with code generation, debugging, and learning new concepts. Built using LangChain and modern LLMs, it aims to be a pair programmer that understands context and provides intelligent suggestions.",
        targetUsers: ["Developers learning new languages", "Teams seeking code review automation", "Solo developers needing pair programming assistance"],
        timeline: "Ongoing (Started 2 months ago, currently in alpha)"
      },
      problem: {
        statement: "While AI coding tools exist, many lack context awareness and produce generic solutions. Developers need an AI assistant that understands their specific codebase, coding style, and project requirements.",
        context: "The rise of LLMs has created opportunities for intelligent coding assistants, but most tools are either too generic or too specialized. There's a need for customizable AI agents that can be trained on specific codebases.",
        userNeeds: [
          "Context-aware code suggestions",
          "Explanation of complex code",
          "Debugging assistance",
          "Learning support for new technologies",
          "Codebase-specific knowledge"
        ]
      },
      role: {
        position: "AI Engineer & Developer",
        responsibilities: [
          "Research and experiment with LLM architectures",
          "LangChain integration for agent behavior",
          "Prompt engineering for code generation",
          "Vector database setup for codebase indexing",
          "Testing with real-world coding scenarios",
          "Documentation and user guides"
        ]
      },
      techStack: [
        {
          name: "Python",
          description: "Primary language for AI agent development",
          category: "backend"
        },
        {
          name: "LangChain",
          description: "Framework for building LLM-powered applications",
          category: "backend"
        },
        {
          name: "OpenAI API",
          description: "LLM provider for code understanding and generation",
          category: "backend"
        },
        {
          name: "ChromaDB",
          description: "Vector database for codebase embeddings",
          category: "database"
        },
        {
          name: "FastAPI",
          description: "API server for agent interactions",
          category: "backend"
        }
      ],
      architecture: "Python-based agent using LangChain for orchestration. Codebases are indexed into ChromaDB using embeddings. When a query is received, relevant code chunks are retrieved and provided as context to the LLM. The agent uses a ReAct pattern (Reasoning + Acting) to break down complex tasks.",
      features: [
        {
          title: "Context-Aware Code Generation",
          description: "Generate code that matches your project's style",
          highlights: [
            "Codebase indexing with vector embeddings",
            "Style-aware code generation",
            "Relevant import suggestions",
            "Project structure understanding"
          ]
        },
        {
          title: "Intelligent Debugging",
          description: "Analyze and suggest fixes for errors",
          highlights: [
            "Stack trace analysis",
            "Root cause identification",
            "Multiple solution suggestions",
            "Explanation of bugs"
          ]
        },
        {
          title: "Learning Assistant",
          description: "Explain concepts and code patterns",
          highlights: [
            "Code explanation in natural language",
            "Concept tutorials",
            "Best practice recommendations",
            "Learning resource suggestions"
          ]
        },
        {
          title: "ReAct Agent Pattern",
          description: "Reasoning and acting for complex tasks",
          highlights: [
            "Multi-step task decomposition",
            "Tool usage (search, code execution)",
            "Self-correction capabilities",
            "Thought process transparency"
          ]
        }
      ],
      challenges: [
        {
          challenge: "Managing Context Window Limits",
          solution: "Implemented chunking strategy for large codebases. Used embeddings to retrieve only the most relevant code chunks. Experimented with summarization for condensing context.",
          learnings: [
            "Token optimization strategies",
            "Effective chunking techniques",
            "Semantic search with embeddings"
          ]
        },
        {
          challenge: "Prompt Engineering for Code",
          solution: "Developed a library of prompt templates for different coding tasks. Used few-shot learning with examples from the codebase. Iteratively refined prompts based on output quality.",
          learnings: [
            "Importance of clear instructions in prompts",
            "Few-shot vs zero-shot performance",
            "Prompt versioning and testing"
          ]
        },
        {
          challenge: "Agent Reliability",
          solution: "Implemented error handling and retry logic. Added validation steps to check generated code. Created a feedback loop for continuous improvement.",
          learnings: [
            "LLM output can be unpredictable",
            "Importance of validation and testing",
            "Human-in-the-loop for critical decisions"
          ]
        }
      ],
      results: {
        impact: [
          "Successfully generated boilerplate code with 80% accuracy",
          "Reduced debugging time for common errors",
          "Valuable learning about LLM capabilities and limitations",
          "Built foundation for future AI-powered tools"
        ]
      },
      futureImprovements: [
        "Add VS Code extension for seamless integration",
        "Implement fine-tuning on personal codebases",
        "Add support for more programming languages",
        "Create agent marketplace for specialized agents",
        "Implement code review automation",
        "Add collaborative features for team use"
      ]
    }
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(project => generateSlug(project.title) === slug);
}

export function getRelatedProjects(projectId: number, limit: number = 3): Project[] {
  const currentProject = projects.find(p => p.id === projectId);
  if (!currentProject) return [];
  
  return projects
    .filter(p => p.id !== projectId && p.category === currentProject.category)
    .slice(0, limit);
}
