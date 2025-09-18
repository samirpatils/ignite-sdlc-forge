import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  FileText, 
  Code, 
  Plus, 
  FolderOpen, 
  Clock, 
  Users, 
  TrendingUp,
  ChevronRight,
  Settings,
  LogOut
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Draft" | "Completed";
  createdAt: string;
  documentsCount: number;
  teamMembers: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "E-Commerce Platform",
      description: "Complete online shopping solution with payment integration",
      status: "Active",
      createdAt: "2024-01-15",
      documentsCount: 12,
      teamMembers: 8
    },
    {
      id: "2", 
      name: "Mobile Banking App",
      description: "Secure mobile banking application with biometric authentication",
      status: "Draft",
      createdAt: "2024-01-10",
      documentsCount: 6,
      teamMembers: 5
    },
    {
      id: "3",
      name: "CRM Dashboard",
      description: "Customer relationship management system for sales teams",
      status: "Completed",
      createdAt: "2023-12-20",
      documentsCount: 24,
      teamMembers: 12
    }
  ]);

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "Active": return "bg-success/10 text-success border-success/20";
      case "Draft": return "bg-warning/10 text-warning border-warning/20";
      case "Completed": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-hero p-2 rounded-xl">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  SDLC Pro
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome to your Workspace
          </h2>
          <p className="text-muted-foreground">
            Manage your SDLC projects and leverage AI agents for requirements, documentation, and code generation.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card 
            className="bg-gradient-card shadow-soft border-0 cursor-pointer hover:shadow-medium transition-shadow"
            onClick={() => navigate("/projects")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold text-foreground">{projects.length}</p>
                </div>
                <FolderOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold text-foreground">
                    {projects.filter(p => p.status === "Active").length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                  <p className="text-2xl font-bold text-foreground">
                    {projects.reduce((sum, p) => sum + p.documentsCount, 0)}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold text-foreground">
                    {projects.reduce((sum, p) => sum + p.teamMembers, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Agents Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">AI Agents</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
              className="bg-gradient-card shadow-soft border-0 cursor-pointer hover:shadow-medium transition-shadow"
              onClick={() => navigate("/brd-agent")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle>BRD Agent</CardTitle>
                <CardDescription>
                  Generate Business Requirements Documents from RFP files with AI assistance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-card shadow-soft border-0 cursor-pointer hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="bg-accent/10 p-3 rounded-xl">
                    <FileText className="h-6 w-6 text-accent" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle>Technical Documentation Agent</CardTitle>
                <CardDescription>
                  Create comprehensive technical documentation and system architecture
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-card shadow-soft border-0 cursor-pointer hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="bg-success/10 p-3 rounded-xl">
                    <Code className="h-6 w-6 text-success" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle>Code Agent</CardTitle>
                <CardDescription>
                  Generate and review code based on requirements and technical specifications
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Projects Section */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Recent Projects</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="bg-gradient-card shadow-soft border-0 hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-foreground">{project.name}</h4>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{project.description}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {project.documentsCount} documents
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {project.teamMembers} members
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;