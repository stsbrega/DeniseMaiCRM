'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { TaskForm } from './task-form';

interface Task {
  id: string;
  subject: string;
  due_date: string;
  status: string;
}

interface TasksSectionProps {
  leadId: string;
}

export function TasksSection({ leadId }: TasksSectionProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchTasks() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('lead_id', leadId)
      .order('due_date', { ascending: true });

    if (!error && data) {
      setTasks(data);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchTasks();
  }, [leadId]);

  async function toggleTaskStatus(taskId: string, currentStatus: string) {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const { error } = await supabase
      .from('tasks')
      .update({ status: nextStatus, completed_at: nextStatus === 'completed' ? new Date().toISOString() : null })
      .eq('id', taskId);

    if (!error) {
      fetchTasks();
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-md font-semibold text-gray-900">Follow-up Tasks</h3>
      <TaskForm leadId={leadId} onTaskAdded={fetchTasks} />
      <div className="space-y-3 mt-4">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => toggleTaskStatus(task.id, task.status)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div className="truncate">
                  <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.subject}
                  </p>
                  {task.due_date && (
                    <p className="text-xs text-gray-400">
                      Due: {new Date(task.due_date).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
