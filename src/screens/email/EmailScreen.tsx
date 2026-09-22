import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import {
  Mail,
  Inbox,
  Send,
  FileText,
  Archive,
  ShieldAlert,
  Trash2,
  Search,
  Bookmark,
  Paperclip,
  AlertCircle,
  CornerUpLeft,
  CornerUpRight,
  RotateCcw,
  Printer,
  ChevronLeft,
  ShieldCheck,
  Download,
  Plus,
  X,
  Check,
  Flag,
  Users,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface EmailScreenProps {
  onNavigate?: (screenKey: string) => void;
}

interface EmailItem {
  id: string;
  senderName: string;
  senderRole?: string;
  senderEmail: string;
  recipient: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  time: string;
  category: 'HR & Benefits' | 'Work & Projects' | 'High Priority' | 'IT & Security' | 'Finance & Claims';
  tagLabel: string;
  tagColor: string;
  isUnread: boolean;
  isFlagged: boolean;
  isHighPriority: boolean;
  tab: 'Focused' | 'Other';
  folder: 'Inbox' | 'Sent' | 'Drafts' | 'Archive' | 'Junk' | 'Deleted';
  avatar: string;
  attachments?: {
    name: string;
    size: string;
    type: 'PDF' | 'EXCEL' | 'DOC';
  }[];
}

export const EmailScreen: React.FC<EmailScreenProps> = ({ onNavigate }) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useAppStore();

  // Mobile View state: 'folders' | 'inbox' | 'detail'
  const [mobileView, setMobileView] = useState<'inbox' | 'folders' | 'detail'>('detail');
  const [selectedFolder, setSelectedFolder] = useState<string>('Inbox');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inboxTab, setInboxTab] = useState<'Focused' | 'Other'>('Focused');
  const [filterType, setFilterType] = useState<'All' | 'Unread' | 'Flagged'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmailId, setSelectedEmailId] = useState<string>('email-1');

  // Modals
  const [composeModalOpen, setComposeModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyMode, setReplyMode] = useState<'reply' | 'replyAll' | 'forward'>('reply');

  // Compose State
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  // Quick Reply in reading pane
  const [quickReplyText, setQuickReplyText] = useState('');

  // Email Dataset (Matching screenshot)
  const [emails, setEmails] = useState<EmailItem[]>([
    {
      id: 'email-1',
      senderName: 'HR Operations Desk',
      senderRole: 'People & Culture Lead',
      senderEmail: 'hr.operations@acmecorp.com',
      recipient: 'You <hr.admin@acmecorp.com>',
      subject: 'Annual Performance & Benefits Review 2026 Cycle Announcement',
      snippet:
        'Dear team, the 2026 Annual Performance Appraisal and Benefits enrollment window is now active across all...',
      body: `Dear Team,

We are pleased to announce the kick-off for our 2026 Annual Performance and Benefits enrollment cycle. Please review your compensation statements, updated medical insurance coverages, and submit any dependent enrollment requests by September 30.

Key highlights for this cycle:
• Comprehensive dental and vision upgrade across tier-1 healthcare networks
• Flexible wellness spending allowance ($750 annual stipend)
• Q3 milestone bonus payouts schedule and performance self-evaluations
• Remote ergonomic equipment reimbursement guidelines

If you have any questions regarding your benefits tier or goal submissions, feel free to reply directly to this thread or reach out to your HR Business Partner.

Warm regards,
HR Operations & People Experience Team
Acme Corporation`,
      date: 'Today',
      time: '10:30 AM',
      category: 'HR & Benefits',
      tagLabel: 'HR',
      tagColor: '#10B981',
      isUnread: false,
      isFlagged: true,
      isHighPriority: true,
      tab: 'Focused',
      folder: 'Inbox',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      attachments: [
        { name: 'Annual_Benefits_Guide_2026.pdf', size: '3.4 MB', type: 'PDF' },
        { name: 'Compensation_Band_Matrix.xlsx', size: '1.8 MB', type: 'EXCEL' },
      ],
    },
    {
      id: 'email-2',
      senderName: 'David Vance',
      senderRole: 'VP of Workplace Experience',
      senderEmail: 'david.vance@acmecorp.com',
      recipient: 'All Staff <all@acmecorp.com>',
      subject: 'Q3 Town Hall & Enterprise Milestone Celebration Invitation',
      snippet:
        'Please join us this Thursday at 4:00 PM for our global Q3 all-hands meeting in the main auditorium and live on Teams...',
      body: `Hi Everyone,

You are warmly invited to attend our Q3 Enterprise Town Hall this Thursday at 4:00 PM EST.

We will celebrate our record sprint achievements, welcome our 28 newest team members, and announce our global expansion roadmap for late 2026.

Live streaming will be accessible through the Microsoft Teams Collaboration channel. Refreshments and networking reception to follow in the main atrium.

Best,
David Vance`,
      date: 'Yesterday',
      time: '04:15 PM',
      category: 'Work & Projects',
      tagLabel: 'Work',
      tagColor: '#2563EB',
      isUnread: true,
      isFlagged: false,
      isHighPriority: false,
      tab: 'Focused',
      folder: 'Inbox',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      attachments: [{ name: 'TownHall_Agenda_Q3.pdf', size: '1.2 MB', type: 'PDF' }],
    },
    {
      id: 'email-3',
      senderName: 'Elena Rostova',
      senderRole: 'Lead Talent Acquisition',
      senderEmail: 'elena.rostova@acmecorp.com',
      recipient: 'HR Admin <hr.admin@acmecorp.com>',
      subject: 'Final Interview Loops Scheduled for Senior Backend Engineer',
      snippet:
        'We have 3 outstanding candidates scheduled for final architecture loops this week. Please review their resumes...',
      body: `Hello Team,

We have shortlisted 3 stellar candidates for our Senior Cloud & Backend Architecture openings.

Interview scorecards and candidate portfolios have been synchronized to the recruitment dashboard. Please confirm interview committee availability by end of day.

Regards,
Elena Rostova`,
      date: 'Sep 07',
      time: '02:20 PM',
      category: 'Work & Projects',
      tagLabel: 'Work',
      tagColor: '#2563EB',
      isUnread: false,
      isFlagged: false,
      isHighPriority: false,
      tab: 'Focused',
      folder: 'Inbox',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      attachments: [{ name: 'Candidate_Portfolios_BatchA.pdf', size: '4.8 MB', type: 'PDF' }],
    },
    {
      id: 'email-4',
      senderName: 'IT Support Desk',
      senderRole: 'Infrastructure & Security',
      senderEmail: 'security@acmecorp.com',
      recipient: 'All Acme Users <staff@acmecorp.com>',
      subject: 'Scheduled Maintenance: Microsoft 365 & SSO Authentication',
      snippet: 'Notice of brief scheduled patch maintenance on Sunday at 02:00 AM UTC...',
      body: `Security Team Notification:
Our identity infrastructure will undergo scheduled routine maintenance this Sunday. Minimal disruption is anticipated. Please save all work in progress.`,
      date: 'Sep 05',
      time: '09:00 AM',
      category: 'IT & Security',
      tagLabel: 'Security',
      tagColor: '#8B5CF6',
      isUnread: false,
      isFlagged: false,
      isHighPriority: false,
      tab: 'Other',
      folder: 'Inbox',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
  ]);

  const activeEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];

  // Filtering emails
  const filteredEmails = emails.filter((email) => {
    // Tab filter
    if (email.tab !== inboxTab) return false;
    // Category filter
    if (selectedCategory && email.category !== selectedCategory) return false;
    // Unread / Flagged filter
    if (filterType === 'Unread' && !email.isUnread) return false;
    if (filterType === 'Flagged' && !email.isFlagged) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        email.senderName.toLowerCase().includes(q) ||
        email.subject.toLowerCase().includes(q) ||
        email.snippet.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleSelectEmail = (email: EmailItem) => {
    setSelectedEmailId(email.id);
    // Mark as read when selected
    setEmails((prev) =>
      prev.map((e) => (e.id === email.id ? { ...e, isUnread: false } : e))
    );
    setMobileView('detail');
  };

  const handleToggleFlag = (id: string, e?: any) => {
    e?.stopPropagation?.();
    setEmails((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFlagged: !item.isFlagged } : item
      )
    );
  };

  const handleToggleRead = (id: string, e?: any) => {
    e?.stopPropagation?.();
    setEmails((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isUnread: !item.isUnread } : item
      )
    );
  };

  const handleDeleteEmail = (id: string, e?: any) => {
    e?.stopPropagation?.();
    Alert.alert('Delete Email', 'Are you sure you want to move this message to Deleted Items?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setEmails((prev) => prev.filter((item) => item.id !== id));
          if (selectedEmailId === id) {
            const remaining = emails.filter((item) => item.id !== id);
            if (remaining.length > 0) setSelectedEmailId(remaining[0].id);
            setMobileView('inbox');
          }
        },
      },
    ]);
  };

  const handleSendCompose = () => {
    if (!composeTo.trim() || !composeSubject.trim()) {
      Alert.alert('Required Fields', 'Please enter a recipient and subject.');
      return;
    }
    const newEmail: EmailItem = {
      id: `email-${Date.now()}`,
      senderName: 'You (Rachel Green)',
      senderRole: 'HR Admin',
      senderEmail: 'hr.admin@acmecorp.com',
      recipient: composeTo.trim(),
      subject: composeSubject.trim(),
      snippet: composeBody.substring(0, 100) || 'Sent from mobile Outlook Exchange...',
      body: composeBody || 'Sent from Acme HRMS Mobile Outlook Web App.',
      date: 'Today',
      time: 'Just now',
      category: 'Work & Projects',
      tagLabel: 'Work',
      tagColor: '#2563EB',
      isUnread: false,
      isFlagged: false,
      isHighPriority: false,
      tab: 'Focused',
      folder: 'Sent',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setEmails((prev) => [newEmail, ...prev]);
    setComposeModalOpen(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    Alert.alert('Email Sent', 'Your message has been delivered via Microsoft Exchange.');
  };

  const handleOpenReply = (mode: 'reply' | 'replyAll' | 'forward') => {
    setReplyMode(mode);
    setComposeTo(mode === 'forward' ? '' : activeEmail.senderEmail);
    setComposeSubject(
      mode === 'forward'
        ? `Fwd: ${activeEmail.subject}`
        : `Re: ${activeEmail.subject}`
    );
    setComposeBody(
      `\n\n--- Original Message ---\nFrom: ${activeEmail.senderName} <${activeEmail.senderEmail}>\nSent: ${activeEmail.date} at ${activeEmail.time}\nSubject: ${activeEmail.subject}\n\n${activeEmail.body}`
    );
    setComposeModalOpen(true);
  };

  const handleSendQuickReply = () => {
    if (!quickReplyText.trim()) return;
    Alert.alert(
      'Reply Sent',
      `Your reply to ${activeEmail.senderName} has been sent via Microsoft Exchange Online.`
    );
    setQuickReplyText('');
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ===================== TOP NAVIGATION SEGMENTER ===================== */}
      <View
        style={[
          styles.viewSwitcher,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderBottomColor: isDarkMode ? '#334155' : '#E2E8F0',
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setMobileView('folders')}
          style={[
            styles.switchTab,
            mobileView === 'folders' && styles.switchTabActive,
          ]}
        >
          <Mail
            size={13}
            color={mobileView === 'folders' ? '#2563EB' : '#64748B'}
            style={{ marginRight: 5 }}
          />
          <Text
            style={[
              styles.switchTabText,
              mobileView === 'folders' && styles.switchTabTextActive,
            ]}
          >
            Folders
          </Text>
          <View style={styles.unreadCountPill}>
            <Text style={styles.unreadCountPillText}>4</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setMobileView('inbox')}
          style={[
            styles.switchTab,
            mobileView === 'inbox' && styles.switchTabActive,
          ]}
        >
          <Inbox
            size={13}
            color={mobileView === 'inbox' ? '#2563EB' : '#64748B'}
            style={{ marginRight: 5 }}
          />
          <Text
            style={[
              styles.switchTabText,
              mobileView === 'inbox' && styles.switchTabTextActive,
            ]}
          >
            Inbox ({filteredEmails.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setMobileView('detail')}
          style={[
            styles.switchTab,
            mobileView === 'detail' && styles.switchTabActive,
          ]}
        >
          <FileText
            size={13}
            color={mobileView === 'detail' ? '#2563EB' : '#64748B'}
            style={{ marginRight: 5 }}
          />
          <Text
            style={[
              styles.switchTabText,
              mobileView === 'detail' && styles.switchTabTextActive,
            ]}
            numberOfLines={1}
          >
            Reading Pane
          </Text>
        </TouchableOpacity>
      </View>

      {/* ===================== VIEW 1: FOLDERS & CATEGORIES ===================== */}
      {mobileView === 'folders' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.foldersScrollView,
            { paddingBottom: Math.max(insets.bottom, 24) + 60 },
          ]}
        >
          {/* Header */}
          <View style={styles.foldersHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Mail size={18} color="#2563EB" />
              <Text style={[styles.foldersTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                Mail Folders
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => Alert.alert('Syncing', 'Checking for new messages on Exchange server...')}
              style={styles.refreshBtn}
            >
              <RotateCcw size={15} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Favorites */}
          <Text style={styles.sectionHeading}>FAVORITES</Text>
          <View
            style={[
              styles.folderCard,
              { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
            ]}
          >
            {[
              { name: 'Inbox', icon: Inbox, count: 1, isBlue: true },
              { name: 'Sent Items', icon: Send, count: 0 },
              { name: 'Drafts', icon: FileText, count: 1 },
              { name: 'Archive', icon: Archive, count: 0 },
              { name: 'Junk Email', icon: ShieldAlert, count: 1, isOrange: true },
              { name: 'Deleted Items', icon: Trash2, count: 0 },
            ].map((f, i) => {
              const IconComp = f.icon;
              const isSelected = selectedFolder === f.name;
              return (
                <TouchableOpacity
                  key={f.name}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedFolder(f.name);
                    setSelectedCategory(null);
                    setMobileView('inbox');
                  }}
                  style={[
                    styles.folderRow,
                    isSelected && {
                      backgroundColor: isDarkMode ? '#2563EB25' : '#EFF6FF',
                      borderRadius: 10,
                    },
                    i > 0 && { borderTopWidth: 1, borderTopColor: isDarkMode ? '#334155' : '#F1F5F9' },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <IconComp
                      size={17}
                      color={
                        isSelected
                          ? '#2563EB'
                          : f.isOrange
                          ? '#F97316'
                          : isDarkMode
                          ? '#94A3B8'
                          : '#64748B'
                      }
                    />
                    <Text
                      style={[
                        styles.folderRowText,
                        {
                          color: isSelected
                            ? '#2563EB'
                            : isDarkMode
                            ? '#E2E8F0'
                            : '#334155',
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {f.name}
                    </Text>
                  </View>
                  {f.count > 0 && (
                    <View
                      style={[
                        styles.folderBadge,
                        f.isOrange
                          ? { backgroundColor: '#F97316' }
                          : { backgroundColor: '#2563EB' },
                      ]}
                    >
                      <Text style={styles.folderBadgeText}>{f.count}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Categories */}
          <Text style={[styles.sectionHeading, { marginTop: 18 }]}>CATEGORIES</Text>
          <View
            style={[
              styles.folderCard,
              { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
            ]}
          >
            {[
              { name: 'Work & Projects', dotColor: '#3B82F6' },
              { name: 'HR & Benefits', dotColor: '#10B981' },
              { name: 'High Priority', dotColor: '#EF4444' },
              { name: 'IT & Security', dotColor: '#8B5CF6' },
              { name: 'Finance & Claims', dotColor: '#F59E0B' },
            ].map((cat, i) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <TouchableOpacity
                  key={cat.name}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedCategory(isSelected ? null : cat.name);
                    setMobileView('inbox');
                  }}
                  style={[
                    styles.categoryRow,
                    isSelected && {
                      backgroundColor: isDarkMode ? '#2563EB25' : '#EFF6FF',
                      borderRadius: 10,
                    },
                    i > 0 && { borderTopWidth: 1, borderTopColor: isDarkMode ? '#334155' : '#F1F5F9' },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={[styles.colorDot, { backgroundColor: cat.dotColor }]} />
                    <Text
                      style={[
                        styles.categoryText,
                        {
                          color: isSelected
                            ? '#2563EB'
                            : isDarkMode
                            ? '#E2E8F0'
                            : '#334155',
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </View>
                  {isSelected && <Check size={14} color="#2563EB" />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Exchange Quota Card */}
          <View
            style={[
              styles.quotaCard,
              { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
            ]}
          >
            <View style={styles.quotaRow}>
              <Text style={styles.quotaLabel}>Exchange Quota</Text>
              <Text style={[styles.quotaVal, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                14.8 / 50 GB
              </Text>
            </View>
            <View style={styles.quotaTrack}>
              <View style={[styles.quotaFill, { width: '29.6%' }]} />
            </View>
            <Text style={styles.quotaSub}>29% utilized • TLS 1.3 Online</Text>
          </View>

          {/* Compose Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              setComposeTo('');
              setComposeSubject('');
              setComposeBody('');
              setComposeModalOpen(true);
            }}
            style={styles.composeFullBtn}
          >
            <Plus size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.composeFullBtnText}>New Message</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : mobileView === 'inbox' ? (
        /* ===================== VIEW 2: EMAIL LIST ===================== */
        <View style={{ flex: 1 }}>
          {/* Search Box */}
          <View
            style={[
              styles.inboxSearchBar,
              { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
            ]}
          >
            <Search size={15} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search in mailbox (Ctrl+E)..."
              placeholderTextColor="#94A3B8"
              style={[
                styles.inboxSearchInput,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
              ]}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={14} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Focused / Other Tabs + Filter Pills */}
          <View
            style={[
              styles.filterBarRow,
              {
                backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
                borderBottomColor: isDarkMode ? '#1E293B' : '#E2E8F0',
              },
            ]}
          >
            <View style={styles.tabGroupLeft}>
              <TouchableOpacity
                onPress={() => setInboxTab('Focused')}
                style={[
                  styles.tabUnderlineBtn,
                  inboxTab === 'Focused' && styles.tabUnderlineBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabUnderlineText,
                    inboxTab === 'Focused' && styles.tabUnderlineTextActive,
                  ]}
                >
                  Focused
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setInboxTab('Other')}
                style={[
                  styles.tabUnderlineBtn,
                  inboxTab === 'Other' && styles.tabUnderlineBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabUnderlineText,
                    inboxTab === 'Other' && styles.tabUnderlineTextActive,
                  ]}
                >
                  Other
                </Text>
              </TouchableOpacity>
            </View>

            {/* Right filter pills */}
            <View style={styles.filterPillsRight}>
              {(['All', 'Unread', 'Flagged'] as const).map((filter) => {
                const isActive = filterType === filter;
                return (
                  <TouchableOpacity
                    key={filter}
                    onPress={() => setFilterType(filter)}
                    style={[
                      styles.filterPill,
                      isActive && styles.filterPillActive,
                      {
                        backgroundColor: isActive
                          ? '#2563EB'
                          : isDarkMode
                          ? '#1E293B'
                          : '#F1F5F9',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        isActive
                          ? { color: '#FFFFFF', fontWeight: '700' }
                          : { color: isDarkMode ? '#94A3B8' : '#64748B' },
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Email Items List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) + 60 }}
          >
            {filteredEmails.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Mail size={36} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No messages in this view</Text>
                <Text style={styles.emptySub}>Try adjusting your filters or search term.</Text>
              </View>
            ) : (
              filteredEmails.map((item) => {
                const isSelected = item.id === selectedEmailId;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    onPress={() => handleSelectEmail(item)}
                    style={[
                      styles.emailCardItem,
                      {
                        backgroundColor: isDarkMode
                          ? isSelected
                            ? '#1E293B'
                            : '#0F172A'
                          : isSelected
                          ? '#EEF2FF'
                          : '#FFFFFF',
                        borderBottomColor: isDarkMode ? '#1E293B' : '#F1F5F9',
                      },
                      isSelected && styles.emailCardItemSelected,
                    ]}
                  >
                    <View style={styles.emailRowTop}>
                      <View style={styles.avatarRow}>
                        <Image source={{ uri: item.avatar }} style={styles.senderAvatarImg} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <View style={styles.senderNameRow}>
                            <Text
                              style={[
                                styles.senderNameText,
                                { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                                item.isUnread && styles.senderNameBold,
                              ]}
                              numberOfLines={1}
                            >
                              {item.senderName}
                            </Text>
                            <Text style={styles.emailDateText}>{item.time || item.date}</Text>
                          </View>
                          <Text
                            style={[
                              styles.emailSubjectSnippet,
                              { color: isDarkMode ? '#E2E8F0' : '#1E293B' },
                              item.isUnread && styles.emailSubjectBold,
                            ]}
                            numberOfLines={1}
                          >
                            {item.subject}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Email Snippet */}
                    <Text
                      style={[
                        styles.emailBodySnippet,
                        { color: isDarkMode ? '#94A3B8' : '#64748B' },
                      ]}
                      numberOfLines={2}
                    >
                      {item.snippet}
                    </Text>

                    {/* Tags & Action Row */}
                    <View style={styles.emailTagsRow}>
                      <View style={styles.tagsGroup}>
                        <View
                          style={[
                            styles.categoryTagPill,
                            { backgroundColor: `${item.tagColor}18` },
                          ]}
                        >
                          <Text style={[styles.categoryTagText, { color: item.tagColor }]}>
                            {item.tagLabel}
                          </Text>
                        </View>

                        {item.attachments && item.attachments.length > 0 && (
                          <View style={styles.attachmentBadge}>
                            <Paperclip size={11} color="#64748B" style={{ marginRight: 3 }} />
                            <Text style={styles.attachmentCountText}>
                              {item.attachments.length}
                            </Text>
                          </View>
                        )}

                        {item.isHighPriority && (
                          <View style={styles.highPriorityBadge}>
                            <AlertCircle size={11} color="#EF4444" style={{ marginRight: 3 }} />
                            <Text style={styles.highPriorityText}>! High</Text>
                          </View>
                        )}
                      </View>

                      {/* Quick Icons */}
                      <View style={styles.quickIconsRow}>
                        <TouchableOpacity
                          onPress={(e) => handleToggleFlag(item.id, e)}
                          style={styles.quickIconBtn}
                        >
                          <Bookmark
                            size={14}
                            color={item.isFlagged ? '#F59E0B' : '#94A3B8'}
                            fill={item.isFlagged ? '#F59E0B' : 'transparent'}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={(e) => handleToggleRead(item.id, e)}
                          style={styles.quickIconBtn}
                        >
                          <Mail
                            size={14}
                            color={item.isUnread ? '#2563EB' : '#94A3B8'}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={(e) => handleDeleteEmail(item.id, e)}
                          style={styles.quickIconBtn}
                        >
                          <Trash2 size={14} color="#94A3B8" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          {/* Floating Compose FAB */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              setComposeTo('');
              setComposeSubject('');
              setComposeBody('');
              setComposeModalOpen(true);
            }}
            style={styles.fabBtn}
          >
            <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      ) : (
        /* ===================== VIEW 3: READING PANE (DETAIL VIEW) ===================== */
        <View style={{ flex: 1 }}>
          {/* Top Action Toolbar (Reply, Reply All, Forward, Delete, Archive, Junk, Print) */}
          <View
            style={[
              styles.detailToolbarRow,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderBottomColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => setMobileView('inbox')}
              style={styles.backToInboxBtn}
            >
              <ChevronLeft size={18} color="#2563EB" />
            </TouchableOpacity>

            <View style={styles.toolbarActionBtns}>
              <TouchableOpacity
                onPress={() => handleOpenReply('reply')}
                style={styles.toolbarBtnOutline}
              >
                <CornerUpLeft size={13} color="#2563EB" style={{ marginRight: 4 }} />
                <Text style={styles.toolbarBtnText}>Reply</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleOpenReply('replyAll')}
                style={styles.toolbarBtnOutline}
              >
                <Users size={13} color="#475569" style={{ marginRight: 4 }} />
                <Text style={styles.toolbarBtnTextMuted}>Reply all</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleOpenReply('forward')}
                style={styles.toolbarBtnOutline}
              >
                <CornerUpRight size={13} color="#475569" style={{ marginRight: 4 }} />
                <Text style={styles.toolbarBtnTextMuted}>Forward</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dividerV} />

            <View style={styles.iconActionsGroup}>
              <TouchableOpacity
                onPress={() => handleDeleteEmail(activeEmail.id)}
                style={styles.smallIconBtn}
              >
                <Trash2 size={15} color="#64748B" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Alert.alert('Archived', 'Message moved to Archive folder.')}
                style={styles.smallIconBtn}
              >
                <Archive size={15} color="#64748B" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Alert.alert('Junk Email', 'Marked as Junk / Spam.')}
                style={styles.smallIconBtn}
              >
                <ShieldAlert size={15} color="#64748B" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Alert.alert('Print', 'Sending document to default network printer...')}
                style={styles.smallIconBtn}
              >
                <Printer size={15} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Reading Pane Scroll Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.detailScrollContent,
              { paddingBottom: Math.max(insets.bottom, 24) + 60 },
            ]}
          >
            {/* Subject Header with Tag */}
            <View style={styles.subjectHeaderBox}>
              <Text
                style={[
                  styles.detailSubjectText,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                {activeEmail.subject}
              </Text>
              <View style={styles.subjectMetaRow}>
                <View
                  style={[
                    styles.categoryTagPill,
                    { backgroundColor: `${activeEmail.tagColor}18` },
                  ]}
                >
                  <Text style={[styles.categoryTagText, { color: activeEmail.tagColor }]}>
                    {activeEmail.tagLabel}
                  </Text>
                </View>
              </View>
            </View>

            {/* TLS Security Ribbon (Exact replica from screenshot) */}
            <View style={styles.tlsSecurityRibbon}>
              <ShieldCheck size={13} color="#10B981" style={{ marginRight: 6 }} />
              <Text style={styles.tlsSecurityText}>
                Verified by Microsoft Exchange Online • TLS 1.3 Encryption
              </Text>
            </View>

            {/* Sender Detail Card */}
            <View
              style={[
                styles.senderProfileBox,
                {
                  backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',
                  borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <Image
                source={{ uri: activeEmail.avatar }}
                style={styles.senderBigAvatar}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.senderTitleRow}>
                  <Text
                    style={[
                      styles.senderFullName,
                      { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                    ]}
                  >
                    {activeEmail.senderName}{' '}
                    {activeEmail.senderRole && (
                      <Text style={styles.senderRoleText}>({activeEmail.senderRole})</Text>
                    )}
                  </Text>
                  <Text style={styles.senderTimeRight}>
                    {activeEmail.date} at {activeEmail.time}
                  </Text>
                </View>

                <Text style={styles.senderAddressText}>
                  &lt;{activeEmail.senderEmail}&gt;
                </Text>

                <View style={styles.recipientRow}>
                  <Text style={styles.recipientText}>
                    To: {activeEmail.recipient}
                  </Text>
                  {activeEmail.isFlagged && (
                    <View style={styles.flaggedPill}>
                      <Flag size={10} color="#2563EB" fill="#2563EB" style={{ marginRight: 4 }} />
                      <Text style={styles.flaggedPillText}>Flagged</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Email Body Content */}
            <View style={styles.emailBodyContainer}>
              <Text
                style={[
                  styles.emailBodyContentText,
                  { color: isDarkMode ? '#E2E8F0' : '#334155' },
                ]}
              >
                {activeEmail.body}
              </Text>
            </View>

            {/* Attachments Section */}
            {activeEmail.attachments && activeEmail.attachments.length > 0 && (
              <View style={styles.attachmentSectionBox}>
                <Text
                  style={[
                    styles.attachmentSectionTitle,
                    { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                  ]}
                >
                  Attachments ({activeEmail.attachments.length})
                </Text>
                <View style={styles.attachmentsList}>
                  {activeEmail.attachments.map((att, i) => (
                    <View
                      key={i}
                      style={[
                        styles.attachmentFileCard,
                        {
                          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                          borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                        },
                      ]}
                    >
                      <FileText
                        size={20}
                        color={att.type === 'PDF' ? '#EF4444' : '#10B981'}
                      />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text
                          style={[
                            styles.attachmentFileName,
                            { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                          ]}
                          numberOfLines={1}
                        >
                          {att.name}
                        </Text>
                        <Text style={styles.attachmentFileSize}>{att.size}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => Alert.alert('Download', `Downloading ${att.name}...`)}
                        style={styles.downloadIconBtn}
                      >
                        <Download size={15} color="#2563EB" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Quick Reply Box */}
            <View
              style={[
                styles.quickReplyCard,
                {
                  backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                  borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <Text
                style={[
                  styles.quickReplyTitle,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                Quick Reply to {activeEmail.senderName}
              </Text>
              <TextInput
                value={quickReplyText}
                onChangeText={setQuickReplyText}
                placeholder={`Type a message to ${activeEmail.senderName}...`}
                placeholderTextColor="#94A3B8"
                multiline
                style={[
                  styles.quickReplyInput,
                  {
                    backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                    borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                    color: isDarkMode ? '#FFFFFF' : '#0F172A',
                  },
                ]}
              />
              <View style={styles.quickReplyActions}>
                <TouchableOpacity
                  onPress={() => handleOpenReply('reply')}
                  style={styles.fullEditorLink}
                >
                  <Text style={styles.fullEditorLinkText}>Open Full Editor</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSendQuickReply}
                  style={styles.sendQuickReplyBtn}
                >
                  <Send size={13} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.sendQuickReplyBtnText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      {/* ===================== COMPOSE / REPLY MODAL ===================== */}
      <Modal
        visible={composeModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setComposeModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View
            style={[
              styles.composeModalSheet,
              { backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF' },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.composeModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.composeIconWrap}>
                  <Mail size={16} color="#2563EB" />
                </View>
                <Text
                  style={[
                    styles.composeModalTitle,
                    { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                  ]}
                >
                  {replyMode === 'reply'
                    ? 'Reply Message'
                    : replyMode === 'replyAll'
                    ? 'Reply All'
                    : replyMode === 'forward'
                    ? 'Forward Message'
                    : 'New Message'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setComposeModalOpen(false)}
                style={styles.closeBtn}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              {/* To field */}
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>To:</Text>
                <TextInput
                  value={composeTo}
                  onChangeText={setComposeTo}
                  placeholder="recipient@acmecorp.com"
                  placeholderTextColor="#94A3B8"
                  style={[
                    styles.fieldInput,
                    {
                      backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',
                      borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                      color: isDarkMode ? '#FFFFFF' : '#0F172A',
                    },
                  ]}
                />
              </View>

              {/* Subject field */}
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Subject:</Text>
                <TextInput
                  value={composeSubject}
                  onChangeText={setComposeSubject}
                  placeholder="Enter email subject..."
                  placeholderTextColor="#94A3B8"
                  style={[
                    styles.fieldInput,
                    {
                      backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',
                      borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                      color: isDarkMode ? '#FFFFFF' : '#0F172A',
                    },
                  ]}
                />
              </View>

              {/* Body */}
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Message Body:</Text>
              <TextInput
                value={composeBody}
                onChangeText={setComposeBody}
                placeholder="Write your email here..."
                placeholderTextColor="#94A3B8"
                multiline
                style={[
                  styles.composeBodyInput,
                  {
                    backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',
                    borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                    color: isDarkMode ? '#FFFFFF' : '#0F172A',
                  },
                ]}
              />
            </ScrollView>

            {/* Modal Bottom Action Bar */}
            <View style={styles.composeModalActions}>
              <TouchableOpacity
                onPress={() => setComposeModalOpen(false)}
                style={[
                  styles.cancelBtn,
                  { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' },
                ]}
              >
                <Text
                  style={[
                    styles.cancelBtnText,
                    { color: isDarkMode ? '#94A3B8' : '#64748B' },
                  ]}
                >
                  Discard
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSendCompose}
                style={styles.sendConfirmBtn}
              >
                <Send size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.sendConfirmBtnText}>Send Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // View Switcher Tabs (Folders | Inbox | Reading Pane)
  viewSwitcher: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  switchTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  switchTabActive: {
    borderBottomColor: '#2563EB',
  },
  switchTabText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
  },
  switchTabTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  unreadCountPill: {
    backgroundColor: '#2563EB',
    borderRadius: 999,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 4,
  },
  unreadCountPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  // Folders View Styles
  foldersScrollView: {
    padding: 16,
  },
  foldersHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  foldersTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  refreshBtn: {
    padding: 8,
    borderRadius: 8,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  folderCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 6,
    marginBottom: 8,
  },
  folderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  folderRowText: {
    fontSize: 13.5,
  },
  folderBadge: {
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  folderBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 13.5,
  },

  // Quota Card
  quotaCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginTop: 12,
    marginBottom: 16,
  },
  quotaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quotaLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  quotaVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  quotaTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  quotaFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
  quotaSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 6,
  },

  composeFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 13,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  composeFullBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Inbox View Styles
  inboxSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    height: 38,
  },
  inboxSearchInput: {
    flex: 1,
    fontSize: 12.5,
  },
  filterBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  tabGroupLeft: {
    flexDirection: 'row',
    gap: 14,
  },
  tabUnderlineBtn: {
    paddingVertical: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabUnderlineBtnActive: {
    borderBottomColor: '#2563EB',
  },
  tabUnderlineText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabUnderlineTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  filterPillsRight: {
    flexDirection: 'row',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },
  filterPillActive: {
    backgroundColor: '#2563EB',
  },
  filterPillText: {
    fontSize: 11,
  },

  // Email Card Items
  emailCardItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  emailCardItemSelected: {
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
  },
  emailRowTop: {
    marginBottom: 4,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderAvatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  senderNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  senderNameText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  senderNameBold: {
    fontWeight: '700',
  },
  emailDateText: {
    fontSize: 11,
    color: '#94A3B8',
    marginLeft: 6,
  },
  emailSubjectSnippet: {
    fontSize: 12.5,
    marginTop: 2,
  },
  emailSubjectBold: {
    fontWeight: '700',
  },
  emailBodySnippet: {
    fontSize: 11.5,
    lineHeight: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  emailTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryTagPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  attachmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  attachmentCountText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  highPriorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  highPriorityText: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: '700',
  },
  quickIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickIconBtn: {
    padding: 4,
  },

  // FAB
  fabBtn: {
    position: 'absolute',
    right: 18,
    bottom: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },

  // Reading Pane (Detail) Styles
  detailToolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  backToInboxBtn: {
    padding: 6,
    marginRight: 6,
  },
  toolbarActionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolbarBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  toolbarBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  toolbarBtnTextMuted: {
    fontSize: 11,
    fontWeight: '500',
    color: '#475569',
  },
  dividerV: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    marginHorizontal: 8,
  },
  iconActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  smallIconBtn: {
    padding: 5,
  },

  // Reading Pane Content
  detailScrollContent: {
    padding: 16,
  },
  subjectHeaderBox: {
    marginBottom: 8,
  },
  detailSubjectText: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 23,
    marginBottom: 6,
  },
  subjectMetaRow: {
    flexDirection: 'row',
  },
  tlsSecurityRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 14,
  },
  tlsSecurityText: {
    fontSize: 10.5,
    color: '#059669',
    fontWeight: '600',
  },
  senderProfileBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  senderBigAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  senderTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  senderFullName: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  senderRoleText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '400',
  },
  senderTimeRight: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginLeft: 4,
  },
  senderAddressText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  recipientText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  flaggedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  flaggedPillText: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '700',
  },
  emailBodyContainer: {
    marginBottom: 20,
  },
  emailBodyContentText: {
    fontSize: 13.5,
    lineHeight: 22,
  },

  // Attachments
  attachmentSectionBox: {
    marginBottom: 20,
  },
  attachmentSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  attachmentsList: {
    gap: 8,
  },
  attachmentFileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  attachmentFileName: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  attachmentFileSize: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  downloadIconBtn: {
    padding: 6,
  },

  // Quick Reply
  quickReplyCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
  },
  quickReplyTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  quickReplyInput: {
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12.5,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  quickReplyActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fullEditorLink: {
    paddingVertical: 4,
  },
  fullEditorLinkText: {
    color: '#2563EB',
    fontSize: 11.5,
    fontWeight: '600',
  },
  sendQuickReplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  sendQuickReplyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Empty state
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },

  // Compose Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  composeModalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    width: '100%',
    maxHeight: '90%',
  },
  composeModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
    marginBottom: 12,
  },
  composeIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  composeModalTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
  },
  fieldRow: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  fieldInput: {
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 12.5,
  },
  composeBodyInput: {
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12.5,
    textAlignVertical: 'top',
  },
  composeModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  cancelBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  sendConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  sendConfirmBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '600',
  },
});
