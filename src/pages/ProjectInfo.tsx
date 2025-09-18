import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Bot, 
  FileText, 
  Code, 
  Users, 
  Calendar,
  Clock,
  Settings,
  Target,
  Database,
  Layers,
  Globe,
  Server,
  ChevronRight
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Draft" | "Completed";
  createdAt: string;
  documentsCount: number;
  teamMembers: number;
  frontend: { name: string; version: string; }[];
  middleware: { name: string; version: string; }[];
  backend: { name: string; version: string; }[];
  objectives: string[];
  timeline: string;
  budget: string;
}

const ProjectInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  // Mock project data - would come from your database/API
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: "1",
        name: "E-Commerce Platform",
        description: "Complete online shopping solution with payment integration, user management, and advanced analytics dashboard",
        status: "Active",
        createdAt: "2024-01-15",
        documentsCount: 12,
        teamMembers: 8,
        frontend: [
          { name: "React", version: "18.2.0" }, 
          { name: "TypeScript", version: "5.0.0" },
          { name: "Tailwind CSS", version: "3.3.0" }
        ],
        middleware: [
          { name: "Express.js", version: "4.18.0" },
          { name: "Redis", version: "7.0.0" }
        ],
        backend: [
          { name: "Node.js", version: "18.16.0" }, 
          { name: "PostgreSQL", version: "15.3" },
          { name: "AWS S3", version: "latest" }
        ],
        objectives: [
          "Increase online sales by 40%",
          "Improve user experience and engagement",
          "Implement secure payment processing",
          "Build scalable architecture for future growth"
        ],
        timeline: "6 months",
        budget: "$150,000 - $200,000"
      },
      {
        id: "2",
        name: "Mobile Banking App",
        description: "Secure mobile banking application with biometric authentication, real-time transactions, and comprehensive financial management tools",
        status: "Draft",
        createdAt: "2024-01-10",
        documentsCount: 6,
        teamMembers: 5,
        frontend: [
          { name: "React Native", version: "0.72.0" },
          { name: "TypeScript", version: "5.0.0" }
        ],
        middleware: [
          { name: "GraphQL", version: "16.6.0" },
          { name: "Apollo Client", version: "3.8.0" }
        ],
        backend: [
          { name: "Python", version: "3.11" }, 
          { name: "Django", version: "4.2.0" },
          { name: "PostgreSQL", version: "15.3" }
        ],
        objectives: [
          "Provide secure mobile banking experience",
          "Implement biometric authentication",
          "Enable real-time transaction processing",
          "Ensure regulatory compliance"
        ],
        timeline: "8 months",
        budget: "$200,000 - $300,000"
      },
      {
        id: "3",
        name: "CRM Dashboard",
        description: "Customer relationship management system for sales teams with advanced analytics, lead tracking, and automated workflows",
        status: "Completed",
        createdAt: "2023-12-20",
        documentsCount: 24,
        teamMembers: 12,
        frontend: [
          { name: "Vue.js", version: "3.3.0" }, 
          { name: "Nuxt.js", version: "3.6.0" },
          { name: "Vuetify", version: "3.3.0" }
        ],
        middleware: [
          { name: "Redis", version: "7.0.0" },
          { name: "Nginx", version: "1.21.0" }
        ],
        backend: [
          { name: "Java", version: "17" }, 
          { name: "Spring Boot", version: "3.1.0" },
          { name: "MySQL", version: "8.0" }
        ],
        objectives: [
          "Streamline sales processes",
          "Improve customer relationship management",
          "Provide comprehensive analytics",
          "Automate routine tasks"
        ],
        timeline: "12 months",
        budget: "$300,000 - $450,000"
      }
    ];

    const foundProject = mockProjects.find(p => p.id === id);
    setProject(foundProject || null);
  }, [id]);

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "Active": return "bg-success/10 text-success border-success/20";
      case "Draft": return "bg-warning/10 text-warning border-warning/20";
      case "Completed": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusGradient = (status: Project["status"]) => {
    switch (status) {
      case "Active": return "border-l-4 border-l-success bg-gradient-to-r from-success/5 to-transparent";
      case "Draft": return "border-l-4 border-l-warning bg-gradient-to-r from-warning/5 to-transparent";
      case "Completed": return "border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent";
      default: return "border-l-4 border-l-muted";
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <h2 className="text-lg font-semibold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested project could not be found.</p>
            <Button onClick={() => navigate("/projects")}>
              Back to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                onClick={() => navigate("/projects")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-foreground">{project.name}</h1>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="hero"
                onClick={() => navigate("/brd-agent", { state: { projectId: project.id, projectName: project.name } })}
                className="gap-2"
              >
                <Bot className="h-4 w-4" />
                BRD Agent
              </Button>
              <Button 
                variant="outline"
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Tech Docs Agent
              </Button>
              <Button 
                variant="outline"
                className="gap-2"
              >
                <Code className="h-4 w-4" />
                Code Agent
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Project Overview */}
          <Card className={`bg-gradient-card shadow-soft border-0 ${getStatusGradient(project.status)}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="text-center p-4 bg-muted/10 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{project.documentsCount}</div>
                  <div className="text-sm text-muted-foreground">Documents</div>
                </div>
                <div className="text-center p-4 bg-muted/10 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{project.teamMembers}</div>
                  <div className="text-sm text-muted-foreground">Team Members</div>
                </div>
                <div className="text-center p-4 bg-muted/10 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{project.timeline}</div>
                  <div className="text-sm text-muted-foreground">Timeline</div>
                </div>
                <div className="text-center p-4 bg-muted/10 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{new Date(project.createdAt).toLocaleDateString()}</div>
                  <div className="text-sm text-muted-foreground">Created</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Objectives */}
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Project Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.objectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/5 rounded-lg">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-foreground flex-1">{objective}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technology Stack */}
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Frontend */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-4 w-4 text-primary" />
                  <h4 className="font-medium text-primary">Frontend Technologies</h4>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {project.frontend.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tech.name} {tech.version}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Middleware */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Server className="h-4 w-4 text-accent" />
                  <h4 className="font-medium text-accent">Middleware Technologies</h4>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {project.middleware.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tech.name} {tech.version}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Database className="h-4 w-4 text-success" />
                  <h4 className="font-medium text-success">Backend Technologies</h4>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {project.backend.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tech.name} {tech.version}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Timeline & Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline & Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/5 rounded-lg">
                    <span className="text-sm text-muted-foreground">Timeline</span>
                    <span className="font-medium">{project.timeline}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/5 rounded-lg">
                    <span className="text-sm text-muted-foreground">Budget</span>
                    <span className="font-medium">{project.budget}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Agents */}
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Agents
                </CardTitle>
                <CardDescription>
                  Select an AI agent to assist with your project requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between gap-2 h-12"
                    onClick={() => navigate("/brd-agent", { state: { projectId: project.id, projectName: project.name } })}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">BRD Agent</div>
                        <div className="text-xs text-muted-foreground">Generate Business Requirements</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between gap-2 h-12">
                    <div className="flex items-center gap-3">
                      <div className="bg-accent/10 p-2 rounded-lg">
                        <FileText className="h-4 w-4 text-accent" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Technical Documentation Agent</div>
                        <div className="text-xs text-muted-foreground">Create technical specifications</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between gap-2 h-12">
                    <div className="flex items-center gap-3">
                      <div className="bg-success/10 p-2 rounded-lg">
                        <Code className="h-4 w-4 text-success" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Code Agent</div>
                        <div className="text-xs text-muted-foreground">Generate and review code</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;