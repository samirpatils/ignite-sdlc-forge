import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bot, 
  Upload, 
  FileText, 
  Edit3, 
  Save, 
  ArrowLeft, 
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Package,
  Plus,
  Trash2,
  Archive,
  Calendar,
  Hash
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ModuleView } from "@/components/ModuleView";
import { ModuleEditForm } from "@/components/ModuleEditForm";

interface DocumentDetails {
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  extractedInfo: {
    projectName: string;
    scope: string[];
    stakeholders: string[];
    timeline: string;
    budget: string;
    technicalRequirements: string[];
  };
}

interface FunctionalModule {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  priority: 'High' | 'Medium' | 'Low';
  estimatedEffort: string;
  dependencies: string[];
}

const BRDAgent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentDetails, setDocumentDetails] = useState<DocumentDetails | null>(null);
  const [customPrompt, setCustomPrompt] = useState(
    `Generate a comprehensive Business Requirements Document (BRD) that includes:

1. Executive Summary
2. Project Overview and Objectives
3. Stakeholder Analysis
4. Functional Requirements
5. Non-Functional Requirements
6. User Stories and Use Cases
7. Acceptance Criteria
8. Risk Assessment
9. Timeline and Milestones
10. Success Metrics

Please ensure the BRD is detailed, actionable, and follows industry best practices.`
  );
  const [generatedBRD, setGeneratedBRD] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExtractedInfoOpen, setIsExtractedInfoOpen] = useState(true);
  const [functionalModules, setFunctionalModules] = useState<FunctionalModule[]>([
    {
      id: '1',
      name: 'User Authentication',
      description: 'Complete user registration, login, and profile management system',
      requirements: ['User registration', 'Login/Logout', 'Password reset', 'Profile management', 'Role-based access'],
      priority: 'High',
      estimatedEffort: '3-4 weeks',
      dependencies: ['Database setup', 'Security framework']
    },
    {
      id: '2',
      name: 'Product Catalog',
      description: 'Product listing, search, and categorization functionality',
      requirements: ['Product listing', 'Search functionality', 'Category management', 'Product details view', 'Inventory tracking'],
      priority: 'High',
      estimatedEffort: '4-5 weeks',
      dependencies: ['User Authentication', 'Admin Dashboard']
    },
    {
      id: '3',
      name: 'Shopping Cart',
      description: 'Cart management and checkout process',
      requirements: ['Add to cart', 'Cart management', 'Checkout process', 'Order summary', 'Cart persistence'],
      priority: 'High',
      estimatedEffort: '2-3 weeks',
      dependencies: ['Product Catalog', 'User Authentication']
    },
    {
      id: '4',
      name: 'Payment Processing',
      description: 'Secure payment gateway integration',
      requirements: ['Payment gateway integration', 'Multiple payment methods', 'Transaction security', 'Payment history', 'Refund processing'],
      priority: 'High',
      estimatedEffort: '3-4 weeks',
      dependencies: ['Shopping Cart', 'User Authentication']
    },
    {
      id: '5',
      name: 'Admin Dashboard',
      description: 'Administrative interface for managing the platform',
      requirements: ['User management', 'Product management', 'Order management', 'Analytics dashboard', 'System settings'],
      priority: 'Medium',
      estimatedEffort: '5-6 weeks',
      dependencies: ['User Authentication']
    }
  ]);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'extracted' | 'brd' | 'modules'>('extracted');
  const [savedBRDs, setSavedBRDs] = useState<Array<{
    id: string;
    name: string;
    content: string;
    version: number;
    savedAt: string;
    projectName: string;
  }>>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [thinkingStep, setThinkingStep] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsProcessing(true);
      
      // Simulate document processing
      setTimeout(() => {
        setDocumentDetails({
          fileName: file.name,
          fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          uploadedAt: new Date().toISOString(),
          extractedInfo: {
            projectName: "E-Commerce Platform Modernization",
            scope: [
              "Frontend React application",
              "Backend API development", 
              "Payment gateway integration",
              "User authentication system",
              "Admin dashboard"
            ],
            stakeholders: [
              "Product Manager - Sarah Johnson",
              "Technical Lead - Mike Chen",
              "UX Designer - Lisa Park",
              "Business Analyst - David Kumar"
            ],
            timeline: "6 months (January 2024 - June 2024)",
            budget: "$150,000 - $200,000",
            technicalRequirements: [
              "React 18+ with TypeScript",
              "Node.js backend with Express",
              "PostgreSQL database",
              "AWS cloud infrastructure",
              "Stripe payment integration"
            ]
          }
        });
        setIsProcessing(false);
        toast({
          title: "Document Processed",
          description: "RFP information has been extracted successfully",
        });
      }, 2000);
    }
  };

  const handleGenerateBRD = () => {
    setIsGenerating(true);
    
    // Simulate thinking process with animations
    const thinkingSteps = [
      "Analyzing uploaded document...",
      "Extracting key requirements...", 
      "Planning document structure...",
      "Generating content sections...",
      "Finalizing BRD document..."
    ];
    
    let currentStep = 0;
    setThinkingStep(thinkingSteps[currentStep]);
    
    const stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < thinkingSteps.length) {
        setThinkingStep(thinkingSteps[currentStep]);
      } else {
        clearInterval(stepInterval);
        setThinkingStep("");
      }
    }, 600);
    
    // Simulate BRD generation
    setTimeout(() => {
      clearInterval(stepInterval);
      setThinkingStep("");
      setGeneratedBRD(`# Business Requirements Document
## E-Commerce Platform Modernization

### 1. Executive Summary
This document outlines the business requirements for modernizing our existing e-commerce platform to improve user experience, increase conversion rates, and support business growth.

### 2. Project Overview and Objectives
**Primary Objectives:**
- Modernize the user interface for better user experience
- Implement responsive design for mobile optimization
- Integrate advanced payment options
- Enhance security and performance

### 3. Stakeholder Analysis
**Primary Stakeholders:**
- Product Manager: Sarah Johnson
- Technical Lead: Mike Chen
- UX Designer: Lisa Park
- Business Analyst: David Kumar

### 4. Functional Requirements
- User registration and authentication
- Product catalog management
- Shopping cart functionality
- Payment processing
- Order management
- Admin dashboard

### 5. Non-Functional Requirements
- Performance: Page load time < 3 seconds
- Security: PCI DSS compliance
- Scalability: Support 10,000 concurrent users
- Availability: 99.9% uptime

### 6. Technical Specifications
- Frontend: React 18+ with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- Infrastructure: AWS cloud services
- Payment: Stripe integration

### 7. Timeline and Budget
- Duration: 6 months (January 2024 - June 2024)
- Budget: $150,000 - $200,000

This BRD serves as the foundation for the technical implementation and project execution.`);
      
      setIsGenerating(false);
      toast({
        title: "BRD Generated",
        description: "Business Requirements Document has been created successfully",
      });
    }, 3000);
  };

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleEditModule = (moduleId: string) => {
    setEditingModule(moduleId);
  };

  const handleSaveModule = (moduleId: string, updatedModule: Partial<FunctionalModule>) => {
    setFunctionalModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, ...updatedModule } : module
    ));
    setEditingModule(null);
    toast({
      title: "Module Updated",
      description: "Functional module has been updated successfully",
    });
  };

  const handleDeleteModule = (moduleId: string) => {
    setFunctionalModules(prev => prev.filter(module => module.id !== moduleId));
    toast({
      title: "Module Deleted",
      description: "Functional module has been removed",
    });
  };

  const addNewModule = () => {
    const newModule: FunctionalModule = {
      id: Date.now().toString(),
      name: 'New Module',
      description: 'Description for the new module',
      requirements: ['New requirement'],
      priority: 'Medium',
      estimatedEffort: '1-2 weeks',
      dependencies: []
    };
    setFunctionalModules(prev => [...prev, newModule]);
    setEditingModule(newModule.id);
  };

  const handleConfirmAndSaveBRD = () => {
    if (!generatedBRD || !documentDetails) return;
    
    const newBRD = {
      id: Date.now().toString(),
      name: `BRD - ${documentDetails.extractedInfo.projectName}`,
      content: generatedBRD,
      version: 1,
      savedAt: new Date().toISOString(),
      projectName: documentDetails.extractedInfo.projectName
    };
    
    setSavedBRDs(prev => [...prev, newBRD]);
    setShowConfirmDialog(false);
    
    toast({
      title: "BRD Saved Successfully",
      description: `${newBRD.name} has been saved to the repository`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="bg-gradient-hero p-2 rounded-xl">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">BRD Agent</h1>
                  <p className="text-sm text-muted-foreground">Business Requirements Document Generator</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/repository")}
                className="gap-2"
              >
                <Archive className="h-4 w-4" />
                Repository
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Left Panel - Upload and Prompt */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* File Upload */}
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload RFP Document
                </CardTitle>
                <CardDescription>
                  Upload your Request for Proposal document to extract requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      {isProcessing ? (
                        <>
                          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                          <p className="text-sm font-medium">Processing document...</p>
                        </>
                      ) : uploadedFile ? (
                        <>
                          <CheckCircle className="h-12 w-12 text-success" />
                          <p className="text-sm font-medium text-success">Document uploaded successfully</p>
                          <p className="text-xs text-muted-foreground">{uploadedFile.name}</p>
                        </>
                      ) : (
                        <>
                          <FileText className="h-12 w-12 text-muted-foreground" />
                          <p className="text-sm font-medium">Drop your RFP document here or click to browse</p>
                          <p className="text-xs text-muted-foreground">Supports PDF, DOC, DOCX, TXT</p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Custom Prompt */}
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  BRD Generation Prompt
                </CardTitle>
                <CardDescription>
                  Customize the prompt to tailor the BRD generation to your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Generation Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                </div>
                <Button 
                  variant="hero" 
                  className="w-full gap-2"
                  onClick={handleGenerateBRD}
                  disabled={!documentDetails || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="animate-pulse">{thinkingStep || "Generating BRD..."}</span>
                    </>
                  ) : (
                    <>
                      <Bot className="h-4 w-4" />
                      Generate BRD
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Panel - Horizontal Sections */}
          {(documentDetails || generatedBRD) && (
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <CardTitle>Project Analysis & Documentation</CardTitle>
                <CardDescription>
                  Navigate through extracted information, generated BRD, and functional modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Horizontal Navigation Tabs */}
                <div className="flex gap-2 mb-6 border-b">
                  <Button
                    variant={activeSection === 'extracted' ? 'hero' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection('extracted')}
                    disabled={!documentDetails}
                    className="gap-2 rounded-b-none border-b-2"
                  >
                    <FileText className="h-4 w-4" />
                    Extracted Information
                  </Button>
                  <Button
                    variant={activeSection === 'brd' ? 'hero' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection('brd')}
                    disabled={!generatedBRD}
                    className="gap-2 rounded-b-none border-b-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Generated BRD
                  </Button>
                  <Button
                    variant={activeSection === 'modules' ? 'hero' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection('modules')}
                    disabled={!generatedBRD}
                    className="gap-2 rounded-b-none border-b-2"
                  >
                    <Package className="h-4 w-4" />
                    Functional Modules
                  </Button>
                </div>

                {/* Active Section Content */}
                <div className="min-h-[400px]">
                  {/* Document Details */}
                  {activeSection === 'extracted' && documentDetails && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <Label className="text-muted-foreground">File Name</Label>
                          <p className="font-medium">{documentDetails.fileName}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">File Size</Label>
                          <p className="font-medium">{documentDetails.fileSize}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Timeline</Label>
                          <p className="text-sm">{documentDetails.extractedInfo.timeline}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Budget</Label>
                          <p className="text-sm">{documentDetails.extractedInfo.budget}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-muted-foreground text-base font-medium">Project Name</Label>
                          <p className="font-semibold text-lg mt-1">{documentDetails.extractedInfo.projectName}</p>
                        </div>
                        
                        <div>
                          <Label className="text-muted-foreground text-base font-medium">Scope</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {documentDetails.extractedInfo.scope.map((item, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-muted-foreground text-base font-medium">Stakeholders</Label>
                          <div className="space-y-2 mt-2">
                            {documentDetails.extractedInfo.stakeholders.map((stakeholder, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <p className="text-sm">{stakeholder}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-muted-foreground text-base font-medium">Technical Requirements</Label>
                          <div className="space-y-2 mt-2">
                            {documentDetails.extractedInfo.technicalRequirements.map((req, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-accent rounded-full"></div>
                                <p className="text-sm">{req}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generated BRD */}
                  {activeSection === 'brd' && generatedBRD && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold">Business Requirements Document</h3>
                          <p className="text-sm text-muted-foreground">Review and confirm your BRD before saving</p>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-2">
                                <Maximize2 className="h-4 w-4" />
                                Full Screen
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <CheckCircle className="h-5 w-5 text-success" />
                                  Business Requirements Document - Full Screen View
                                </DialogTitle>
                              </DialogHeader>
                              <div className="flex-1 bg-muted/30 rounded-lg p-6 overflow-y-auto">
                                <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                                  {generatedBRD}
                                </pre>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                          <Button variant="hero" size="sm" onClick={() => setShowConfirmDialog(true)} className="gap-2">
                            <Save className="h-4 w-4" />
                            Confirm & Save to Repository
                          </Button>
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-6 max-h-[500px] overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                          {generatedBRD}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Functional Modules Section */}
                  {activeSection === 'modules' && generatedBRD && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold">Functional Modules</h3>
                          <p className="text-sm text-muted-foreground">Detailed breakdown of functional modules with requirements and dependencies</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={addNewModule} className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add Module
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {functionalModules.map((module) => (
                          <Collapsible 
                            key={module.id} 
                            open={expandedModules[module.id]} 
                            onOpenChange={() => toggleModuleExpansion(module.id)}
                          >
                            <div className="border border-border rounded-lg overflow-hidden">
                              <CollapsibleTrigger asChild>
                                <div className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      {expandedModules[module.id] ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                      <h4 className="font-medium text-sm">{module.name}</h4>
                                    </div>
                                    <Badge 
                                      variant={module.priority === 'High' ? 'destructive' : 
                                              module.priority === 'Medium' ? 'default' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {module.priority}
                                    </Badge>
                                  </div>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="p-4 space-y-4">
                                  {editingModule === module.id ? (
                                    <ModuleEditForm 
                                      module={module}
                                      onSave={(updatedModule) => handleSaveModule(module.id, updatedModule)}
                                      onCancel={() => setEditingModule(null)}
                                    />
                                  ) : (
                                    <ModuleView 
                                      module={module}
                                      onEdit={() => handleEditModule(module.id)}
                                      onDelete={() => handleDeleteModule(module.id)}
                                    />
                                  )}
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* BRD Confirmation Dialog */}
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5 text-primary" />
                  Confirm BRD Save
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to save this Business Requirements Document to the repository? 
                  This action will create a new version in your BRD repository.
                </p>
                {documentDetails && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm font-medium">{documentDetails.extractedInfo.projectName}</p>
                    <p className="text-xs text-muted-foreground">Version 1.0</p>
                  </div>
                )}
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="hero" onClick={handleConfirmAndSaveBRD} className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Confirm & Save
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default BRDAgent;