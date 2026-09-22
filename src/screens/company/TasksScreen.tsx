import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ModalSheet } from '../../components/ui/ModalSheet';
import { INITIAL_TASKS } from '../../services/mockDb';
import { TaskItem } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors, typography, colors, radii } from '../../theme';
import { CheckSquare, Plus, Calendar } from 'lucide-react-native';

export const TasksScreen: React.FC = () => {
  const { isDarkMode } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [dueDate, setDueDate] = useState('May 30, 2024');

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    const newTask: TaskItem = {
      id: Date.now(),
      text: newTaskText,
      dueDate,
      priority: 'Medium',
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setModalOpen(false);
    setNewTaskText('');
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.headerSection}>
        <View style={styles.titleCol}>
          <Text style={[styles.screenTitle, { color: theme.text }]}>
            Tasks & Action Items
          </Text>
          <Text style={[styles.screenSubtitle, { color: theme.subtext }]}>
            Track deliverables, performance goals, and operational todos.
          </Text>
        </View>

        <Button
          title="Add Task"
          onPress={() => setModalOpen(true)}
          leftIcon={<Plus size={16} color="#FFFFFF" />}
          size="sm"
        />
      </View>

      <View style={styles.tasksList}>
        {tasks.map((t) => (
          <Card key={t.id} style={styles.taskCard} padding={14}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => toggleTask(t.id)}
              style={styles.taskRow}
            >
              <View
                style={[
                  styles.checkbox,
                  t.completed && styles.checkboxActive,
                  { borderColor: t.completed ? colors.accentBlue : theme.border },
                ]}
              >
                {t.completed ? <CheckSquare size={14} color="#FFFFFF" /> : null}
              </View>

              <View style={styles.taskInfo}>
                <Text
                  style={[
                    styles.taskText,
                    {
                      color: t.completed ? theme.muted : theme.text,
                      textDecorationLine: t.completed ? 'line-through' : 'none',
                    },
                  ]}
                >
                  {t.text}
                </Text>
                <Text style={[styles.dueDate, { color: theme.muted }]}>
                  Due {t.dueDate}
                </Text>
              </View>

              <Badge
                variant={
                  t.priority === 'High'
                    ? 'danger'
                    : t.priority === 'Medium'
                    ? 'warning'
                    : 'info'
                }
                size="sm"
              >
                {t.priority}
              </Badge>
            </TouchableOpacity>
          </Card>
        ))}
      </View>

      <ModalSheet
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Task"
      >
        <View style={styles.form}>
          <Input
            label="Task Description"
            value={newTaskText}
            onChangeText={setNewTaskText}
            placeholder="e.g. Prepare client onboarding slides"
          />
          <Input
            label="Due Date"
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="e.g. May 30, 2024"
          />
          <Button
            title="Create Task"
            onPress={handleAddTask}
            style={styles.submitBtn}
          />
        </View>
      </ModalSheet>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
    paddingBottom: 24,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleCol: {
    flex: 1,
    paddingRight: 10,
  },
  screenTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.black,
  },
  screenSubtitle: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  tasksList: {
    gap: 8,
  },
  taskCard: {
    marginBottom: 2,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: colors.accentBlue,
  },
  taskInfo: {
    flex: 1,
    paddingRight: 8,
  },
  taskText: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.semibold,
  },
  dueDate: {
    fontSize: 10.5,
    marginTop: 2,
  },
  form: {
    paddingBottom: 16,
  },
  submitBtn: {
    marginTop: 10,
  },
});
