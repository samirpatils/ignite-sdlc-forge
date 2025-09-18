import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, X, Save } from "lucide-react";

interface TechStack {
  name: string;
  version: string;
}

interface ProjectData {
  name: string;
  description: string;
  frontend: TechStack[];
  middleware: TechStack[];
  backend: TechStack[];
  additionalDetails: string;
}

const NewProject = () => {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    description: "",
    frontend: [{ name: "", version: "" }],
    middleware: [{ name: "", version: "" }],
    backend: [{ name: "", version: "" }],
    additionalDetails: ""
  });

  const handleInputChange = (field: keyof ProjectData, value: string) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTechStackChange = (
    category: 'frontend' | 'middleware' | 'backend',
    index: number,
    field: 'name' | 'version',
    value: string
  ) => {
    setProjectData(prev => ({
      ...prev,
      [category]: prev[category].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addTechStack = (category: 'frontend' | 'middleware' | 'backend') => {
    setProjectData(prev => ({
      ...prev,
      [category]: [...prev[category], { name: "", version: "" }]
    }));
  };

  const removeTechStack = (category: 'frontend' | 'middleware' | 'backend', index: number) => {
    setProjectData(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    // Here you would typically save to a database or state management
    console.log("Saving project:", projectData);
    navigate("/projects");
  };

  const renderTechStackSection = (
    title: string,
    category: 'frontend' | 'middleware' | 'backend'
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          Add technologies and their versions for {title.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {projectData[category].map((tech, index) => (
          <div key={index} className="flex gap-3 items-end">
            <div className="flex-1">
              <Label htmlFor={`${category}-name-${index}`}>Technology Name</Label>
              <Input
                id={`${category}-name-${index}`}
                placeholder="e.g., React, Node.js, MySQL"
                value={tech.name}
                onChange={(e) => handleTechStackChange(category, index, 'name', e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor={`${category}-version-${index}`}>Version</Label>
              <Input
                id={`${category}-version-${index}`}
                placeholder="e.g., 18.2.0, v16.20.0"
                value={tech.version}
                onChange={(e) => handleTechStackChange(category, index, 'version', e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeTechStack(category, index)}
              disabled={projectData[category].length === 1}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addTechStack(category)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Technology
        </Button>
      </CardContent>
    </Card>
  );

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
              <h1 className="text-xl font-bold text-foreground">New Project</h1>
            </div>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Project
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>
                Basic details about your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="Enter project name"
                  value={projectData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="project-description">Project Description</Label>
                <Textarea
                  id="project-description"
                  placeholder="Provide a detailed description of your project..."
                  rows={4}
                  value={projectData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Technology Stacks */}
          {renderTechStackSection("Frontend Technology Stack", "frontend")}
          {renderTechStackSection("Middleware Technology Stack", "middleware")}
          {renderTechStackSection("Backend Technology Stack", "backend")}

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>
                Any additional information, requirements, or notes for this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any additional details, special requirements, deployment notes, etc..."
                rows={6}
                value={projectData.additionalDetails}
                onChange={(e) => handleInputChange('additionalDetails', e.target.value)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewProject;