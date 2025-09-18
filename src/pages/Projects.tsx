import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Search, 
  Eye, 
  Edit, 
  Plus,
  Clock,
  FileText,
  Users,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}

const Projects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Mock data - would come from your database/state management
  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "E-Commerce Platform",
      description: "Complete online shopping solution with payment integration",
      status: "Active",
      createdAt: "2024-01-15",
      documentsCount: 12,
      teamMembers: 8,
      frontend: [{ name: "React", version: "18.2.0" }, { name: "TypeScript", version: "5.0.0" }],
      middleware: [{ name: "Express.js", version: "4.18.0" }],
      backend: [{ name: "Node.js", version: "18.16.0" }, { name: "PostgreSQL", version: "15.3" }]
    },
    {
      id: "2",
      name: "Mobile Banking App", 
      description: "Secure mobile banking application with biometric authentication",
      status: "Draft",
      createdAt: "2024-01-10",
      documentsCount: 6,
      teamMembers: 5,
      frontend: [{ name: "React Native", version: "0.72.0" }],
      middleware: [{ name: "GraphQL", version: "16.6.0" }],
      backend: [{ name: "Python", version: "3.11" }, { name: "Django", version: "4.2.0" }]
    },
    {
      id: "3",
      name: "CRM Dashboard",
      description: "Customer relationship management system for sales teams",
      status: "Completed",
      createdAt: "2023-12-20",
      documentsCount: 24,
      teamMembers: 12,
      frontend: [{ name: "Vue.js", version: "3.3.0" }, { name: "Nuxt.js", version: "3.6.0" }],
      middleware: [{ name: "Redis", version: "7.0.0" }],
      backend: [{ name: "Java", version: "17" }, { name: "Spring Boot", version: "3.1.0" }]
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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (projectId: string) => {
    console.log("Viewing project:", projectId);
    // Navigate to project details view
  };

  const handleEdit = (projectId: string) => {
    console.log("Editing project:", projectId);
    // Navigate to project edit page
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
                onClick={() => navigate("/dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-xl font-bold text-foreground">All Projects</h1>
            </div>
            <Button 
              onClick={() => navigate("/new-project")}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="bg-gradient-card shadow-soft border-0">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{project.name}</h3>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    
                    {/* Project Stats */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
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

                    {/* Technology Stacks */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-foreground">Frontend:</span>
                        <div className="flex gap-1 flex-wrap">
                          {project.frontend.map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech.name} {tech.version}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-foreground">Middleware:</span>
                        <div className="flex gap-1 flex-wrap">
                          {project.middleware.map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech.name} {tech.version}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-foreground">Backend:</span>
                        <div className="flex gap-1 flex-wrap">
                          {project.backend.map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech.name} {tech.version}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(project.id)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(project.id)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No projects found matching your criteria.</p>
              <Button onClick={() => navigate("/new-project")} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Projects;