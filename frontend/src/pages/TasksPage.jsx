import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, CheckSquare } from 'lucide-react';
import { tasksApi } from '../services/api';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';

const STATUS_TABS = [
  { label: 'Active', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
];

export default function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab) params.status = activeTab;
      const { data } = await tasksApi.getAll(params);
      setTasks(data.tasks);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, []);

  const openCreate = () => { setEditTask(null); setModalOpen(true); };
  const openEdit = (task) => { setEditTask(task); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditTask(null); };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editTask) {
        await tasksApi.update(editTask._id, formData);
      } else {
        await tasksApi.create(formData);
      }
      closeModal();
      loadTasks();
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await tasksApi.update(task._id, { status: newStatus });
    loadTasks();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    await tasksApi.delete(id);
    loadTasks();
  };

  const activeTasks = activeTab
    ? tasks
    : tasks.filter((t) => t.status !== 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Tasks</h1>
          <p className="text-sm text-stone-400 mt-0.5">{tasks.length} total tasks</p>
        </div>
        <Button onClick={openCreate} icon={<Plus size={15} />}>New task</Button>
      </div>

      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === tab.value
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : activeTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks here"
          description="Create your first task to get started."
          action={<Button onClick={openCreate} icon={<Plus size={14} />}>Add task</Button>}
        />
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-2.5">
            {activeTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onComplete={handleComplete}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTask ? 'Edit task' : 'New task'}
      >
        <TaskForm
          initialData={editTask}
          onSubmit={handleSubmit}
          loading={saving}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
