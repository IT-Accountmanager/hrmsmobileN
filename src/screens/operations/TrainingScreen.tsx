import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors, colors, radii, typography } from '../../theme';
import {
  GraduationCap,
  Play,
  Star,
  Clock,
  Users,
  Plus,
  X,
  CheckCircle2,
  BookOpen,
  Award,
  Sparkles,
} from 'lucide-react-native';

interface Course {
  id: string;
  title: string;
  category: 'Technical' | 'Compliance' | 'Leadership' | 'Design' | string;
  description: string;
  hours: number;
  rating: number;
  enrolled: number;
  totalSeats: number;
  imageUrl: string;
  modules: string[];
}

const INITIAL_COURSES: Course[] = [
  {
    id: 'c-1',
    title: 'Advanced React 19 & Architecture Design',
    category: 'Technical',
    description:
      'Master server components, custom hooks, micro-frontends, and performance optimization.',
    hours: 16,
    rating: 4.9,
    enrolled: 18,
    totalSeats: 24,
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600',
    modules: [
      'Module 1: Server Components & React Compiler',
      'Module 2: Custom Hooks & State Performance',
      'Module 3: Micro-Frontends & Module Federation',
      'Module 4: Memory Optimization & Profiling',
    ],
  },
  {
    id: 'c-2',
    title: 'Enterprise Information Security & SOC2 Compliance',
    category: 'Compliance',
    description:
      'Mandatory annual training covering zero-trust, data confidentiality, and incident protocols.',
    hours: 4,
    rating: 4.8,
    enrolled: 110,
    totalSeats: 124,
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600',
    modules: [
      'Module 1: Zero-Trust Network Architecture',
      'Module 2: Phishing & Credential Guard',
      'Module 3: PII & Data Classification Standards',
      'Module 4: Security Incident Escalation Drill',
    ],
  },
  {
    id: 'c-3',
    title: 'High-Impact SaaS Product Management & Growth',
    category: 'Leadership',
    description:
      'Frameworks for PLG product-led growth, cohort retention, and customer feedback loops.',
    hours: 12,
    rating: 4.8,
    enrolled: 12,
    totalSeats: 18,
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
    modules: [
      'Module 1: Product-Led Growth Metrics & Funnels',
      'Module 2: Customer Discovery & Signal Synthesis',
      'Module 3: Cohort Analysis & Churn Mitigation',
      'Module 4: Executing Go-To-Market Launches',
    ],
  },
];

