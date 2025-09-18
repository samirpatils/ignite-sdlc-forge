import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, X, Plus } from "lucide-react";

interface FunctionalModule {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  priority: 'High' | 'Medium' | 'Low';
  estimatedEffort: string;
  dependencies: string[];
}

interface ModuleEditFormProps {
  module: FunctionalModule;
  onSave: (updatedModule: Partial<FunctionalModule>) => void;
  onCancel: () => void;
}

export const ModuleEditForm = ({ module, onSave, onCancel }: ModuleEditFormProps) => {
  const [formData, setFormData] = useState({
    name: module.name,
    description: module.description,
    requirements: [...module.requirements],
    priority: module.priority,
    estimatedEffort: module.estimatedEffort,
    dependencies: [...module.dependencies]
  });

  const [newRequirement, setNewRequirement] = useState("");
  const [newDependency, setNewDependency] = useState("");

  const handleSave = () => {
    onSave(formData);
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addDependency = () => {
    if (newDependency.trim()) {
      setFormData(prev => ({
        ...prev,
        dependencies: [...prev.dependencies, newDependency.trim()]
      }));
      setNewDependency("");
    }
  };

  const removeDependency = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Module Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value: 'High' | 'Medium' | 'Low') => 
            setFormData(prev => ({ ...prev, priority: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimatedEffort">Estimated Effort</Label>
        <Input
          id="estimatedEffort"
          value={formData.estimatedEffort}
          onChange={(e) => setFormData(prev => ({ ...prev, estimatedEffort: e.target.value }))}
          placeholder="e.g., 2-3 weeks"
        />
      </div>

      <div className="space-y-2">
        <Label>Requirements</Label>
        <div className="flex flex-wrap gap-1 mb-2">
          {formData.requirements.map((req, index) => (
            <Badge key={index} variant="outline" className="text-xs flex items-center gap-1">
              {req}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeRequirement(index)}
              />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            placeholder="Add new requirement"
            onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
          />
          <Button type="button" variant="outline" size="sm" onClick={addRequirement}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Dependencies</Label>
        <div className="flex flex-wrap gap-1 mb-2">
          {formData.dependencies.map((dep, index) => (
            <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
              {dep}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeDependency(index)}
              />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newDependency}
            onChange={(e) => setNewDependency(e.target.value)}
            placeholder="Add new dependency"
            onKeyPress={(e) => e.key === 'Enter' && addDependency()}
          />
          <Button type="button" variant="outline" size="sm" onClick={addDependency}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};