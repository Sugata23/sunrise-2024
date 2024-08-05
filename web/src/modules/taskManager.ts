import Task from "@/model/Task";
import { initialTasks } from "@/utils/TaskList";

let tasks: Task[] = [];

export function initializeTasks() {
    tasks = initialTasks.map((task, index) => ({
        ...task,
        completed: false,
        inProgress: index < 2
    }));
}

export function getTodoTasks(): Task[] {
    return tasks.filter(task => !task.completed && !task.inProgress);
}

export function getInProgressTasks(): Task[] {
    return tasks.filter(task => task.inProgress && !task.completed);
}

export function getCompletedTasks(): Task[] {
    return tasks.filter(task => task.completed);
}

export function getAllTasks(): Task[] {
    return tasks;
}

export function completeTask(taskId: number): void {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = true;
        tasks[taskIndex].inProgress = false;
        const nextTaskIndex = tasks.findIndex(t => !t.inProgress && !t.completed);
        if (nextTaskIndex !== -1) {
            tasks[nextTaskIndex].inProgress = true;
        }
    }
}

export function createTask(title: string, description: string, persona: string, group: number): void {
    const newId = Math.max(...tasks.map(t => t.id)) + 1;
    tasks.push(new Task(newId, title, description, persona, group));
}

export function updateTask(taskId: number, updatedTask: Partial<Omit<Task, 'id'>>): void {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
    }
}

export function deleteTask(taskId: number): void {
    tasks = tasks.filter(t => t.id !== taskId);
}
