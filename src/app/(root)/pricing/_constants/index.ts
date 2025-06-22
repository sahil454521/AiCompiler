import { 
  Boxes, 
  Globe, 
  RefreshCcw, 
  Shield, 
  Cpu, 
  Palette, 
  Bug, 
  Languages, 
  Users, 
  FolderKanban, 
  GitBranch, 
  MessageSquareQuote,
  Rocket, 
  GitCompare, 
  Container, 
  Globe2
} from "lucide-react";

/**
 * Enterprise tier features with detailed descriptions and eye-catching icons
 */
export const ENTERPRISE_FEATURES = [
  {
    icon: Globe,
    label: "Global Infrastructure",
    desc: "Lightning-fast execution across worldwide edge nodes",
    gradient: "from-blue-500 to-cyan-400",
    animation: "floating-slow"
  },
  {
    icon: Shield,
    label: "Enterprise Security",
    desc: "Bank-grade encryption and security protocols",
    gradient: "from-green-500 to-emerald-400",
    animation: "pulse-subtle"
  },
  {
    icon: RefreshCcw,
    label: "Real-time Sync",
    desc: "Instant synchronization across all devices",
    gradient: "from-purple-500 to-indigo-400",
    animation: "spin-slow"
  },
  {
    icon: Boxes,
    label: "Unlimited Storage",
    desc: "Store unlimited snippets and projects",
    gradient: "from-amber-500 to-orange-400",
    animation: "bounce-gentle"
  },
];

/**
 * Feature categories with icons and detailed descriptions for each plan tier
 */
export const FEATURES = {
  development: {
    icon: Cpu,
    title: "Development Tools",
    description: "Powerful tools to supercharge your coding workflow",
    gradient: "from-blue-600 to-indigo-600",
    features: [
      {
        name: "Advanced AI",
        description: "AI-powered code completion and suggestions",
        icon: Cpu,
        pro: true
      },
      {
        name: "Custom Theme Builder",
        description: "Create and save your perfect coding environment",
        icon: Palette,
        pro: true
      },
      {
        name: "Integrated Debugging",
        description: "Powerful tools to find and fix bugs instantly",
        icon: Bug,
        pro: true
      },
      {
        name: "Multi-language Support",
        description: "Code in over 40+ programming languages",
        icon: Languages,
        pro: false
      },
    ]
  },
  
  collaboration: {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with your team",
    gradient: "from-purple-600 to-pink-600",
    features: [
      {
        name: "Real-time Pair Programming",
        description: "Code together in real-time with multiple cursors",
        icon: Users,
        pro: true
      },
      {
        name: "Team Workspaces",
        description: "Dedicated environments for team projects",
        icon: FolderKanban,
        pro: true
      },
      {
        name: "Version Control Integration",
        description: "Seamless GitHub, GitLab and Bitbucket integration",
        icon: GitBranch,
        pro: true
      },
      {
        name: "Code Review Tools",
        description: "Comment, suggest and approve code changes",
        icon: MessageSquareQuote,
        pro: false
      },
    ]
  },
  
  deployment: {
    icon: Rocket,
    title: "Deployment & Infrastructure",
    description: "Take your code from development to production",
    gradient: "from-green-600 to-teal-600",
    features: [
      {
        name: "One-click Deployment",
        description: "Deploy your projects with a single click",
        icon: Rocket,
        pro: true
      },
      {
        name: "CI/CD Integration",
        description: "Automate testing and deployment workflows",
        icon: GitCompare,
        pro: true
      },
      {
        name: "Container Support",
        description: "Docker and Kubernetes deployment options",
        icon: Container,
        pro: true
      },
      {
        name: "Custom Domain Mapping",
        description: "Use your own domains for deployed applications",
        icon: Globe2,
        pro: false
      },
    ]
  },
};

/**
 * Pricing tiers with detailed information
 */
export const PRICING_TIERS = [
  {
    name: "Free",
    price: "$0",
    billing: "forever",
    description: "Perfect for hobbyists and casual coders",
    highlighted: false,
    features: [
      "Basic code execution",
      "5 languages support",
      "Community support",
      "500MB storage",
      "Public snippets only",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline",
    gradient: "from-gray-700 to-gray-900",
  },
  {
    name: "Pro",
    price: "$9",
    billing: "per month",
    description: "Everything you need for serious development",
    highlighted: true,
    features: [
      "All Free features",
      "40+ languages support",
      "Advanced AI assistance",
      "5GB storage",
      "Private snippets",
      "Custom themes",
      "Priority support",
    ],
    buttonText: "Upgrade Now",
    buttonVariant: "default",
    gradient: "from-blue-600 to-indigo-600",
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    billing: "tailored plans",
    description: "For teams and organizations with advanced needs",
    highlighted: false,
    features: [
      "All Pro features",
      "Unlimited storage",
      "Team workspaces",
      "SSO & advanced security",
      "Priority support",
      "Custom integrations",
      "Dedicated account manager",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "premium",
    gradient: "from-purple-600 to-indigo-600",
  }
];