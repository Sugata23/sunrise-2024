import {
  initializeTasks,
  getTodoTasks,
  getInProgressTasks,
  completeTask,
  getCompletedTasks,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
} from "@/modules/taskManager";

describe('Task Manager', () => {
  beforeEach(() => {
      initializeTasks();
  });

  test('should create initial tasks on initialization', () => {
      const inProgressTasks = getInProgressTasks();
      expect(inProgressTasks.length).toBe(2);
  });

  test('should not have Group 2 tasks in progress before completing Group 1', () => {
      completeTask(1); // ID of 'Initial Setup'
      const inProgressTasks = getInProgressTasks();
      expect(inProgressTasks).not.toContainEqual(
          expect.objectContaining({ title: 'Basic Git' })
      );
  });

  test('should mark task as completed', () => {
      completeTask(2); // ID of 'Basic Introduction'
      const completedTasks = getCompletedTasks();
      expect(completedTasks).toContainEqual(
          expect.objectContaining({ title: 'Basic Introduction' })
      );
  });

  test('should fetch todo tasks', () => {
      const todoTasks = getTodoTasks();
      expect(todoTasks).toEqual(
          expect.arrayContaining([
              expect.objectContaining({ title: 'JavaScript Basics' }),
              expect.objectContaining({ title: 'JavaScript Project' }),
              expect.objectContaining({ title: 'API Introduction' }),
              expect.objectContaining({ title: 'API Consumption' }),
              expect.objectContaining({ title: 'Final Project' }),
              expect.objectContaining({ title: 'Project Presentation' })
          ])
      );
  });

  test('should fetch in progress tasks', () => {
      const inProgressTasks = getInProgressTasks();
      expect(inProgressTasks).toEqual(
          expect.arrayContaining([
              expect.objectContaining({ title: 'Initial Setup' }),
              expect.objectContaining({ title: 'Basic Introduction' })
          ])
      );
  });

  test('should fetch all tasks', () => {
      const allTasks = getAllTasks();
      expect(allTasks).toEqual(
          expect.arrayContaining([
              expect.objectContaining({ title: 'Initial Setup' }),
              expect.objectContaining({ title: 'Basic Introduction' }),
              expect.objectContaining({ title: 'Basic Git' }),
              expect.objectContaining({ title: 'Git Collaboration' }),
              expect.objectContaining({ title: 'JavaScript Basics' }),
              expect.objectContaining({ title: 'JavaScript Project' }),
              expect.objectContaining({ title: 'API Introduction' }),
              expect.objectContaining({ title: 'API Consumption' }),
              expect.objectContaining({ title: 'Final Project' }),
              expect.objectContaining({ title: 'Project Presentation' })
          ])
      );
  });

  test('should fetch completed tasks', () => {
      completeTask(2); // ID of 'Basic Introduction'
      const completedTasks = getCompletedTasks();
      expect(completedTasks).toEqual(
          expect.arrayContaining([
              expect.objectContaining({ title: 'Basic Introduction' })
          ])
      );
  });

  test('should create a new task', () => {
      createTask('New Task', 'New task description', 'Intern', 1);
      const todoTasks = getTodoTasks();
      expect(todoTasks).toContainEqual(
          expect.objectContaining({ title: 'New Task' })
      );
  });

  test('should update a task', () => {
      const taskToUpdate = getInProgressTasks()[0];
      updateTask(taskToUpdate.id, { title: 'Updated Task Title' });
      const updatedTask = getAllTasks().find(task => task.id === taskToUpdate.id);
      expect(updatedTask?.title).toBe('Updated Task Title');
  });

  test('should delete a task', () => {
      const taskToDelete = getInProgressTasks()[0];
      deleteTask(taskToDelete.id);
      const inProgressTasks = getInProgressTasks();
      expect(inProgressTasks).not.toContainEqual(
          expect.objectContaining({ id: taskToDelete.id })
      );
  });

  test('should enforce task completion order', () => {
      completeTask(1); // ID of 'Initial Setup'
      completeTask(2); // ID of 'Basic Introduction'
      const inProgressTasks = getInProgressTasks();
      expect(inProgressTasks).toContainEqual(
          expect.objectContaining({ title: 'Basic Git' })
      );
  });
});
