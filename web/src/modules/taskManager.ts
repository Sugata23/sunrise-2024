import Task from "@/model/Task";
import { initialTasks } from "@/utils/TaskList";

let tasks: Task[] = [];

export function initializeTasks() {
    tasks = initialTasks.map(task => ({
        ...task,
        completed: false,
        inProgress: false
    }));

    // Initialize tasks from the first group to be in progress
    const firstGroupTasks = tasks.filter(t => t.group === 1);
    firstGroupTasks.forEach(task => {
        task.inProgress = true;
    });
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

        // Check if all tasks from the current group are completed
        const currentGroup = tasks[taskIndex].group;
        const currentGroupTasks = tasks.filter(t => t.group === currentGroup);
        const allCurrentGroupCompleted = currentGroupTasks.every(t => t.completed);

        // Move the first task from the next group to in progress if all current group tasks are completed
        if (allCurrentGroupCompleted) {
            const nextGroupTasks = tasks.filter(t => t.group === currentGroup + 1 && !t.completed);
            nextGroupTasks.forEach(task => {
                task.inProgress = true;
            });
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

export function moveTaskToInProgress(taskId: number): void {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const groupTasks = tasks.filter(t => t.group === task.group);
        const previousGroupTasks = tasks.filter(t => t.group === task.group - 1);
        
        const allPreviousGroupCompleted = previousGroupTasks.every(t => t.completed);
        const allCurrentGroupCompleted = groupTasks.every(t => t.completed || t.inProgress);

        if (allPreviousGroupCompleted && !allCurrentGroupCompleted) {
            task.inProgress = true;
        }
    }
}
