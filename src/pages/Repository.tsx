import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Archive, 
  FileText, 
  CheckCircle, 
  Calendar, 
  Hash, 
  Download, 
  Edit3,
  Eye,
  Save,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RFPDocument {
  id: string;
  name: string;
  fileName: string;
  uploadedAt: string;
  size: string;
  projectName: string;
  content?: string;
}

interface BRDDocument {
  id: string;
  name: string;
  version: number;
  savedAt: string;
  projectName: string;
  status: 'Draft' | 'Final';
  content?: string;
}

const Repository = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [repositoryRFPs] = useState<RFPDocument[]>([
    {
      id: '1',
      name: 'E-Commerce Platform RFP',
      fileName: 'ecommerce-rfp-v2.pdf',
      uploadedAt: '2024-01-15T10:30:00.000Z',
      size: '2.4 MB',
      projectName: 'E-Commerce Platform Modernization',
      content: `# E-Commerce Platform RFP

## Project Overview
This RFP outlines the requirements for modernizing our existing e-commerce platform to improve user experience, increase conversion rates, and support business growth.

## Key Requirements
- Modern React-based frontend
- Responsive design for mobile optimization
- Advanced payment gateway integration
- Enhanced security and performance
- Admin dashboard for management

## Technical Specifications
- Frontend: React 18+ with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- Infrastructure: AWS cloud services
- Payment: Stripe integration

## Timeline
6 months (January 2024 - June 2024)

## Budget Range
$150,000 - $200,000`
    },
    {
      id: '2', 
      name: 'CRM System RFP',
      fileName: 'crm-requirements.pdf',
      uploadedAt: '2024-01-10T14:15:00.000Z',
      size: '1.8 MB',
      projectName: 'Customer Relationship Management System',
      content: `# CRM System RFP

## Objective
Implement a comprehensive Customer Relationship Management system to streamline sales processes and improve customer interactions.

## Core Features Required
- Contact and lead management  
- Sales pipeline tracking
- Customer communication history
- Reporting and analytics
- Integration with existing tools

## Technical Requirements
- Cloud-based solution
- Mobile accessibility
- API integrations
- Data security compliance
- Scalable architecture`
    },
    {
      id: '3',
      name: 'Mobile App RFP',
      fileName: 'mobile-app-specs.docx',
      uploadedAt: '2024-01-05T09:20:00.000Z',
      size: '3.1 MB',
      projectName: 'Mobile Banking Application',
      content: `# Mobile Banking Application RFP

## Purpose
Develop a secure mobile banking application for iOS and Android platforms.

## Key Features
- Account balance and transaction history
- Fund transfers and bill payments
- Mobile check deposit
- ATM/branch locator
- Biometric authentication

## Security Requirements
- End-to-end encryption
- Multi-factor authentication
- Compliance with banking regulations
- Fraud detection mechanisms`
    }
  ]);
  
  const [repositoryBRDs, setRepositoryBRDs] = useState<BRDDocument[]>([
    {
      id: '1',
      name: 'BRD - E-Commerce Platform Modernization',
      version: 2,
      savedAt: '2024-01-16T11:45:00.000Z',
      projectName: 'E-Commerce Platform Modernization',
      status: 'Final',
      content: `# Business Requirements Document
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

This BRD serves as the foundation for the technical implementation and project execution.`
    },
    {
      id: '2',
      name: 'BRD - CRM System Implementation',
      version: 1,
      savedAt: '2024-01-12T16:30:00.000Z',
      projectName: 'Customer Relationship Management System',
      status: 'Draft',
      content: `# Business Requirements Document
## CRM System Implementation

### 1. Executive Summary
Implementation of a comprehensive Customer Relationship Management system to streamline sales processes and improve customer interactions.

### 2. Functional Requirements
- Contact and lead management
- Sales pipeline tracking
- Customer communication history
- Reporting and analytics
- Integration capabilities

### 3. Technical Architecture
- Cloud-based deployment
- API-first approach
- Mobile responsive design
- Third-party integrations

### 4. Success Criteria
- 50% improvement in lead conversion
- 30% reduction in customer response time
- 100% user adoption within 3 months`
    },
    {
      id: '3',
      name: 'BRD - Mobile Banking App',
      version: 3,
      savedAt: '2024-01-08T13:20:00.000Z',
      projectName: 'Mobile Banking Application',
      status: 'Final',
      content: `# Business Requirements Document
## Mobile Banking Application

### 1. Executive Summary
Development of a secure mobile banking application for iOS and Android platforms to enhance customer banking experience.

### 2. Core Features
- Account management
- Transaction processing
- Security features
- Customer support integration

### 3. Security Requirements
- Biometric authentication
- End-to-end encryption
- Fraud detection
- Regulatory compliance

### 4. Performance Standards
- App load time < 2 seconds
- 99.95% uptime
- Support for 50,000+ concurrent users`
    }
  ]);

  const [viewingDocument, setViewingDocument] = useState<{ type: 'rfp' | 'brd'; document: RFPDocument | BRDDocument } | null>(null);
  const [editingDocument, setEditingDocument] = useState<{ type: 'brd'; document: BRDDocument } | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editName, setEditName] = useState('');

  const handleViewDocument = (type: 'rfp' | 'brd', document: RFPDocument | BRDDocument) => {
    setViewingDocument({ type, document });
  };

  const handleEditBRD = (document: BRDDocument) => {
    setEditingDocument({ type: 'brd', document });
    setEditContent(document.content || '');
    setEditName(document.name);
  };

  const handleSaveEdit = () => {
    if (!editingDocument) return;

    setRepositoryBRDs(prev => prev.map(brd => 
      brd.id === editingDocument.document.id 
        ? { 
            ...brd, 
            content: editContent, 
            name: editName,
            version: brd.version + 1,
            savedAt: new Date().toISOString()
          }
        : brd
    ));

    setEditingDocument(null);
    toast({
      title: "BRD Updated",
      description: "Document has been saved successfully with a new version",
    });
  };

  const handleDownload = (doc: RFPDocument | BRDDocument, type: 'rfp' | 'brd') => {
    const content = doc.content || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${doc.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: `${doc.name} is being downloaded`,
    });
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
              onClick={() => navigate("/brd-agent")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to BRD Agent
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-3">
              <div className="bg-gradient-hero p-2 rounded-xl">
                <Archive className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Document Repository</h1>
                <p className="text-sm text-muted-foreground">Manage RFP Documents and Generated BRDs</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* RFP Documents Section */}
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                RFP Documents
              </CardTitle>
              <CardDescription>
                Submitted Request for Proposal documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {repositoryRFPs.map((rfp) => (
                  <Card key={rfp.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{rfp.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{rfp.fileName}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(rfp.uploadedAt).toLocaleDateString()}
                          </span>
                          <span>{rfp.size}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleDownload(rfp, 'rfp')}
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleViewDocument('rfp', rfp)}
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generated BRDs Section */}
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Generated BRDs
              </CardTitle>
              <CardDescription>
                Business Requirements Documents with version history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {repositoryBRDs.map((brd) => (
                  <Card key={brd.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{brd.name}</h4>
                          <Badge 
                            variant={brd.status === 'Final' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {brd.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{brd.projectName}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(brd.savedAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            Version {brd.version}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleDownload(brd, 'brd')}
                        >
                          <Download className="h-3 w-3" />
                          Export
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleViewDocument('brd', brd)}
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleEditBRD(brd)}
                        >
                          <Edit3 className="h-3 w-3" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* View Document Dialog */}
      <Dialog open={!!viewingDocument} onOpenChange={() => setViewingDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewingDocument?.type === 'rfp' ? <FileText className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
              {viewingDocument?.document.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                {viewingDocument?.document.content || 'No content available'}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit BRD Dialog */}
      <Dialog open={!!editingDocument} onOpenChange={() => setEditingDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Edit BRD
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Document Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={20}
                className="resize-none font-mono text-sm"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setEditingDocument(null)}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button 
                variant="hero" 
                onClick={handleSaveEdit}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Repository;