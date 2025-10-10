import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Code, 
  Globe,
  Server,
  Database,
  Send,
  Bot,
  FolderTree,
  FileCode,
  Clock,
  Download,
  GitBranch,
  Check,
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LocationState {
  projectId: string;
  projectName: string;
}

interface CodeStructure {
  frontend: { [key: string]: string };
  middleware: { [key: string]: string };
  backend: { [key: string]: string };
}

interface Column {
  name: string;
  type: string;
  description: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isNullable?: boolean;
}

interface Entity {
  id: string;
  name: string;
  description: string;
  columns: Column[];
  isApproved: boolean;
}

interface ERDiagram {
  svg: string;
  entities: Entity[];
  relationships: string[];
}

const CodeAgent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = location.state as LocationState;
  
  const [activeTab, setActiveTab] = useState("frontend");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [folderStructure, setFolderStructure] = useState<CodeStructure>({
    frontend: {},
    middleware: {},
    backend: {}
  });

  // Data Modelling states
  const [dataModelPrompt, setDataModelPrompt] = useState("");
  const [isGeneratingER, setIsGeneratingER] = useState(false);
  const [erDiagram, setErDiagram] = useState<ERDiagram | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);

  const codeCategories = [
    {
      id: 'frontend',
      title: 'Frontend Code',
      description: 'User interface components, pages, and client-side logic',
      icon: Globe,
      color: 'primary',
      prompts: [
        'Create React components for user dashboard',
        'Generate responsive landing page with Tailwind CSS',
        'Build authentication forms with validation',
        'Create data visualization components with charts'
      ]
    },
    {
      id: 'middleware',
      title: 'Middleware Code',
      description: 'API routes, middleware functions, and service layers',
      icon: Server,
      color: 'accent',
      prompts: [
        'Generate Express.js API routes for user management',
        'Create authentication middleware with JWT',
        'Build data validation and sanitization middleware',
        'Generate REST API endpoints for CRUD operations'
      ]
    },
    {
      id: 'backend',
      title: 'Backend Scripts',
      description: 'Database operations, background jobs, and server utilities',
      icon: Database,
      color: 'success',
      prompts: [
        'Create database migration scripts',
        'Generate background job processors',
        'Build data seeding and cleanup scripts',
        'Create automated backup and monitoring scripts'
      ]
    }
  ];

  const generateFolderStructure = (category: string) => {
    const structures = {
      frontend: {
        'src/': '',
        'src/components/': '',
        'src/components/ui/': '',
        'src/components/forms/': '',
        'src/pages/': '',
        'src/hooks/': '',
        'src/utils/': '',
        'src/types/': '',
        'src/assets/': '',
        'public/': '',
        'package.json': '{\n  "name": "frontend-app",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build"\n  }\n}'
      },
      middleware: {
        'src/': '',
        'src/routes/': '',
        'src/middleware/': '',
        'src/controllers/': '',
        'src/services/': '',
        'src/utils/': '',
        'src/types/': '',
        'src/config/': '',
        'package.json': '{\n  "name": "middleware-api",\n  "version": "1.0.0",\n  "scripts": {\n    "start": "node dist/index.js",\n    "dev": "nodemon src/index.ts"\n  }\n}'
      },
      backend: {
        'scripts/': '',
        'scripts/migrations/': '',
        'scripts/seeds/': '',
        'scripts/jobs/': '',
        'scripts/utils/': '',
        'config/': '',
        'logs/': '',
        'package.json': '{\n  "name": "backend-scripts",\n  "version": "1.0.0",\n  "scripts": {\n    "migrate": "node scripts/migrations/run.js",\n    "seed": "node scripts/seeds/run.js"\n  }\n}'
      }
    };
    
    return structures[category as keyof typeof structures] || {};
  };

  const handleGenerate = async (category: string) => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setProgress(0);
    
    const steps = [
      "Analyzing code requirements...",
      "Planning folder structure...",
      "Generating boilerplate code...",
      "Creating configuration files...",
      "Setting up development environment...",
      "Finalizing code structure..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);
      setProgress((i + 1) * (100 / steps.length));
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    // Generate folder structure based on category
    const structure = generateFolderStructure(category);
    
    // Add some generated code files based on prompt
    const generatedFiles = {
      [`src/components/Generated${category.charAt(0).toUpperCase() + category.slice(1)}.tsx`]: 
        `// Generated based on prompt: "${prompt}"\n\n` +
        `export const Generated${category.charAt(0).toUpperCase() + category.slice(1)} = () => {\n` +
        `  // TODO: Implement functionality based on requirements\n` +
        `  return (\n    <div>\n      {/* Generated component */}\n    </div>\n  );\n};\n`,
      [`src/utils/generated-${category}.ts`]: 
        `// Utility functions for ${category}\n\n` +
        `export const generateHelper = () => {\n` +
        `  // TODO: Implement helper functions\n};\n`
    };

    const finalStructure = { ...structure, ...generatedFiles };

    setFolderStructure(prev => ({
      ...prev,
      [category]: finalStructure
    }));

    setIsGenerating(false);
    setCurrentStep("");
    
    toast({
      title: "Code Structure Generated",
      description: `${codeCategories.find(c => c.id === category)?.title} structure has been created.`,
    });
  };

  const handleDownload = (category: string) => {
    const structure = folderStructure[category as keyof CodeStructure];
    if (!structure || Object.keys(structure).length === 0) {
      toast({
        title: "No Structure to Download",
        description: "Generate a code structure first before downloading.",
        variant: "destructive"
      });
      return;
    }

    // Create a text representation of the folder structure
    let content = `# ${codeCategories.find(c => c.id === category)?.title} Structure\n\n`;
    content += `Generated on: ${new Date().toLocaleString()}\n`;
    content += `Project: ${state?.projectName || 'Unnamed Project'}\n\n`;
    content += `## Folder Structure\n\n`;
    
    Object.entries(structure).forEach(([path, fileContent]) => {
      content += `${path}\n`;
      if (fileContent && !path.endsWith('/')) {
        content += `\`\`\`\n${fileContent}\n\`\`\`\n\n`;
      }
    });

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${category}-structure.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `${category.charAt(0).toUpperCase() + category.slice(1)} structure downloaded successfully.`,
    });
  };

  const handleGenerateER = async () => {
    if (!dataModelPrompt.trim()) return;

    setIsGeneratingER(true);
    
    // Simulate ER diagram generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock entities based on prompt
    const mockEntities: Entity[] = [
      {
        id: "1",
        name: "users",
        description: "Stores user account information",
        columns: [
          { name: "id", type: "UUID", description: "Primary key", isPrimaryKey: true, isNullable: false },
          { name: "email", type: "VARCHAR(255)", description: "User email address", isNullable: false },
          { name: "username", type: "VARCHAR(100)", description: "Unique username", isNullable: false },
          { name: "created_at", type: "TIMESTAMP", description: "Account creation timestamp", isNullable: false },
        ],
        isApproved: false
      },
      {
        id: "2",
        name: "orders",
        description: "Stores customer orders",
        columns: [
          { name: "id", type: "UUID", description: "Primary key", isPrimaryKey: true, isNullable: false },
          { name: "user_id", type: "UUID", description: "Foreign key to users", isForeignKey: true, isNullable: false },
          { name: "total_amount", type: "DECIMAL(10,2)", description: "Order total", isNullable: false },
          { name: "status", type: "VARCHAR(50)", description: "Order status", isNullable: false },
          { name: "created_at", type: "TIMESTAMP", description: "Order creation timestamp", isNullable: false },
        ],
        isApproved: false
      },
      {
        id: "3",
        name: "products",
        description: "Stores product information",
        columns: [
          { name: "id", type: "UUID", description: "Primary key", isPrimaryKey: true, isNullable: false },
          { name: "name", type: "VARCHAR(200)", description: "Product name", isNullable: false },
          { name: "description", type: "TEXT", description: "Product description", isNullable: true },
          { name: "price", type: "DECIMAL(10,2)", description: "Product price", isNullable: false },
          { name: "stock_quantity", type: "INTEGER", description: "Available stock", isNullable: false },
        ],
        isApproved: false
      }
    ];

    // Generate mock ER diagram SVG
    const mockSVG = `
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <rect x="50" y="50" width="200" height="120" fill="hsl(var(--primary))" opacity="0.1" stroke="hsl(var(--primary))" stroke-width="2" rx="8"/>
        <text x="150" y="85" text-anchor="middle" fill="hsl(var(--foreground))" font-weight="bold" font-size="16">users</text>
        <text x="150" y="105" text-anchor="middle" fill="hsl(var(--muted-foreground))" font-size="12">id, email, username</text>
        
        <rect x="300" y="50" width="200" height="120" fill="hsl(var(--accent))" opacity="0.1" stroke="hsl(var(--accent))" stroke-width="2" rx="8"/>
        <text x="400" y="85" text-anchor="middle" fill="hsl(var(--foreground))" font-weight="bold" font-size="16">orders</text>
        <text x="400" y="105" text-anchor="middle" fill="hsl(var(--muted-foreground))" font-size="12">id, user_id, total_amount</text>
        
        <rect x="550" y="50" width="200" height="120" fill="hsl(var(--success))" opacity="0.1" stroke="hsl(var(--success))" stroke-width="2" rx="8"/>
        <text x="650" y="85" text-anchor="middle" fill="hsl(var(--foreground))" font-weight="bold" font-size="16">products</text>
        <text x="650" y="105" text-anchor="middle" fill="hsl(var(--muted-foreground))" font-size="12">id, name, price</text>
        
        <line x1="250" y1="110" x2="300" y2="110" stroke="hsl(var(--muted-foreground))" stroke-width="2"/>
        <circle cx="250" cy="110" r="4" fill="hsl(var(--muted-foreground))"/>
        <text x="275" y="100" text-anchor="middle" fill="hsl(var(--muted-foreground))" font-size="10">1:N</text>
      </svg>
    `;

    setErDiagram({
      svg: mockSVG,
      entities: mockEntities,
      relationships: ["users -> orders (1:N)", "orders -> products (N:N)"]
    });
    
    setEntities(mockEntities);
    setIsGeneratingER(false);

    toast({
      title: "ER Diagram Generated",
      description: "Database model has been created from your prompt.",
    });
  };

  const handleApproveEntity = (entityId: string) => {
    setEntities(prev => prev.map(entity => 
      entity.id === entityId ? { ...entity, isApproved: !entity.isApproved } : entity
    ));
    
    const entity = entities.find(e => e.id === entityId);
    if (entity && !entity.isApproved) {
      setSelectedEntity(entity);
      setEditingEntity({ ...entity });
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveEntity = () => {
    if (!editingEntity) return;

    setEntities(prev => prev.map(entity => 
      entity.id === editingEntity.id ? { ...editingEntity, isApproved: true } : entity
    ));

    setIsEditDialogOpen(false);
    setEditingEntity(null);

    toast({
      title: "Entity Approved",
      description: `Table "${editingEntity.name}" has been approved and saved.`,
    });
  };

  const handleUpdateColumn = (columnIndex: number, field: keyof Column, value: string | boolean) => {
    if (!editingEntity) return;

    const updatedColumns = [...editingEntity.columns];
    updatedColumns[columnIndex] = { ...updatedColumns[columnIndex], [field]: value };

    setEditingEntity({ ...editingEntity, columns: updatedColumns });
  };

  const handleGenerateScript = () => {
    if (!erDiagram || entities.length === 0) return;

    const approvedEntities = entities.filter(e => e.isApproved);
    
    let script = "-- Generated Database Schema\n\n";
    
    approvedEntities.forEach(entity => {
      script += `-- Table: ${entity.name}\n`;
      script += `-- ${entity.description}\n`;
      script += `CREATE TABLE ${entity.name} (\n`;
      
      entity.columns.forEach((column, index) => {
        script += `  ${column.name} ${column.type}`;
        if (column.isPrimaryKey) script += " PRIMARY KEY";
        if (!column.isNullable) script += " NOT NULL";
        if (index < entity.columns.length - 1) script += ",";
        script += `\n`;
      });
      
      script += `);\n\n`;
    });

    // Create and download file
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database-schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Script Generated",
      description: "Database schema script has been downloaded.",
    });
  };

  const renderFileTree = (files: { [key: string]: string }) => {
    return (
      <div className="space-y-1">
        {Object.entries(files).map(([path, content]) => {
          const isFolder = path.endsWith('/');
          const depth = (path.match(/\//g) || []).length;
          const paddingLeft = depth * 20;
          
          return (
            <div key={path} className="flex items-center gap-2" style={{ paddingLeft }}>
              {isFolder ? (
                <FolderTree className="h-4 w-4 text-accent" />
              ) : (
                <FileCode className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={`text-sm ${isFolder ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                {path.split('/').pop() || path}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

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
                onClick={() => navigate(`/project/${state?.projectId}`)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Project
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <Code className="h-5 w-5 text-success" />
                <h1 className="text-xl font-bold text-foreground">Code Agent</h1>
                {state?.projectName && (
                  <Badge variant="secondary">{state.projectName}</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Data Modelling Section */}
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Data Modelling
                </CardTitle>
                <CardDescription>
                  Generate ER diagrams and database schemas from your requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="data-prompt">Describe your data model</Label>
                  <Textarea
                    id="data-prompt"
                    placeholder="Example: Create a database for an e-commerce platform with users, products, orders, and payments..."
                    value={dataModelPrompt}
                    onChange={(e) => setDataModelPrompt(e.target.value)}
                    className="min-h-24"
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleGenerateER}
                    disabled={!dataModelPrompt.trim() || isGeneratingER}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isGeneratingER ? "Generating..." : "Analyze & Generate ER Diagram"}
                  </Button>
                  
                  {erDiagram && entities.filter(e => e.isApproved).length > 0 && (
                    <Button 
                      variant="outline"
                      onClick={handleGenerateScript}
                      className="gap-2"
                    >
                      <Database className="h-4 w-4" />
                      Generate Script
                    </Button>
                  )}
                </div>

                {isGeneratingER && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 animate-spin" />
                    Analyzing data requirements and generating ER diagram...
                  </div>
                )}

                {/* ER Diagram Display */}
                {erDiagram && (
                  <Card className="bg-muted/5 mt-4">
                    <CardHeader>
                      <CardTitle className="text-base">Generated ER Diagram</CardTitle>
                      <CardDescription>Entity relationships and structure</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="w-full border rounded-lg p-4 bg-background"
                        dangerouslySetInnerHTML={{ __html: erDiagram.svg }}
                      />
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium text-sm">Relationships:</h4>
                        <div className="space-y-1">
                          {erDiagram.relationships.map((rel, index) => (
                            <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                              <GitBranch className="h-3 w-3" />
                              {rel}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Application Structure with Code Generation */}
            <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                Application Structure
              </CardTitle>
              <CardDescription>
                Generate and manage your application's folder structure and boilerplate code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  {codeCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <TabsTrigger 
                        key={category.id} 
                        value={category.id}
                        className="gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {category.title}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {codeCategories.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="space-y-6 mt-6">
                    {/* Category Description */}
                    <Card className="bg-muted/5">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <div className={`bg-${category.color}/10 p-3 rounded-lg`}>
                            <category.icon className={`h-6 w-6 text-${category.color}`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground mb-2">{category.title}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Code Generation Interface for this category */}
                    <Card className="bg-gradient-card shadow-soft border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bot className="h-5 w-5" />
                          Generate {category.title}
                        </CardTitle>
                        <CardDescription>
                          Describe your requirements to generate {category.title.toLowerCase()} structure and code
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Quick Prompts for each category */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground">Quick Prompts:</h4>
                          <div className="flex flex-wrap gap-2">
                            {category.prompts.map((quickPrompt, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => setPrompt(quickPrompt)}
                                className="text-xs"
                              >
                                {quickPrompt}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <Textarea
                          placeholder={`Describe the ${category.title.toLowerCase()} structure and functionality you want to generate...`}
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="min-h-24"
                        />

                        {isGenerating && activeTab === category.id && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 animate-spin" />
                              {currentStep}
                            </div>
                            <Progress value={progress} className="w-full" />
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button 
                            onClick={() => handleGenerate(category.id)}
                            disabled={!prompt.trim() || (isGenerating && activeTab === category.id)}
                            className="gap-2"
                          >
                            <Send className="h-4 w-4" />
                            {(isGenerating && activeTab === category.id) ? "Generating..." : `Generate ${category.title}`}
                          </Button>
                          
                          {folderStructure[category.id as keyof CodeStructure] && 
                           Object.keys(folderStructure[category.id as keyof CodeStructure]).length > 0 && (
                            <Button 
                              variant="outline"
                              onClick={() => handleDownload(category.id)}
                              className="gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Download Structure
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Generated Structure */}
                    {folderStructure[category.id as keyof CodeStructure] && 
                     Object.keys(folderStructure[category.id as keyof CodeStructure]).length > 0 && (
                      <Card className="bg-muted/10">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Generated {category.title} Structure</CardTitle>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(category.id)}
                              className="gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {renderFileTree(folderStructure[category.id as keyof CodeStructure])}
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
          </div>

          {/* Right Sidebar - Entity List */}
          <div className="w-80 space-y-4">
            <Card className="bg-gradient-card shadow-soft border-0 sticky top-4">
              <CardHeader>
                <CardTitle className="text-base">Database Entities</CardTitle>
                <CardDescription>Review and approve entities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {entities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No entities generated yet
                  </div>
                ) : (
                  entities.map((entity) => (
                    <Card 
                      key={entity.id} 
                      className={`transition-all cursor-pointer ${
                        entity.isApproved 
                          ? 'bg-success/10 border-success/50' 
                          : 'bg-muted/5 hover:bg-muted/10'
                      }`}
                      onClick={() => handleApproveEntity(entity.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Database className="h-4 w-4" />
                              <h4 className="font-medium text-sm">{entity.name}</h4>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {entity.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {entity.columns.length} columns
                            </p>
                          </div>
                          <div>
                            {entity.isApproved ? (
                              <Badge variant="default" className="gap-1">
                                <Check className="h-3 w-3" />
                                Approved
                              </Badge>
                            ) : (
                              <Badge variant="outline">Pending</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Entity Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review & Edit Entity</DialogTitle>
            <DialogDescription>
              Review table and column details before approving
            </DialogDescription>
          </DialogHeader>

          {editingEntity && (
            <div className="space-y-6">
              {/* Table Information */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="table-name">Table Name</Label>
                  <Input
                    id="table-name"
                    value={editingEntity.name}
                    onChange={(e) => setEditingEntity({ ...editingEntity, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="table-description">Description</Label>
                  <Textarea
                    id="table-description"
                    value={editingEntity.description}
                    onChange={(e) => setEditingEntity({ ...editingEntity, description: e.target.value })}
                    className="min-h-20"
                  />
                </div>
              </div>

              {/* Columns */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Columns ({editingEntity.columns.length})</h4>
                </div>
                
                <div className="space-y-3">
                  {editingEntity.columns.map((column, index) => (
                    <Card key={index} className="bg-muted/5">
                      <CardContent className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor={`col-name-${index}`}>Column Name</Label>
                            <Input
                              id={`col-name-${index}`}
                              value={column.name}
                              onChange={(e) => handleUpdateColumn(index, 'name', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`col-type-${index}`}>Data Type</Label>
                            <Input
                              id={`col-type-${index}`}
                              value={column.type}
                              onChange={(e) => handleUpdateColumn(index, 'type', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`col-desc-${index}`}>Description</Label>
                          <Input
                            id={`col-desc-${index}`}
                            value={column.description}
                            onChange={(e) => handleUpdateColumn(index, 'description', e.target.value)}
                          />
                        </div>

                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={column.isPrimaryKey || false}
                              onChange={(e) => handleUpdateColumn(index, 'isPrimaryKey', e.target.checked)}
                              className="rounded"
                            />
                            Primary Key
                          </label>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={column.isForeignKey || false}
                              onChange={(e) => handleUpdateColumn(index, 'isForeignKey', e.target.checked)}
                              className="rounded"
                            />
                            Foreign Key
                          </label>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={column.isNullable || false}
                              onChange={(e) => handleUpdateColumn(index, 'isNullable', e.target.checked)}
                              className="rounded"
                            />
                            Nullable
                          </label>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEntity} className="gap-2">
                  <Check className="h-4 w-4" />
                  Approve & Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CodeAgent;