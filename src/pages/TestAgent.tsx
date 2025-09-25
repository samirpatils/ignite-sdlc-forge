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
  Globe
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
      
      toast({
        title: "Tests Generated",
        description: "Auto-generated test cases based on application analysis"
      });

      // Add generated test case
      const generatedTest: TestCase = {
        id: Date.now().toString(),
        name: "Auto-Generated Navigation Test",
        description: "Automatically generated test for main navigation flow",
        module: selectedModule || "General",
        steps: [
          "Navigate to application home page",
          "Verify page loads successfully",
          "Check main navigation elements",
          "Test responsive design"
        ],
        expectedResult: "All navigation elements should be functional and responsive",
        status: "pending",
        code: `import { test, expect } from '@playwright/test';

test('auto-generated navigation test', async ({ page }) => {
  await page.goto('${applicationUrl}');
  await expect(page).toHaveTitle(/.+/);
  
  // Test main navigation
  const nav = page.locator('nav');
  await expect(nav).toBeVisible();
  
  // Test responsive design
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(nav).toBeVisible();
});`
      };

      setTestCases(prev => [...prev, generatedTest]);
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
            <TabsTrigger value="create">Create Test</TabsTrigger>
            <TabsTrigger value="auto-generate">Auto Generate</TabsTrigger>
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

                <div className="flex gap-3">
                  <Button onClick={handleCreateTestCase} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Test Case
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Test File
                  </Button>
                </div>
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