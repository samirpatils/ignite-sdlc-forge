import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  Play,
  Upload,
  Download,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Image,
  Clock,
  Settings,
  TestTube2,
  Target,
  Globe,
  Shield,
  ShieldAlert,
  Info
} from "lucide-react";

interface LocationState {
  projectId?: string;
  projectName?: string;
}

interface TestCase {
  id: string;
  name: string;
  description: string;
  module: string;
  steps: string[];
  expectedResult: string;
  status: "pending" | "running" | "passed" | "failed";
  lastRun?: string;
  duration?: number;
  screenshot?: string;
  code: string;
}

interface TestModule {
  id: string;
  name: string;
  description: string;
  testCount: number;
}

interface VaptResult {
  id: string;
  vulnerability: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  description: string;
  affected: string;
  recommendation: string;
}

interface VaptScenario {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
}

const TestAgent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = location.state as LocationState;
  
  const [activeTab, setActiveTab] = useState("overview");
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [modules, setModules] = useState<TestModule[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedModule, setSelectedModule] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [generatedResults, setGeneratedResults] = useState<{modules: TestModule[], testCases: TestCase[]} | null>(null);
  const [viewingTestCase, setViewingTestCase] = useState<TestCase | null>(null);
  const [executingTestId, setExecutingTestId] = useState<string | null>(null);
  const [newTestCase, setNewTestCase] = useState({
    name: "",
    description: "",
    module: "",
    steps: [""],
    expectedResult: "",
    code: `import { test, expect } from '@playwright/test';

test('sample test', async ({ page }) => {
  await page.goto('${applicationUrl || 'https://example.com'}');
  await expect(page).toHaveTitle(/Expected Title/);
});`
  });
  const [vaptUrl, setVaptUrl] = useState("https://your-application.com");
  const [isVaptTesting, setIsVaptTesting] = useState(false);
  const [vaptResults, setVaptResults] = useState<VaptResult[]>([]);

  // Mock data initialization
  useEffect(() => {
    const mockModules: TestModule[] = [
      { id: "1", name: "User Authentication", description: "Login, logout, and user management tests", testCount: 8 },
      { id: "2", name: "E-Commerce Cart", description: "Shopping cart functionality and checkout process", testCount: 12 },
      { id: "3", name: "Product Management", description: "Product CRUD operations and search functionality", testCount: 15 },
      { id: "4", name: "Payment Processing", description: "Payment gateway integration tests", testCount: 6 }
    ];

    const mockTestCases: TestCase[] = [
      {
        id: "1",
        name: "User Login Success",
        description: "Test successful user login with valid credentials",
        module: "User Authentication",
        steps: [
          "Navigate to login page",
          "Enter valid username",
          "Enter valid password",
          "Click login button"
        ],
        expectedResult: "User should be redirected to dashboard",
        status: "passed",
        lastRun: "2024-01-20 14:30",
        duration: 2.5,
        screenshot: "login-success.png",
        code: `import { test, expect } from '@playwright/test';

test('user login success', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="username"]', 'testuser');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="login-btn"]');
  await expect(page).toHaveURL('/dashboard');
});`
      },
      {
        id: "2",
        name: "Add Product to Cart",
        description: "Test adding a product to shopping cart",
        module: "E-Commerce Cart",
        steps: [
          "Navigate to product page",
          "Select product options",
          "Click add to cart",
          "Verify cart count increases"
        ],
        expectedResult: "Product should be added to cart successfully",
        status: "failed",
        lastRun: "2024-01-20 14:25",
        duration: 3.2,
        screenshot: "cart-error.png",
        code: `import { test, expect } from '@playwright/test';

test('add product to cart', async ({ page }) => {
  await page.goto('/products/1');
  await page.click('[data-testid="add-to-cart"]');
  const cartCount = await page.textContent('[data-testid="cart-count"]');
  expect(parseInt(cartCount || '0')).toBeGreaterThan(0);
});`
      }
    ];

    setModules(mockModules);
    setTestCases(mockTestCases);
  }, []);

  const handleGenerateTests = async () => {
    if (!applicationUrl) {
      toast({
        title: "URL Required",
        description: "Please provide an application URL to generate tests",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Simulate test generation progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setIsGenerating(false);
      
      // Generate multiple test cases across different modules
      const generatedModules: TestModule[] = [
        { id: "gen-1", name: "Navigation Tests", description: "Generated navigation and routing tests", testCount: 3 },
        { id: "gen-2", name: "Form Validation", description: "Generated form input and validation tests", testCount: 4 },
        { id: "gen-3", name: "API Integration", description: "Generated API endpoint and data flow tests", testCount: 2 },
        { id: "gen-4", name: "UI Components", description: "Generated component interaction tests", testCount: 5 }
      ];

      const generatedTestCases: TestCase[] = [
        {
          id: `gen-${Date.now()}-1`,
          name: "Navigation Menu Test",
          description: "Test main navigation menu functionality",
          module: "Navigation Tests",
          steps: ["Load homepage", "Check navigation visibility", "Click menu items", "Verify page transitions"],
          expectedResult: "All navigation links should work correctly",
          status: "pending",
          code: `import { test, expect } from '@playwright/test';

test('navigation menu functionality', async ({ page }) => {
  await page.goto('${applicationUrl}');
  const nav = page.locator('nav');
  await expect(nav).toBeVisible();
  
  const menuItems = page.locator('nav a');
  const count = await menuItems.count();
  expect(count).toBeGreaterThan(0);
});`
        },
        {
          id: `gen-${Date.now()}-2`,
          name: "Form Submission Test",
          description: "Test form validation and submission",
          module: "Form Validation",
          steps: ["Navigate to form", "Fill required fields", "Submit form", "Verify success message"],
          expectedResult: "Form should submit successfully with valid data",
          status: "pending",
          code: `import { test, expect } from '@playwright/test';

test('form validation and submission', async ({ page }) => {
  await page.goto('${applicationUrl}/form');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="text"]', 'Test User');
  await page.click('button[type="submit"]');
  await expect(page.locator('.success-message')).toBeVisible();
});`
        },
        {
          id: `gen-${Date.now()}-3`,
          name: "API Data Loading Test",
          description: "Test API data fetching and display",
          module: "API Integration",
          steps: ["Load data page", "Wait for API response", "Verify data display", "Check loading states"],
          expectedResult: "Data should load and display correctly",
          status: "pending",
          code: `import { test, expect } from '@playwright/test';

test('api data loading', async ({ page }) => {
  await page.goto('${applicationUrl}/data');
  await page.waitForResponse(response => response.url().includes('/api/'));
  const dataItems = page.locator('[data-testid="data-item"]');
  await expect(dataItems.first()).toBeVisible();
});`
        },
        {
          id: `gen-${Date.now()}-4`,
          name: "Responsive Design Test",
          description: "Test responsive layout on different screen sizes",
          module: "UI Components",
          steps: ["Load page on desktop", "Resize to tablet", "Resize to mobile", "Verify layout adapts"],
          expectedResult: "Layout should adapt to different screen sizes",
          status: "pending",
          code: `import { test, expect } from '@playwright/test';

test('responsive design', async ({ page }) => {
  await page.goto('${applicationUrl}');
  
  // Test desktop
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expect(page.locator('header')).toBeVisible();
  
  // Test mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page.locator('header')).toBeVisible();
});`
        }
      ];

      setGeneratedResults({
        modules: generatedModules,
        testCases: generatedTestCases
      });

      toast({
        title: "Tests Generated Successfully",
        description: `Generated ${generatedTestCases.length} test cases across ${generatedModules.length} modules`
      });
    }, 5000);
  };

  const handleExecuteTests = async () => {
    setIsExecuting(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 800);

    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setIsExecuting(false);

      // Update test statuses randomly for demo
      setTestCases(prev => prev.map(test => ({
        ...test,
        status: Math.random() > 0.3 ? "passed" : "failed",
        lastRun: new Date().toLocaleString(),
        duration: Math.round((Math.random() * 5 + 1) * 10) / 10
      })));

      toast({
        title: "Test Execution Complete",
        description: "All test cases have been executed with Playwright"
      });
    }, 6000);
  };

  const handleAddTestStep = () => {
    setNewTestCase(prev => ({
      ...prev,
      steps: [...prev.steps, ""]
    }));
  };

  const handleUpdateTestStep = (index: number, value: string) => {
    setNewTestCase(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  };

  const handleRemoveTestStep = (index: number) => {
    setNewTestCase(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const handleCreateTestCase = () => {
    if (!newTestCase.name || !newTestCase.description) {
      toast({
        title: "Required Fields Missing",
        description: "Please provide test name and description",
        variant: "destructive"
      });
      return;
    }

    const testCase: TestCase = {
      id: Date.now().toString(),
      ...newTestCase,
      status: "pending",
      steps: newTestCase.steps.filter(step => step.trim() !== "")
    };

    setTestCases(prev => [...prev, testCase]);
    setNewTestCase({
      name: "",
      description: "",
      module: "",
      steps: [""],
      expectedResult: "",
      code: `import { test, expect } from '@playwright/test';

test('sample test', async ({ page }) => {
  await page.goto('${applicationUrl || 'https://example.com'}');
  await expect(page).toHaveTitle(/Expected Title/);
});`
    });

    toast({
      title: "Test Case Created",
      description: "New test case has been added successfully"
    });
  };

  const handleViewTestCase = (testCase: TestCase) => {
    setViewingTestCase(testCase);
  };

  const handleExecuteIndividualTest = async (testCaseId: string) => {
    setExecutingTestId(testCaseId);
    
    // Simulate individual test execution
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% success rate for demo
      setExecutingTestId(null);
      
      if (generatedResults) {
        setGeneratedResults(prev => ({
          ...prev!,
          testCases: prev!.testCases.map(tc => 
            tc.id === testCaseId 
              ? { 
                  ...tc, 
                  status: isSuccess ? "passed" : "failed",
                  lastRun: new Date().toLocaleString(),
                  duration: Math.round((Math.random() * 5 + 1) * 10) / 10
                }
              : tc
          )
        }));
      }
      
      toast({
        title: isSuccess ? "Test Passed" : "Test Failed",
        description: isSuccess 
          ? "Individual test case executed successfully"
          : "Test case failed during execution",
        variant: isSuccess ? "default" : "destructive"
      });
    }, 3000);
  };

  const handleAddGeneratedTests = () => {
    if (generatedResults) {
      setTestCases(prev => [...prev, ...generatedResults.testCases]);
      setModules(prev => [...prev, ...generatedResults.modules]);
      setGeneratedResults(null);
      
      toast({
        title: "Tests Added",
        description: "Generated test cases have been added to your test suite"
      });
    }
  };

  const handleExecuteSingleTest = async () => {
    if (!newTestCase.name || !newTestCase.code) {
      toast({
        title: "Cannot Execute",
        description: "Please provide test name and code before execution",
        variant: "destructive"
      });
      return;
    }

    setIsExecuting(true);
    
    // Simulate test execution
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% success rate for demo
      setIsExecuting(false);
      
      toast({
        title: isSuccess ? "Test Execution Successful" : "Test Execution Failed",
        description: isSuccess 
          ? "Test case executed successfully with Playwright"
          : "Test case failed during execution. Check the test code and try again.",
        variant: isSuccess ? "default" : "destructive"
      });
    }, 3000);
  };

  const handleSaveTestCase = () => {
    if (!newTestCase.name || !newTestCase.description || !newTestCase.module) {
      toast({
        title: "Required Fields Missing",
        description: "Please provide test name, description, and module name",
        variant: "destructive"
      });
      return;
    }

    const testCase: TestCase = {
      id: Date.now().toString(),
      ...newTestCase,
      status: "pending",
      steps: newTestCase.steps.filter(step => step.trim() !== "")
    };

    setTestCases(prev => [...prev, testCase]);
    
    toast({
      title: "Test Case Saved",
      description: `Test case saved to module: ${newTestCase.module}`,
    });
  };

  const getStatusIcon = (status: TestCase["status"]) => {
    switch (status) {
      case "passed": return <CheckCircle className="h-4 w-4 text-success" />;
      case "failed": return <XCircle className="h-4 w-4 text-destructive" />;
      case "running": return <Clock className="h-4 w-4 text-warning animate-spin" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: TestCase["status"]) => {
    switch (status) {
      case "passed": return "bg-success/10 text-success border-success/20";
      case "failed": return "bg-destructive/10 text-destructive border-destructive/20";
      case "running": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const handleVaptTest = async () => {
    if (!vaptUrl) {
      toast({
        title: "URL Required",
        description: "Please provide an application URL for VAPT testing",
        variant: "destructive"
      });
      return;
    }

    setIsVaptTesting(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 600);

    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setIsVaptTesting(false);

      // Generate mock VAPT results
      const mockResults: VaptResult[] = [
        {
          id: "1",
          vulnerability: "SQL Injection",
          severity: "critical",
          description: "Application is vulnerable to SQL injection attacks in the login form",
          affected: "/api/auth/login",
          recommendation: "Use parameterized queries and input validation"
        },
        {
          id: "2",
          vulnerability: "Cross-Site Scripting (XSS)",
          severity: "high",
          description: "User input is not properly sanitized, allowing XSS attacks",
          affected: "/search, /comment sections",
          recommendation: "Implement Content Security Policy and encode all user inputs"
        },
        {
          id: "3",
          vulnerability: "Insecure Direct Object Reference",
          severity: "high",
          description: "Users can access unauthorized resources by modifying URL parameters",
          affected: "/api/users/:id",
          recommendation: "Implement proper authorization checks"
        },
        {
          id: "4",
          vulnerability: "Missing Security Headers",
          severity: "medium",
          description: "Critical security headers are not configured",
          affected: "All endpoints",
          recommendation: "Add X-Frame-Options, X-Content-Type-Options, and Strict-Transport-Security headers"
        },
        {
          id: "5",
          vulnerability: "Weak Password Policy",
          severity: "medium",
          description: "Password requirements are too weak",
          affected: "/register",
          recommendation: "Enforce minimum 12 characters with complexity requirements"
        },
        {
          id: "6",
          vulnerability: "Information Disclosure",
          severity: "low",
          description: "Server version information exposed in response headers",
          affected: "All endpoints",
          recommendation: "Remove or obfuscate server version headers"
        },
        {
          id: "7",
          vulnerability: "SSL/TLS Configuration",
          severity: "info",
          description: "Application supports outdated TLS protocols",
          affected: "HTTPS endpoints",
          recommendation: "Disable TLS 1.0 and 1.1, support only TLS 1.2 and above"
        }
      ];

      setVaptResults(mockResults);

      toast({
        title: "VAPT Scan Complete",
        description: `Found ${mockResults.length} security findings`
      });
    }, 6000);
  };

  const vaptBestPractices: VaptScenario[] = [
    {
      id: "1",
      title: "SQL Injection Testing",
      description: "Test all input fields with SQL injection payloads to verify proper input sanitization",
      severity: "critical",
      category: "Injection"
    },
    {
      id: "2",
      title: "Cross-Site Scripting (XSS)",
      description: "Verify that user inputs are properly encoded and sanitized to prevent XSS attacks",
      severity: "critical",
      category: "Injection"
    },
    {
      id: "3",
      title: "Authentication Bypass",
      description: "Test for weak authentication mechanisms and session management vulnerabilities",
      severity: "critical",
      category: "Authentication"
    },
    {
      id: "4",
      title: "Broken Access Control",
      description: "Verify that users cannot access unauthorized resources or perform unauthorized actions",
      severity: "critical",
      category: "Authorization"
    },
    {
      id: "5",
      title: "Security Misconfiguration",
      description: "Check for default credentials, unnecessary services, and exposed configuration files",
      severity: "high",
      category: "Configuration"
    },
    {
      id: "6",
      title: "Sensitive Data Exposure",
      description: "Ensure sensitive data is encrypted in transit and at rest",
      severity: "high",
      category: "Data Protection"
    },
    {
      id: "7",
      title: "XML External Entities (XXE)",
      description: "Test XML parsers for XXE vulnerabilities that can lead to data disclosure",
      severity: "high",
      category: "Injection"
    },
    {
      id: "8",
      title: "Insecure Deserialization",
      description: "Verify that deserialization of untrusted data is properly handled",
      severity: "high",
      category: "Injection"
    },
    {
      id: "9",
      title: "Using Components with Known Vulnerabilities",
      description: "Identify and update outdated libraries and frameworks with known vulnerabilities",
      severity: "high",
      category: "Dependencies"
    },
    {
      id: "10",
      title: "Insufficient Logging & Monitoring",
      description: "Ensure critical security events are logged and monitored",
      severity: "medium",
      category: "Monitoring"
    },
    {
      id: "11",
      title: "CSRF Token Validation",
      description: "Verify that all state-changing operations require valid CSRF tokens",
      severity: "high",
      category: "Session Management"
    },
    {
      id: "12",
      title: "Clickjacking Protection",
      description: "Test for X-Frame-Options and CSP frame-ancestors directives",
      severity: "medium",
      category: "Client-Side"
    },
    {
      id: "13",
      title: "Directory Traversal",
      description: "Test file upload and download functionality for path traversal vulnerabilities",
      severity: "high",
      category: "File Operations"
    },
    {
      id: "14",
      title: "Remote Code Execution",
      description: "Test for vulnerabilities that allow arbitrary code execution on the server",
      severity: "critical",
      category: "Injection"
    },
    {
      id: "15",
      title: "Business Logic Flaws",
      description: "Test for flaws in business logic that can be exploited for unauthorized gains",
      severity: "high",
      category: "Logic"
    },
    {
      id: "16",
      title: "Rate Limiting & DoS Protection",
      description: "Verify that API endpoints have proper rate limiting to prevent abuse",
      severity: "medium",
      category: "Availability"
    },
    {
      id: "17",
      title: "Password Reset Token Security",
      description: "Test password reset mechanism for token predictability and expiration",
      severity: "high",
      category: "Authentication"
    },
    {
      id: "18",
      title: "API Security Testing",
      description: "Test REST/GraphQL APIs for authentication, authorization, and input validation issues",
      severity: "high",
      category: "API"
    },
    {
      id: "19",
      title: "Session Fixation & Hijacking",
      description: "Verify session tokens are regenerated after authentication and properly secured",
      severity: "high",
      category: "Session Management"
    },
    {
      id: "20",
      title: "Content Security Policy",
      description: "Verify CSP headers are properly configured to mitigate XSS and data injection attacks",
      severity: "medium",
      category: "Client-Side"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "info": return "bg-muted/10 text-muted-foreground border-muted/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const passedTests = testCases.filter(t => t.status === "passed").length;
  const failedTests = testCases.filter(t => t.status === "failed").length;
  const totalTests = testCases.length;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(`/project/${state?.projectId || '1'}`)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Project
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="bg-warning/10 p-2 rounded-lg">
                  <TestTube2 className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Test Agent</h1>
                  <p className="text-sm text-muted-foreground">{state?.projectName || "Project"}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={handleExecuteTests}
                disabled={isExecuting || testCases.length === 0}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                {isExecuting ? "Running..." : "Run All Tests"}
              </Button>
              <Button 
                variant="hero"
                onClick={handleGenerateTests}
                disabled={isGenerating}
                className="gap-2"
              >
                <TestTube2 className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Tests"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
            <TabsTrigger value="create">Create Test</TabsTrigger>
            <TabsTrigger value="auto-generate">Auto Generate</TabsTrigger>
            <TabsTrigger value="vapt-testing">VAPT Testing</TabsTrigger>
            <TabsTrigger value="vapt-practices">Best Practices</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Test Summary */}
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Test Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/10 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{totalTests}</div>
                    <div className="text-sm text-muted-foreground">Total Tests</div>
                  </div>
                  <div className="text-center p-4 bg-success/10 rounded-lg">
                    <div className="text-2xl font-bold text-success">{passedTests}</div>
                    <div className="text-sm text-muted-foreground">Passed</div>
                  </div>
                  <div className="text-center p-4 bg-destructive/10 rounded-lg">
                    <div className="text-2xl font-bold text-destructive">{failedTests}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                  <div className="text-center p-4 bg-warning/10 rounded-lg">
                    <div className="text-2xl font-bold text-warning">{modules.length}</div>
                    <div className="text-sm text-muted-foreground">Modules</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Modules */}
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <CardTitle>Test Modules</CardTitle>
                <CardDescription>
                  Test cases organized by BRD Agent modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {modules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-4 bg-muted/5 rounded-lg border">
                      <div>
                        <h4 className="font-medium">{module.name}</h4>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                      <Badge variant="secondary">{module.testCount} tests</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test-cases" className="space-y-6">
            {(isExecuting) && (
              <Card className="bg-gradient-card shadow-soft border-0">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Play className="h-5 w-5 text-warning animate-pulse" />
                      <span className="font-medium">Executing Tests with Playwright...</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-muted-foreground">
                      Running automated tests and capturing screenshots
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {testCases.map((testCase) => (
                <Card key={testCase.id} className="bg-gradient-card shadow-soft border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(testCase.status)}
                        <div>
                          <CardTitle className="text-lg">{testCase.name}</CardTitle>
                          <CardDescription>{testCase.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(testCase.status)}>
                          {testCase.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Module</Label>
                        <Badge variant="outline" className="mt-1">{testCase.module}</Badge>
                      </div>
                      {testCase.lastRun && (
                        <div>
                          <Label className="text-sm font-medium">Last Run</Label>
                          <p className="text-sm text-muted-foreground">{testCase.lastRun}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Test Steps</Label>
                      <ul className="mt-2 space-y-1">
                        {testCase.steps.map((step, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary font-medium mt-0.5">{index + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Expected Result</Label>
                      <p className="text-sm text-muted-foreground mt-1">{testCase.expectedResult}</p>
                    </div>

                    {testCase.screenshot && (
                      <div className="flex items-center gap-2 p-3 bg-muted/5 rounded-lg">
                        <Image className="h-4 w-4 text-primary" />
                        <span className="text-sm">Screenshot: {testCase.screenshot}</span>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <CardTitle>Create New Test Case</CardTitle>
                <CardDescription>
                  Manually create a custom test case with TypeScript and Playwright
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="testName">Test Name</Label>
                    <Input 
                      id="testName"
                      value={newTestCase.name}
                      onChange={(e) => setNewTestCase(prev => ({...prev, name: e.target.value}))}
                      placeholder="Enter test name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="module">Module</Label>
                    <Input 
                      id="module"
                      value={newTestCase.module}
                      onChange={(e) => setNewTestCase(prev => ({...prev, module: e.target.value}))}
                      placeholder="Select or enter module"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    value={newTestCase.description}
                    onChange={(e) => setNewTestCase(prev => ({...prev, description: e.target.value}))}
                    placeholder="Describe what this test validates"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Test Steps</Label>
                    <Button variant="outline" size="sm" onClick={handleAddTestStep}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newTestCase.steps.map((step, index) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          value={step}
                          onChange={(e) => handleUpdateTestStep(index, e.target.value)}
                          placeholder={`Step ${index + 1}`}
                        />
                        {newTestCase.steps.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveTestStep(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="expectedResult">Expected Result</Label>
                  <Textarea 
                    id="expectedResult"
                    value={newTestCase.expectedResult}
                    onChange={(e) => setNewTestCase(prev => ({...prev, expectedResult: e.target.value}))}
                    placeholder="Describe the expected outcome"
                  />
                </div>

                <div>
                  <Label htmlFor="testCode">TypeScript Test Code</Label>
                  <Textarea 
                    id="testCode"
                    value={newTestCase.code}
                    onChange={(e) => setNewTestCase(prev => ({...prev, code: e.target.value}))}
                    className="font-mono text-sm"
                    rows={10}
                  />
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button onClick={handleCreateTestCase} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Test Case
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Test File
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleExecuteSingleTest}
                    disabled={isExecuting || !newTestCase.name || !newTestCase.code}
                    className="gap-2"
                  >
                    <Play className="h-4 w-4" />
                    {isExecuting ? "Executing..." : "Execute Test Case"}
                  </Button>
                  <Button 
                    variant="hero" 
                    onClick={handleSaveTestCase}
                    disabled={!newTestCase.name || !newTestCase.module}
                    className="gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Save Test Case
                  </Button>
                </div>

                {isExecuting && (
                  <Card className="bg-muted/5 border-warning/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Play className="h-5 w-5 text-warning animate-pulse" />
                        <span className="text-sm font-medium">Executing test case...</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auto-generate" className="space-y-6">
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <CardTitle>Auto-Generate Tests</CardTitle>
                <CardDescription>
                  Automatically generate test cases using Playwright by analyzing your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="appUrl">Application URL</Label>
                  <Input 
                    id="appUrl"
                    type="url"
                    value={applicationUrl}
                    onChange={(e) => setApplicationUrl(e.target.value)}
                    placeholder="https://your-application.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username (Optional)</Label>
                    <Input 
                      id="username"
                      value={credentials.username}
                      onChange={(e) => setCredentials(prev => ({...prev, username: e.target.value}))}
                      placeholder="Test user credentials"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password (Optional)</Label>
                    <Input 
                      id="password"
                      type="password"
                      value={credentials.password}
                      onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
                      placeholder="Test user password"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="targetModule">Target Module (Optional)</Label>
                  <Input 
                    id="targetModule"
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    placeholder="Focus on specific module"
                  />
                </div>

                {isGenerating && (
                  <Card className="bg-muted/5 border-warning/20">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Settings className="h-5 w-5 text-warning animate-spin" />
                          <span className="font-medium">Analyzing Application...</span>
                        </div>
                        <Progress value={progress} className="w-full" />
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>• Crawling application pages</p>
                          <p>• Identifying interactive elements</p>
                          <p>• Analyzing user flows</p>
                          <p>• Generating TypeScript test code</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button 
                  onClick={handleGenerateTests}
                  disabled={isGenerating || !applicationUrl}
                  className="gap-2"
                  size="lg"
                >
                  <Globe className="h-4 w-4" />
                  {isGenerating ? "Generating Tests..." : "Analyze & Generate Tests"}
                </Button>

                {/* Generated Results Table */}
                {generatedResults && (
                  <Card className="bg-gradient-card shadow-soft border-0 mt-6">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Generated Test Results</CardTitle>
                          <CardDescription>
                            {generatedResults.testCases.length} test cases generated across {generatedResults.modules.length} modules
                          </CardDescription>
                        </div>
                        <Button onClick={handleAddGeneratedTests} className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add All Tests
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {generatedResults.modules.map((module) => {
                          const moduleTests = generatedResults.testCases.filter(tc => tc.module === module.name);
                          return (
                            <div key={module.id} className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-lg">{module.name}</h4>
                                  <p className="text-sm text-muted-foreground">{module.description}</p>
                                </div>
                                <Badge variant="secondary">{moduleTests.length} tests</Badge>
                              </div>
                              
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Test Case</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {moduleTests.map((testCase) => (
                                    <TableRow key={testCase.id}>
                                      <TableCell className="font-medium">{testCase.name}</TableCell>
                                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                                        {testCase.description}
                                      </TableCell>
                                      <TableCell>
                                        <Badge className={getStatusColor(testCase.status)}>
                                          {testCase.status}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        {testCase.duration ? `${testCase.duration}s` : '-'}
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex gap-2">
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleViewTestCase(testCase)}
                                            className="gap-1"
                                          >
                                            <FileText className="h-3 w-3" />
                                            View
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleExecuteIndividualTest(testCase.id)}
                                            disabled={executingTestId === testCase.id}
                                            className="gap-1"
                                          >
                                            <Play className="h-3 w-3" />
                                            {executingTestId === testCase.id ? 'Running...' : 'Execute'}
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Test Case View Dialog */}
                <Dialog open={!!viewingTestCase} onOpenChange={() => setViewingTestCase(null)}>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{viewingTestCase?.name}</DialogTitle>
                    </DialogHeader>
                    {viewingTestCase && (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Description</Label>
                          <p className="text-sm text-muted-foreground mt-1">{viewingTestCase.description}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Module</Label>
                          <Badge variant="outline" className="mt-1">{viewingTestCase.module}</Badge>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Test Steps</Label>
                          <ul className="mt-2 space-y-1">
                            {viewingTestCase.steps.map((step, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary font-medium mt-0.5">{index + 1}.</span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Expected Result</Label>
                          <p className="text-sm text-muted-foreground mt-1">{viewingTestCase.expectedResult}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">TypeScript Test Code</Label>
                          <Textarea 
                            value={viewingTestCase.code}
                            readOnly
                            className="font-mono text-sm mt-2"
                            rows={12}
                          />
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vapt-testing" className="space-y-6">
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Vulnerability Assessment & Penetration Testing
                </CardTitle>
                <CardDescription>
                  Automated security testing to identify vulnerabilities in your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="vaptUrl">Application URL</Label>
                  <Input 
                    id="vaptUrl"
                    type="url"
                    value={vaptUrl}
                    onChange={(e) => setVaptUrl(e.target.value)}
                    placeholder="https://your-application.com"
                  />
                </div>

                {isVaptTesting && (
                  <Card className="bg-muted/5 border-warning/20">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <ShieldAlert className="h-5 w-5 text-warning animate-pulse" />
                          <span className="font-medium">Running Security Scan...</span>
                        </div>
                        <Progress value={progress} className="w-full" />
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>• Checking for SQL injection vulnerabilities</p>
                          <p>• Testing XSS attack vectors</p>
                          <p>• Analyzing authentication mechanisms</p>
                          <p>• Scanning for security misconfigurations</p>
                          <p>• Checking SSL/TLS configuration</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button 
                  onClick={handleVaptTest}
                  disabled={isVaptTesting || !vaptUrl}
                  className="gap-2"
                  size="lg"
                >
                  <ShieldAlert className="h-4 w-4" />
                  {isVaptTesting ? "Scanning Application..." : "Test Application for VAPT"}
                </Button>

                {vaptResults.length > 0 && (
                  <Card className="bg-gradient-card shadow-soft border-0 mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Security Findings</CardTitle>
                      <CardDescription>
                        {vaptResults.length} vulnerabilities discovered
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Vulnerability</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Affected</TableHead>
                            <TableHead>Recommendation</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {vaptResults.map((result) => (
                            <TableRow key={result.id}>
                              <TableCell className="font-medium">{result.vulnerability}</TableCell>
                              <TableCell>
                                <Badge className={getSeverityColor(result.severity)}>
                                  {result.severity.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm max-w-xs">{result.description}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{result.affected}</TableCell>
                              <TableCell className="text-sm max-w-xs">{result.recommendation}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vapt-practices" className="space-y-6">
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Top 20 VAPT Testing Scenarios
                </CardTitle>
                <CardDescription>
                  Best practices and security testing scenarios to ensure comprehensive vulnerability assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {vaptBestPractices.map((scenario, index) => (
                    <Card key={scenario.id} className="bg-muted/5 border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-lg font-bold text-primary">#{index + 1}</span>
                              <h4 className="font-semibold text-lg">{scenario.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{scenario.category}</Badge>
                              <Badge className={getSeverityColor(scenario.severity)}>
                                {scenario.severity.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <CardTitle>Test Execution Results</CardTitle>
                <CardDescription>
                  Detailed results from Playwright test execution with screenshots
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {testCases
                    .filter(test => test.status !== "pending")
                    .map((testCase) => (
                    <div key={testCase.id} className="flex items-center justify-between p-4 bg-muted/5 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(testCase.status)}
                        <div>
                          <h4 className="font-medium">{testCase.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Duration: {testCase.duration}s</span>
                            <span>Last run: {testCase.lastRun}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(testCase.status)}>
                          {testCase.status}
                        </Badge>
                        {testCase.screenshot && (
                          <Button variant="ghost" size="sm">
                            <Image className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TestAgent;