import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Check, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockTasks = [
  { id: "1", title: "Implement authentication system", status: "in_progress", priority: "high", tags: ["backend", "security"] },
  { id: "2", title: "Design landing page mockup", status: "todo", priority: "medium", tags: ["design", "frontend"] },
  { id: "3", title: "Write API documentation", status: "done", priority: "low", tags: ["docs"] },
  { id: "4", title: "Fix mobile responsive issues", status: "todo", priority: "high", tags: ["frontend", "bug"] },
  { id: "5", title: "Set up CI/CD pipeline", status: "in_progress", priority: "medium", tags: ["devops"] },
];

export default function WorkspaceTasksPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        title: newTaskTitle,
        status: "todo",
        priority: "medium",
        tags: []
      }]);
      setNewTaskTitle("");
    }
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const statusOrder = ["todo", "in_progress", "done"];
        const currentIndex = statusOrder.indexOf(task.status);
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
        return { ...task, status: nextStatus };
      }
      return task;
    }));
  };

  const getTasksByStatus = (status: string) => tasks.filter(t => t.status === status);
  
  const getPriorityIcon = (priority: string) => {
    if (priority === "high") return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (priority === "medium") return <Clock className="w-4 h-4 text-yellow-500" />;
    return <Check className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Task Board</h1>
          <p className="text-muted-foreground mb-6">
            Manage your tasks and track progress
          </p>

          <div className="flex gap-2 mb-8">
            <Input
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
            />
            <Button onClick={addTask} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* To Do Column */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-500" />
                  To Do ({getTasksByStatus("todo").length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getTasksByStatus("todo").map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => toggleTaskStatus(task.id)}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2 mb-2">
                        {getPriorityIcon(task.priority)}
                        <h4 className="font-medium flex-1">{task.title}</h4>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* In Progress Column */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  In Progress ({getTasksByStatus("in_progress").length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getTasksByStatus("in_progress").map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
                    onClick={() => toggleTaskStatus(task.id)}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2 mb-2">
                        {getPriorityIcon(task.priority)}
                        <h4 className="font-medium flex-1">{task.title}</h4>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Done Column */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  Done ({getTasksByStatus("done").length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getTasksByStatus("done").map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow bg-muted/50"
                    onClick={() => toggleTaskStatus(task.id)}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <h4 className="font-medium flex-1 line-through text-muted-foreground">{task.title}</h4>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
