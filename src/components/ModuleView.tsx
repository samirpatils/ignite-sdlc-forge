import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Edit3, Trash2 } from "lucide-react";

interface FunctionalModule {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  priority: 'High' | 'Medium' | 'Low';
  estimatedEffort: string;
  dependencies: string[];
}

interface ModuleViewProps {
  module: FunctionalModule;
  onEdit: () => void;
  onDelete: () => void;
}

export const ModuleView = ({ module, onEdit, onDelete }: ModuleViewProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Label className="text-muted-foreground">Description</Label>
          <p className="text-sm">{module.description}</p>
        </div>
        <div className="flex gap-2 ml-4">
          <Button variant="ghost" size="sm" onClick={onEdit} className="gap-2">
            <Edit3 className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="gap-2 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-muted-foreground">Requirements</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {module.requirements.map((req, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {req}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-muted-foreground">Dependencies</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {module.dependencies.length > 0 ? (
              module.dependencies.map((dep, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {dep}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No dependencies</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <Label className="text-muted-foreground">Priority</Label>
          <p className="font-medium">{module.priority}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Estimated Effort</Label>
          <p className="font-medium">{module.estimatedEffort}</p>
        </div>
      </div>
    </div>
  );
};