import React, { useState, useEffect } from 'react';
import Button from 'antd/lib/button';
import Card from 'antd/lib/card';
import Col from 'antd/lib/col';
import Modal from 'antd/lib/modal';
import Row from 'antd/lib/row';
import Typography from 'antd/lib/typography';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Badge from 'antd/lib/badge';
import Task from '@/model/Task';
import {
    initializeTasks,
    getTodoTasks,
    getInProgressTasks,
    getCompletedTasks,
    completeTask,
    createTask,
    deleteTask
} from '@/modules/taskManager';

const { Title, Text } = Typography;
const { Option } = Select;

const TaskBoard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        initializeTasks();
        refreshTasks();
    }, []);

    const refreshTasks = () => {
        setTasks([...getTodoTasks(), ...getInProgressTasks(), ...getCompletedTasks()]);
    };

    const handleCompleteTask = (taskId: number) => {
        completeTask(taskId);
        refreshTasks();
    };

    const handleCreateTask = (values: any) => {
        createTask(values.title, values.description, values.persona, values.group);
        setIsModalVisible(false);
        form.resetFields();
        refreshTasks();
    };

    const handleDeleteTask = (taskId: number) => {
        deleteTask(taskId);
        refreshTasks();
    };

    const getTasksForColumn = (column: string) => {
        if (column === 'To-Do') {
            return getTodoTasks();
        } else if (column === 'In Progress') {
            return getInProgressTasks();
        } else {
            return getCompletedTasks();
        }
    };

    const columns = ['To-Do', 'In Progress', 'Completed'];

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Task Board</Title>
            <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: '20px' }}>
                Create New Task
            </Button>
            <Row gutter={16}>
                {columns.map(column => {
                    const columnTasks = getTasksForColumn(column);
                    return (
                        <Col span={column === 'To-Do' ? 12 : 6} key={column}>
                            <Card
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Badge count={columnTasks.length} style={{ backgroundColor: '#52c41a', marginRight: '10px' }} />
                                        <span>{column}</span>
                                    </div>
                                }
                                style={{ height: '100%' }}
                            >
                                {column === 'To-Do' ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                        {columnTasks.map(task => (
                                            <Card key={task.id} size="small">
                                                <Title level={5}>{`Task ${task.id}`}</Title>
                                                <Text type="secondary">{task.title}</Text>
                                                <Text type="secondary">{task.description}</Text>
                                                <div style={{ marginTop: '10px' }}>
                                                    <Button type="primary" onClick={() => handleCompleteTask(task.id)} disabled>
                                                        Complete
                                                    </Button>
                                                    <Button danger onClick={() => handleDeleteTask(task.id)} style={{ marginLeft: '10px' }}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gap: '10px' }}>
                                        {columnTasks.map(task => (
                                            <Card key={task.id} size="small">
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Title level={5}>{`Task ${task.id}`}</Title>
                                                    <Text type="secondary">{task.title}</Text>
                                                </div>
                                                <Text type="secondary">{task.description}</Text>
                                                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                    {column === 'In Progress' && (
                                                        <Button type="primary" onClick={() => handleCompleteTask(task.id)}>
                                                            Complete
                                                        </Button>
                                                    )}
                                                    <Button danger onClick={() => handleDeleteTask(task.id)}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </Col>
                    );
                })}
            </Row>
            <Modal
                title="Create New Task"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleCreateTask}>
                    <Form.Item name="title" rules={[{ required: true }]}>
                        <Input placeholder="Task Title" />
                    </Form.Item>
                    <Form.Item name="description" rules={[{ required: true }]}>
                        <Input.TextArea placeholder="Task Description" />
                    </Form.Item>
                    <Form.Item name="persona" rules={[{ required: true }]}>
                        <Input placeholder="Persona" />
                    </Form.Item>
                    <Form.Item name="group" rules={[{ required: true }]}>
                        <Select placeholder="Select Group">
                            <Option value={1}>Group 1</Option>
                            <Option value={2}>Group 2</Option>
                            <Option value={3}>Group 3</Option>
                            <Option value={4}>Group 4</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create Task
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TaskBoard;

