import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Search, 
  Eye, 
  Edit, 
  Plus,
  Clock,
  FileText,
  Users,
  Filter,
  X,
  Save
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
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

  const getCardColor = (status: Project["status"]) => {
    switch (status) {
      case "Active": return "border-l-4 border-l-success bg-gradient-to-r from-success/5 to-transparent";
      case "Draft": return "border-l-4 border-l-warning bg-gradient-to-r from-warning/5 to-transparent";
      case "Completed": return "border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent";
      default: return "border-l-4 border-l-muted";
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (project: Project) => {
    setSelectedProject(project);
    setIsDetailView(true);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would save the changes to your database/state management
    console.log("Saving project:", selectedProject);
    setIsEditing(false);
  };

  const handleCloseDetail = () => {
    setIsDetailView(false);
    setSelectedProject(null);
    setIsEditing(false);
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
            <Card key={project.id} className={`bg-gradient-card shadow-soft border-0 ${getCardColor(project.status)}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                    
                    {/* Minimal Project Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {project.documentsCount} docs
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {project.teamMembers} members
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(project)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
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

        {/* Project Detail Dialog */}
        <Dialog open={isDetailView} onOpenChange={handleCloseDetail}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-3">
                  {selectedProject?.name}
                  <Badge className={getStatusColor(selectedProject?.status || "Draft")}>
                    {selectedProject?.status}
                  </Badge>
                </DialogTitle>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={handleEdit} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </DialogHeader>
            
            {selectedProject && (
              <div className="space-y-6 mt-4">
                {/* Project Description */}
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  {isEditing ? (
                    <textarea 
                      className="w-full p-3 border rounded-md resize-none"
                      rows={3}
                      value={selectedProject.description}
                      onChange={(e) => setSelectedProject({...selectedProject, description: e.target.value})}
                    />
                  ) : (
                    <p className="text-muted-foreground">{selectedProject.description}</p>
                  )}
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/10 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{selectedProject.documentsCount}</div>
                    <div className="text-sm text-muted-foreground">Documents</div>
                  </div>
                  <div className="text-center p-4 bg-muted/10 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{selectedProject.teamMembers}</div>
                    <div className="text-sm text-muted-foreground">Team Members</div>
                  </div>
                  <div className="text-center p-4 bg-muted/10 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {new Date(selectedProject.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Created</div>
                  </div>
                </div>

                {/* Technology Stacks */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Technology Stack</h4>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2 text-primary">Frontend Technologies</h5>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProject.frontend.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {tech.name} {tech.version}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-2 text-accent">Middleware Technologies</h5>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProject.middleware.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {tech.name} {tech.version}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-2 text-success">Backend Technologies</h5>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProject.backend.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {tech.name} {tech.version}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Projects;