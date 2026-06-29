import { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const defaultForm = {
  title: '',
  description: '',
  deadline: '',
  estimatedMinutes: 60,
  category: 'work',
  priority: 'medium',
  tags: '',
};

export default function TaskForm({ initialData, onSubmit, loading, onCancel }) {
  const [form, setForm] = useState(
    initialData
      ? {
          ...initialData,
          deadline: initialData.deadline
            ? new Date(initialData.deadline).toISOString().slice(0, 16)
            : '',
          tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
        }
      : defaultForm
  );

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      estimatedMinutes: Number(form.estimatedMinutes),
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Task title"
        placeholder="What needs to be done?"
        value={form.title}
        onChange={(e) => set('title', e.target.value)}
        required
      />

      <div>
        <label className="text-sm font-medium text-stone-700 block mb-1.5">Description</label>
        <textarea
          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all duration-150 resize-none"
          rows={3}
          placeholder="Add context or notes..."
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Deadline"
          type="datetime-local"
          value={form.deadline}
          onChange={(e) => set('deadline', e.target.value)}
          required
        />
        <Input
          label="Estimated time (minutes)"
          type="number"
          min="1"
          max="1440"
          value={form.estimatedMinutes}
          onChange={(e) => set('estimatedMinutes', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Category" value={form.category} onChange={(e) => set('category', e.target.value)}>
          <option value="work">Work</option>
          <option value="study">Study</option>
          <option value="personal">Personal</option>
          <option value="health">Health</option>
          <option value="finance">Finance</option>
          <option value="other">Other</option>
        </Select>
        <Select label="Priority" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </Select>
      </div>

      <Input
        label="Tags (comma-separated)"
        placeholder="e.g. urgent, client, Q1"
        value={form.tags}
        onChange={(e) => set('tags', e.target.value)}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading} className="flex-1 justify-center">
          {initialData ? 'Save changes' : 'Create task'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