export const TrainingScreen: React.FC<{ onNavigate?: (screenKey: string) => void }> = () => {
  const { isDarkMode } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);

  // New Course Form State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCat, setCourseCat] = useState('Technical');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseHours, setCourseHours] = useState('8');

  const handleCreateCourse = () => {
    if (!courseTitle.trim()) {
      Alert.alert('Validation Error', 'Please enter course title.');
      return;
    }
    const newCourse: Course = {
      id: `c-${Date.now()}`,
      title: courseTitle.trim(),
      category: courseCat,
      description: courseDesc.trim() || 'Comprehensive employee learning curriculum.',
      hours: parseInt(courseHours, 10) || 8,
      rating: 5.0,
      enrolled: 1,
      totalSeats: 25,
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
      modules: ['Module 1: Introduction & Principles', 'Module 2: Applied Workflows & Labs'],
    };
    setCourses([newCourse, ...courses]);
    setModalOpen(false);
    setCourseTitle('');
    setCourseDesc('');
    Alert.alert('Course Published', 'New LMS course is now live for enrollment.');
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: isDarkMode ? '#0B1120' : '#F8FAFC' }]}
    >
      {/* 1. Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.titleCol}>
          <Text style={[styles.screenTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
            Learning Management System (LMS) & Training
          </Text>
          <Text style={styles.screenSubtitle}>
            Upskill employees, assign mandatory compliance modules, and award certifications.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setModalOpen(true)}
          style={styles.createBtn}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 6 }} />
          <Text style={styles.createBtnText}>Create New Course</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Course Cards Grid */}
      <View style={styles.courseGrid}>
        {courses.map((course) => (
          <View
            key={course.id}
            style={[
              styles.courseCard,
              { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
            ]}
          >
            {/* Top Banner Image with Category Badge */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: course.imageUrl }} style={styles.courseImage} resizeMode="cover" />
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{course.category}</Text>
              </View>
            </View>

            {/* Course Body */}
            <View style={styles.cardBody}>
              <Text style={[styles.courseTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                {course.title}
              </Text>
              <Text style={styles.courseDesc}>{course.description}</Text>

              {/* Meta Row: Hours, Rating, Enrolled */}
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Clock size={13} color="#94A3B8" />
                  <Text style={styles.metaText}>{course.hours} Hours</Text>
                </View>

                <View style={styles.metaItem}>
                  <Star size={13} color="#F59E0B" fill="#F59E0B" />
                  <Text style={[styles.metaText, { fontWeight: '700', color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                    {course.rating}
                  </Text>
                </View>

                <View style={styles.metaItem}>
                  <Users size={13} color="#94A3B8" />
                  <Text style={styles.metaText}>
                    {course.enrolled}/{course.totalSeats}
                  </Text>
                </View>
              </View>

              {/* Start Training Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setActiveCourseModal(course)}
                style={styles.startModuleBtn}
              >
                <Play size={13} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.startModuleBtnText}>Start Training Module</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* 3. Course Interactive Player Modal */}
      <Modal visible={!!activeCourseModal} transparent animationType="slide" onRequestClose={() => setActiveCourseModal(null)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF' },
            ]}
          >
            {activeCourseModal && (
              <>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={[styles.activeCourseTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                      {activeCourseModal.title}
                    </Text>
                    <Text style={styles.activeCourseSub}>
                      {activeCourseModal.category} • {activeCourseModal.hours} Hours Curriculum
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setActiveCourseModal(null)} style={styles.closeBtn}>
                    <X size={18} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.curriculumTitle}>Course Syllabus & Modules</Text>
                <ScrollView style={{ maxHeight: 220, marginBottom: 14 }}>
                  {activeCourseModal.modules.map((mod, i) => (
                    <View
                      key={i}
                      style={[
                        styles.moduleItem,
                        { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC' },
                      ]}
                    >
                      <CheckCircle2 size={16} color="#10B981" style={{ marginRight: 10 }} />
                      <Text style={[styles.moduleText, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                        {mod}
                      </Text>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    Alert.alert('Module In Progress', 'You have begun playback for this training module.');
                    setActiveCourseModal(null);
                  }}
                  style={styles.launchLessonBtn}
                >
                  <Text style={styles.launchLessonText}>Resume Next Lesson (Video / Quiz)</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* 4. Create Course Modal */}
      <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF' },
            ]}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                  Create New Course
                </Text>
                <Text style={styles.modalSub}>
                  Publish a training curriculum for team professional development.
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalOpen(false)} style={styles.closeBtn}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Course Title *</Text>
            <TextInput
              value={courseTitle}
              onChangeText={setCourseTitle}
              placeholder="e.g. Next.js 15 Full Stack Engineering"
              placeholderTextColor="#94A3B8"
              style={[
                styles.formInput,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
              ]}
            />

            <Text style={styles.inputLabel}>Category</Text>
            <TextInput
              value={courseCat}
              onChangeText={setCourseCat}
              placeholder="Technical, Compliance, Leadership, Design"
              placeholderTextColor="#94A3B8"
              style={[
                styles.formInput,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
              ]}
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              value={courseDesc}
              onChangeText={setCourseDesc}
              placeholder="Course summary and learning outcomes..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              style={[
                styles.formTextarea,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
              ]}
            />

            <Text style={styles.inputLabel}>Estimated Duration (Hours)</Text>
            <TextInput
              value={courseHours}
              onChangeText={setCourseHours}
              placeholder="e.g. 10"
              keyboardType="number-pad"
              placeholderTextColor="#94A3B8"
              style={[
                styles.formInput,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
              ]}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleCreateCourse}
              style={styles.modalSubmitBtn}
            >
              <Text style={styles.modalSubmitBtnText}>Publish Course</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  titleCol: {
    flex: 1,
    minWidth: 240,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 17,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radii.md,
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  courseGrid: {
    gap: 16,
  },
  courseCard: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    height: 140,
    width: '100%',
    position: 'relative',
  },
  courseImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#0F172A',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },
  cardBody: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
    lineHeight: 20,
  },
  courseDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 11,
    color: '#64748B',
  },
  startModuleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 11,
    borderRadius: radii.md,
  },
  startModuleBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  closeBtn: {
    padding: 4,
  },
  activeCourseTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  activeCourseSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  curriculumTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 10,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: radii.md,
    marginBottom: 8,
  },
  moduleText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  launchLessonBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  launchLessonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13.5,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 5,
    marginTop: 10,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
  },
  formTextarea: {
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 70,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  modalSubmitBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
