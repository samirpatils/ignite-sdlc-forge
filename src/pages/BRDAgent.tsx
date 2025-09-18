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
  ChevronUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    
    // Simulate BRD generation
    setTimeout(() => {
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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
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
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload and Prompt */}
          <div className="space-y-6">
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
                      Generating BRD...
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

          {/* Right Panel - Document Details and Generated BRD */}
          <div className="space-y-6">
            {/* Document Details */}
            {documentDetails && (
              <Card className="bg-gradient-card shadow-soft border-0">
                <Collapsible open={isExtractedInfoOpen} onOpenChange={setIsExtractedInfoOpen}>
                  <CardHeader>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between w-full cursor-pointer group">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Extracted Information
                          </CardTitle>
                          <CardDescription>
                            Key details extracted from your RFP document
                          </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          {isExtractedInfoOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-4 pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground">File Name</Label>
                      <p className="font-medium">{documentDetails.fileName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">File Size</Label>
                      <p className="font-medium">{documentDetails.fileSize}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-muted-foreground">Project Name</Label>
                      <p className="font-medium">{documentDetails.extractedInfo.projectName}</p>
                    </div>
                    
                    <div>
                      <Label className="text-muted-foreground">Scope</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {documentDetails.extractedInfo.scope.map((item, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-muted-foreground">Stakeholders</Label>
                      <div className="space-y-1 mt-1">
                        {documentDetails.extractedInfo.stakeholders.map((stakeholder, index) => (
                          <p key={index} className="text-sm">{stakeholder}</p>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Timeline</Label>
                        <p className="text-sm">{documentDetails.extractedInfo.timeline}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Budget</Label>
                        <p className="text-sm">{documentDetails.extractedInfo.budget}</p>
                      </div>
                      </div>
                    </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            )}

            {/* Generated BRD */}
            {generatedBRD && (
              <Card className="bg-gradient-card shadow-soft border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        Generated BRD
                      </CardTitle>
                      <CardDescription>
                        Review and save your Business Requirements Document
                      </CardDescription>
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
                      <Button variant="hero" size="sm" className="gap-2">
                        <Save className="h-4 w-4" />
                        Save to Repository
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {generatedBRD}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BRDAgent;