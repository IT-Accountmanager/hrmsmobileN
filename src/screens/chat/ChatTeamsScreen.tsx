import React, { useState, useRef } from 'react';
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
  Users,
  MessageSquare,
  Phone,
  Video,
  Calendar,
  FileSpreadsheet,
  Download,
  Send,
  Paperclip,
  Smile,
  BarChart2,
  Lock,
  ChevronDown,
  ChevronLeft,
  X,
  Search,
  Filter,
  Pin,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Share2,
  Award,
  AlertCircle,
  Clock,
  Plus,
  Check,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ChatTeamsScreenProps {
  onNavigate?: (screenKey: string) => void;
  initialTab?: 'chat' | 'files' | 'notes' | 'calendar';
  initialView?: 'list' | 'chat';
}

interface ChannelItem {
  id: string;
  name: string;
  type: 'channel' | 'direct';
  snippet: string;
  time: string;
  unread?: number;
  avatar?: string;
  isPinned?: boolean;
  category: 'Teams' | 'Direct' | 'HR Desk';
  isOnline?: boolean;
}

interface MessageItem {
  id: string;
  sender: string;
  role?: string;
  time: string;
  avatar?: string;
  text: string;
  isMe?: boolean;
  reactions?: { emoji: string; count: number; userReacted?: boolean }[];
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
  meetingWidget?: {
    platform: string;
    title: string;
    time: string;
  };
  pollWidget?: {
    id: string;
    question: string;
    totalVotes: number;
    options: { id: string; text: string; votes: number }[];
    userVotedId?: string;
  };
}

export const ChatTeamsScreen: React.FC<ChatTeamsScreenProps> = ({
  onNavigate,
  initialTab = 'chat',
  initialView = 'list',
}) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useAppStore();
  const scrollViewRef = useRef<ScrollView>(null);

  // View state: 'list' for Channels List (Chat), or 'chat' for Active Conversation
  const [mobileView, setMobileView] = useState<'list' | 'chat'>(initialView);
  const [selectedChannelId, setSelectedChannelId] = useState('c-1');
  const [activeTab, setActiveTab] = useState<'chat' | 'files' | 'notes' | 'calendar'>(initialTab);
  const [filterCategory, setFilterCategory] = useState<'All' | 'Teams' | 'Direct' | 'HR Desk'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedOpen, setPinnedOpen] = useState(true);
  const [recentOpen, setRecentOpen] = useState(true);

  // Message input state
  const [inputText, setInputText] = useState('');
  const [meetingCallOpen, setMeetingCallOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Meeting Schedule form state
  const [meetingTitle, setMeetingTitle] = useState('General Standup & Architecture Sync');
  const [selectedPlatform, setSelectedPlatform] = useState('Microsoft Teams Meeting');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('11:30 AM - 12:15 PM');

  // Channels List (Exact replica of Left Panel)
  const [channels] = useState<ChannelItem[]>([
    {
      id: 'c-1',
      name: 'General Standup & Architecture',
      type: 'channel',
      snippet: 'Rahul: Updated the q3 sprint plan and archi...',
      time: '11:42 AM',
      unread: 2,
      isPinned: true,
      category: 'Teams',
    },
    {
      id: 'c-2',
      name: 'Engineering Squad Alpha',
      type: 'channel',
      snippet: 'Sneha: Production deployment completed smoot...',
      time: '10:15 AM',
      isPinned: true,
      category: 'Teams',
    },
    {
      id: 'c-3',
      name: 'Amit Verma',
      type: 'direct',
      snippet: 'Amit: Let us sync on the client security feedback...',
      time: '09:30 AM',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      isPinned: true,
      category: 'Direct',
      isOnline: true,
    },
    {
      id: 'c-4',
      name: 'HR Confidential & Benefits Desk',
      type: 'channel',
      snippet: 'HR Bot: Your annual leave request has been...',
      time: 'Yesterday',
      unread: 1,
      isPinned: false,
      category: 'HR Desk',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isOnline: true,
    },
    {
      id: 'c-5',
      name: 'Elena Rostova',
      type: 'direct',
      snippet: 'Elena: Shared candidate profiles for the Senior Fr...',
      time: 'Yesterday',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isPinned: false,
      category: 'Direct',
      isOnline: false,
    },
    {
      id: 'c-6',
      name: '🚀 Project Pegasus Launch Squad',
      type: 'channel',
      snippet: 'David: Beta testing signups reached 1,200 partici...',
      time: 'Aug 28',
      isPinned: false,
      category: 'Teams',
    },
  ]);

  // Feed Messages State (Exact replica of Right Panel)
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'm-1',
      sender: 'Amit Verma',
      role: 'Engineering Manager',
      time: '10:05 AM',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      text: 'Good morning team! Please review the sprint velocity chart and upcoming microservice decoupling timeline. We need sign-off before Thursday.',
      reactions: [
        { emoji: '👍', count: 5, userReacted: false },
        { emoji: '❤️', count: 2, userReacted: true },
      ],
    },
    {
      id: 'm-2',
      sender: 'Elena Rostova',
      role: 'Lead Talent Acquisition',
      time: '10:42 AM',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      text: 'Attached the revised candidate evaluation spreadsheet for our senior cloud engineer position. Take a look at the interview scorecard tabs.',
      attachment: {
        name: 'Candidate_Scorecard_Q3_Senior_Cloud.xlsx',
        size: '2.4 MB',
        type: 'EXCEL',
      },
      reactions: [{ emoji: '👏', count: 3, userReacted: false }],
    },
    {
      id: 'm-3',
      sender: 'You',
      role: 'HR Admin',
      time: '11:30 AM',
      isMe: true,
      text: 'Let us connect for our scheduled weekly standup. Click below to join the call.',
      meetingWidget: {
        platform: 'Microsoft Teams Meeting',
        title: 'General Standup & Architecture Sync',
        time: 'Today • 11:30 AM - 12:15 PM',
      },
    },
    {
      id: 'm-4',
      sender: 'Amit Verma',
      role: 'Engineering Manager',
      time: '11:35 AM',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      text: 'Please cast your vote on preferred mandatory collaboration days for the upcoming quarter.',
      pollWidget: {
        id: 'poll-1',
        question: 'Which days do you prefer for team in-office sync?',
        totalVotes: 8,
        options: [
          { id: 'opt-1', text: 'Tuesday & Thursday', votes: 5 },
          { id: 'opt-2', text: 'Monday & Wednesday', votes: 2 },
          { id: 'opt-3', text: 'Flexible Hybrid Choice', votes: 1 },
        ],
      },
    },
  ]);

  const activeChannel = channels.find((c) => c.id === selectedChannelId) || channels[0];

  const handleSelectChannel = (id: string) => {
    setSelectedChannelId(id);
    setMobileView('chat');
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      role: 'HR Admin',
      time: 'Just now',
      isMe: true,
      text: inputText.trim(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleScheduleMeeting = () => {
    if (!meetingTitle.trim()) return;
    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      role: 'HR Admin',
      time: 'Just now',
      isMe: true,
      text: `Scheduled team sync: ${meetingTitle}`,
      meetingWidget: {
        platform: selectedPlatform,
        title: meetingTitle,
        time: `${selectedDate} • ${selectedTime}`,
      },
    };
    setMessages((prev) => [...prev, newMsg]);
    setScheduleModalOpen(false);
    setActiveTab('chat');
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  const handleVotePoll = (msgId: string, optionId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId || !msg.pollWidget) return msg;
        const currentVoted = msg.pollWidget.userVotedId;
        if (currentVoted === optionId) return msg;

        const updatedOptions = msg.pollWidget.options.map((opt) => {
          if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
          if (opt.id === currentVoted) return { ...opt, votes: Math.max(0, opt.votes - 1) };
          return opt;
        });

        return {
          ...msg,
          pollWidget: {
            ...msg.pollWidget,
            totalVotes: currentVoted ? msg.pollWidget.totalVotes : msg.pollWidget.totalVotes + 1,
            userVotedId: optionId,
            options: updatedOptions,
          },
        };
      })
    );
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId || !msg.reactions) return msg;
        const updated = msg.reactions.map((r) => {
          if (r.emoji === emoji) {
            const reacted = !r.userReacted;
            return {
              ...r,
              count: reacted ? r.count + 1 : r.count - 1,
              userReacted: reacted,
            };
          }
          return r;
        });
        return { ...msg, reactions: updated };
      })
    );
  };

  const pinnedChannels = channels.filter((c) => c.isPinned);
  const recentChannels = channels.filter((c) => !c.isPinned);

  const filterChannels = (list: ChannelItem[]) => {
    return list.filter((c) => {
      const matchCat = filterCategory === 'All' || c.category === filterCategory;
      const matchQuery = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF' }]}
    >
      {/* Top Mobile View Selector Segment (Chats List vs Active Conversation) */}
      <View style={[styles.mobileViewSegment, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setMobileView('list')}
          style={[styles.segmentBtn, mobileView === 'list' && styles.segmentBtnActive]}
        >
          <MessageSquare size={14} color={mobileView === 'list' ? '#FFFFFF' : '#64748B'} style={{ marginRight: 6 }} />
          <Text style={[styles.segmentText, mobileView === 'list' && styles.segmentTextActive]}>
            Chat (6)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setMobileView('chat')}
          style={[styles.segmentBtn, mobileView === 'chat' && styles.segmentBtnActive]}
        >
          <Text style={[styles.segmentHash, mobileView === 'chat' && { color: '#FFFFFF' }]}>#</Text>
          <Text
            style={[styles.segmentText, mobileView === 'chat' && styles.segmentTextActive]}
            numberOfLines={1}
          >
            {activeChannel.name.split(' ')[0]}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ======================= VIEW A: CHAT LIST PANEL ======================= */}
      {mobileView === 'list' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
          {/* Header Row: Chat (6) + Filter & Edit icons */}
          <View style={styles.listHeaderRow}>
            <Text style={[styles.listHeaderTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
              Chat <Text style={styles.listHeaderCount}>(6)</Text>
            </Text>
            <View style={styles.listHeaderIcons}>
              <TouchableOpacity
                onPress={() => Alert.alert('Filter', 'Filter by unread, channels, or direct messages')}
                style={styles.headerActionIcon}
              >
                <Filter size={17} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Alert.alert('New Chat', 'Create a new team channel or direct message')}
                style={styles.headerActionIcon}
              >
                <MessageSquare size={17} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View
            style={[
              styles.searchBarBox,
              { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
            ]}
          >
            <Search size={15} color="#94A3B8" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search or type a command..."
              placeholderTextColor="#94A3B8"
              style={[styles.searchInput, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}
            />
          </View>

          {/* Filter Chips: All, Teams, Direct, HR Desk */}
          <View style={styles.filterChipsContainer}>
            {(['All', 'Teams', 'Direct', 'HR Desk'] as const).map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setFilterCategory(cat)}
                style={[
                  styles.catChip,
                  filterCategory === cat && styles.catChipActive,
                  { borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
                ]}
              >
                <Text
                  style={[
                    styles.catChipText,
                    filterCategory === cat && styles.catChipTextActive,
                    { color: filterCategory === cat ? '#FFFFFF' : isDarkMode ? '#CBD5E1' : '#475569' },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* PINNED (3) Section */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setPinnedOpen(!pinnedOpen)}
            style={styles.sectionToggleRow}
          >
            <View style={styles.sectionToggleLeft}>
              <ChevronDown
                size={14}
                color="#94A3B8"
                style={{ transform: [{ rotate: pinnedOpen ? '0deg' : '-90deg' }] }}
              />
              <Text style={styles.sectionTitleText}>PINNED (3)</Text>
            </View>
            <Pin size={12} color="#94A3B8" />
          </TouchableOpacity>

          {pinnedOpen &&
            filterChannels(pinnedChannels).map((channel) => {
              const isSelected = channel.id === selectedChannelId;
              return (
                <TouchableOpacity
                  key={channel.id}
                  activeOpacity={0.7}
                  onPress={() => handleSelectChannel(channel.id)}
                  style={[
                    styles.channelRow,
                    isSelected && [
                      styles.channelRowActive,
                      { backgroundColor: isDarkMode ? '#1E293B' : '#EEF2FF' },
                    ],
                  ]}
                >
                  {channel.type === 'channel' ? (
                    <View style={styles.channelSquareIcon}>
                      <Text style={styles.channelSquareHash}>#</Text>
                    </View>
                  ) : (
                    <View style={styles.avatarWrap}>
                      <Image source={{ uri: channel.avatar }} style={styles.directAvatarImg} />
                      {channel.isOnline && <View style={styles.greenOnlineDot} />}
                    </View>
                  )}

                  <View style={styles.channelRowCenter}>
                    <View style={styles.channelTitleRow}>
                      <Text
                        style={[
                          styles.channelItemName,
                          { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                        ]}
                        numberOfLines={1}
                      >
                        {channel.name}
                      </Text>
                      <Text style={styles.channelItemTime}>{channel.time}</Text>
                    </View>
                    <View style={styles.channelSnippetRow}>
                      <Text style={styles.channelSnippetText} numberOfLines={1}>
                        {channel.snippet}
                      </Text>
                      {channel.unread ? (
                        <View style={styles.blueUnreadBadge}>
                          <Text style={styles.blueUnreadBadgeText}>{channel.unread}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

          {/* RECENT (3) Section */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setRecentOpen(!recentOpen)}
            style={[styles.sectionToggleRow, { marginTop: 14 }]}
          >
            <View style={styles.sectionToggleLeft}>
              <ChevronDown
                size={14}
                color="#94A3B8"
                style={{ transform: [{ rotate: recentOpen ? '0deg' : '-90deg' }] }}
              />
              <Text style={styles.sectionTitleText}>RECENT (3)</Text>
            </View>
          </TouchableOpacity>

          {recentOpen &&
            filterChannels(recentChannels).map((channel) => {
              const isSelected = channel.id === selectedChannelId;
              return (
                <TouchableOpacity
                  key={channel.id}
                  activeOpacity={0.7}
                  onPress={() => handleSelectChannel(channel.id)}
                  style={[
                    styles.channelRow,
                    isSelected && [
                      styles.channelRowActive,
                      { backgroundColor: isDarkMode ? '#1E293B' : '#EEF2FF' },
                    ],
                  ]}
                >
                  {channel.type === 'channel' ? (
                    <View style={styles.channelSquareIcon}>
                      <Text style={styles.channelSquareHash}>#</Text>
                    </View>
                  ) : (
                    <View style={styles.avatarWrap}>
                      <Image source={{ uri: channel.avatar }} style={styles.directAvatarImg} />
                      <View
                        style={[
                          styles.greenOnlineDot,
                          !channel.isOnline && { backgroundColor: '#94A3B8' },
                        ]}
                      />
                    </View>
                  )}

                  <View style={styles.channelRowCenter}>
                    <View style={styles.channelTitleRow}>
                      <Text
                        style={[
                          styles.channelItemName,
                          { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                        ]}
                        numberOfLines={1}
                      >
                        {channel.name}
                      </Text>
                      <Text style={styles.channelItemTime}>{channel.time}</Text>
                    </View>
                    <View style={styles.channelSnippetRow}>
                      <Text style={styles.channelSnippetText} numberOfLines={1}>
                        {channel.snippet}
                      </Text>
                      {channel.unread ? (
                        <View style={styles.blueUnreadBadge}>
                          <Text style={styles.blueUnreadBadgeText}>{channel.unread}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      ) : (
        /* ======================= VIEW B: CONVERSATION VIEW ======================= */
        <View style={styles.chatViewFlex}>
          {/* Header Bar */}
          <View
            style={[
              styles.chatHeaderBar,
              {
                backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
                borderBottomColor: isDarkMode ? '#1E293B' : '#E2E8F0',
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => setMobileView('list')}
              style={styles.backBtn}
            >
              <ChevronLeft size={20} color="#2563EB" />
            </TouchableOpacity>

            <View style={styles.channelSquareIcon}>
              <Text style={styles.channelSquareHash}>#</Text>
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text
                style={[
                  styles.activeHeaderTitle,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                ]}
                numberOfLines={1}
              >
                {activeChannel.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={styles.activeHeaderSub}>18 team members • </Text>
                <View style={styles.onlineDotMini} />
                <Text style={styles.activeHeaderSub}>5 online</Text>
              </View>
            </View>

            {/* Call & Meet Buttons */}
            <View style={styles.headerCallActions}>
              <TouchableOpacity
                onPress={() => setMeetingCallOpen(true)}
                style={styles.callIconBtn}
              >
                <Phone size={16} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMeetingCallOpen(true)}
                style={styles.meetPillBtn}
              >
                <Video size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.meetPillText}>Meet</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sub-Tabs: Chat | Files (3) | Notes */}
          <View
            style={[
              styles.chatSubTabs,
              {
                backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
                borderBottomColor: isDarkMode ? '#1E293B' : '#F1F5F9',
              },
            ]}
          >
            <View style={styles.subTabsGroup}>
              <TouchableOpacity
                onPress={() => setActiveTab('chat')}
                style={[styles.subTabItem, activeTab === 'chat' && styles.subTabItemActive]}
              >
                <MessageSquare size={13} color={activeTab === 'chat' ? '#4F46E5' : '#64748B'} style={{ marginRight: 4 }} />
                <Text style={[styles.subTabText, activeTab === 'chat' && styles.subTabTextActive]}>
                  Chat
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('files')}
                style={[styles.subTabItem, activeTab === 'files' && styles.subTabItemActive]}
              >
                <Text style={[styles.subTabText, activeTab === 'files' && styles.subTabTextActive]}>
                  Files 3
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('notes')}
                style={[styles.subTabItem, activeTab === 'notes' && styles.subTabItemActive]}
              >
                <Text style={[styles.subTabText, activeTab === 'notes' && styles.subTabTextActive]}>
                  Notes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('calendar')}
                style={[styles.subTabItem, activeTab === 'calendar' && styles.subTabItemActive]}
              >
                <Calendar size={13} color={activeTab === 'calendar' ? '#4F46E5' : '#64748B'} style={{ marginRight: 4 }} />
                <Text style={[styles.subTabText, activeTab === 'calendar' && styles.subTabTextActive]}>
                  Calendar
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.encryptionRibbon}>
              <Lock size={10} color="#10B981" style={{ marginRight: 4 }} />
              <Text style={styles.encryptionText}>End-to-End Encryption</Text>
            </View>
          </View>

          {/* Messages Feed */}
          {activeTab === 'chat' ? (
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.messagesScrollView}
            >
              {/* Date Marker */}
              <View style={styles.dateMarkerWrap}>
                <View style={styles.dateMarkerBox}>
                  <Text style={styles.dateMarkerText}>Today, September 10, 2026</Text>
                </View>
              </View>

              {messages.map((msg) => {
                const isMe = msg.isMe;
                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.msgBubbleRow,
                      isMe ? styles.msgBubbleRowMe : styles.msgBubbleRowOther,
                    ]}
                  >
                    {!isMe && (
                      <Image
                        source={{
                          uri:
                            msg.avatar ||
                            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                        }}
                        style={styles.msgAvatarImg}
                      />
                    )}

                    <View style={[styles.msgContentBlock, isMe && { alignItems: 'flex-end' }]}>
                      {/* Sender Name, Role & Timestamp */}
                      {!isMe && (
                        <View style={styles.senderInfoRow}>
                          <Text
                            style={[
                              styles.senderName,
                              { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                            ]}
                          >
                            {msg.sender}
                          </Text>
                          {msg.role && <Text style={styles.senderRole}>({msg.role})</Text>}
                          <Text style={styles.senderTimestamp}>{msg.time}</Text>
                        </View>
                      )}

                      {/* Main Message Bubble */}
                      <View
                        style={[
                          styles.bubbleCard,
                          isMe
                            ? styles.bubbleCardMe
                            : [
                              styles.bubbleCardOther,
                              {
                                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                              },
                            ],
                        ]}
                      >
                        <Text
                          style={[
                            styles.bubbleText,
                            { color: isMe ? '#FFFFFF' : isDarkMode ? '#E2E8F0' : '#1E293B' },
                          ]}
                        >
                          {msg.text}
                        </Text>

                        {/* Excel Attachment Card */}
                        {msg.attachment && (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => Alert.alert('Download', `Downloading ${msg.attachment?.name}`)}
                            style={[
                              styles.excelCard,
                              {
                                backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                              },
                            ]}
                          >
                            <View style={styles.excelSquare}>
                              <FileSpreadsheet size={18} color="#10B981" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 10 }}>
                              <Text
                                style={[
                                  styles.excelTitle,
                                  { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                                ]}
                                numberOfLines={1}
                              >
                                {msg.attachment.name}
                              </Text>
                              <Text style={styles.excelMeta}>{msg.attachment.size} • EXCEL</Text>
                            </View>
                            <Download size={15} color="#64748B" />
                          </TouchableOpacity>
                        )}

                        {/* Microsoft Teams Meeting Card */}
                        {msg.meetingWidget && (
                          <View style={styles.teamsMeetingWidget}>
                            <View style={styles.teamsMeetingHeader}>
                              <Video size={14} color="#93C5FD" />
                              <Text style={styles.teamsMeetingPlatform}>
                                {msg.meetingWidget.platform}
                              </Text>
                            </View>
                            <Text style={styles.teamsMeetingTitle}>
                              {msg.meetingWidget.title}
                            </Text>
                            <View style={styles.teamsMeetingTimeRow}>
                              <Calendar size={12} color="#93C5FD" />
                              <Text style={styles.teamsMeetingTimeText}>
                                {msg.meetingWidget.time}
                              </Text>
                            </View>
                            <TouchableOpacity
                              activeOpacity={0.85}
                              onPress={() => setMeetingCallOpen(true)}
                              style={styles.joinCallBtn}
                            >
                              <Video size={13} color="#FFFFFF" style={{ marginRight: 6 }} />
                              <Text style={styles.joinCallBtnText}>Join Meeting</Text>
                            </TouchableOpacity>
                          </View>
                        )}

                        {/* Teams Poll Card */}
                        {msg.pollWidget && (
                          <View
                            style={[
                              styles.pollWidgetCard,
                              {
                                backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                              },
                            ]}
                          >
                            <View style={styles.pollTitleRow}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <BarChart2 size={14} color="#6366F1" />
                                <Text style={styles.pollBadgeTitle}>Teams Poll</Text>
                              </View>
                              <Text style={styles.pollTotalVotesText}>
                                {msg.pollWidget.totalVotes} votes
                              </Text>
                            </View>

                            <Text
                              style={[
                                styles.pollQuestionText,
                                { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                              ]}
                            >
                              {msg.pollWidget.question}
                            </Text>

                            <View style={styles.pollChoicesList}>
                              {msg.pollWidget.options.map((opt) => {
                                const isSelected = msg.pollWidget?.userVotedId === opt.id;
                                const total = msg.pollWidget?.totalVotes || 1;
                                const percent = Math.round((opt.votes / total) * 100);

                                return (
                                  <TouchableOpacity
                                    key={opt.id}
                                    activeOpacity={0.8}
                                    onPress={() => handleVotePoll(msg.id, opt.id)}
                                    style={[
                                      styles.pollOptionRow,
                                      {
                                        backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                                        borderColor: isSelected
                                          ? '#4F46E5'
                                          : isDarkMode
                                            ? '#334155'
                                            : '#E2E8F0',
                                      },
                                    ]}
                                  >
                                    <View
                                      style={[
                                        styles.pollProgressFill,
                                        {
                                          width: `${percent}%`,
                                          backgroundColor: isSelected
                                            ? 'rgba(79, 70, 229, 0.15)'
                                            : isDarkMode
                                              ? 'rgba(51, 65, 85, 0.45)'
                                              : '#F1F5F9',
                                        },
                                      ]}
                                    />
                                    <View style={styles.pollOptionContent}>
                                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <View
                                          style={[
                                            styles.customRadio,
                                            isSelected && styles.customRadioActive,
                                          ]}
                                        >
                                          {isSelected && <View style={styles.customRadioDot} />}
                                        </View>
                                        <Text
                                          style={[
                                            styles.pollOptionTitle,
                                            { color: isDarkMode ? '#FFFFFF' : '#1E293B' },
                                          ]}
                                        >
                                          {opt.text}
                                        </Text>
                                      </View>
                                      <Text style={styles.pollPercent}>
                                        {opt.votes} ({percent}%)
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          </View>
                        )}
                      </View>

                      {/* Emoji Reactions Row */}
                      {msg.reactions && (
                        <View style={styles.msgReactionsRow}>
                          {msg.reactions.map((r, rIdx) => (
                            <TouchableOpacity
                              key={rIdx}
                              activeOpacity={0.7}
                              onPress={() => handleToggleReaction(msg.id, r.emoji)}
                              style={[
                                styles.msgReactionPill,
                                r.userReacted && styles.msgReactionPillActive,
                              ]}
                            >
                              <Text style={styles.msgReactionEmoji}>{r.emoji}</Text>
                              <Text style={styles.msgReactionCount}>{r.count}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          ) : activeTab === 'files' ? (
            <ScrollView contentContainerStyle={{ padding: 14, gap: 10 }}>
              {[
                { name: 'Candidate_Scorecard_Q3_Senior_Cloud.xlsx', size: '2.4 MB', uploader: 'Elena Rostova', date: 'Today' },
                { name: 'Sprint_Velocity_Q3.pdf', size: '4.8 MB', uploader: 'Amit Verma', date: 'Yesterday' },
                { name: 'Architecture_Diagram_v2.png', size: '1.2 MB', uploader: 'Rahul', date: 'Sep 8' },
              ].map((f, i) => (
                <View
                  key={i}
                  style={[
                    styles.fileListItem,
                    { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
                  ]}
                >
                  <FileSpreadsheet size={22} color="#10B981" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.fileNameText, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                      {f.name}
                    </Text>
                    <Text style={styles.fileMetaText}>{f.size} • Shared by {f.uploader}</Text>
                  </View>
                  <TouchableOpacity onPress={() => Alert.alert('Download', `Downloading ${f.name}`)}>
                    <Download size={16} color="#2563EB" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : activeTab === 'notes' ? (
            <ScrollView contentContainerStyle={{ padding: 14 }}>
              <View
                style={[
                  styles.notesCard,
                  { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
                ]}
              >
                <Text style={[styles.notesHeader, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                  Weekly Standup Agenda & Notes
                </Text>
                <Text style={styles.notesDate}>Updated Today • Amit Verma</Text>
                <Text style={[styles.notesBody, { color: isDarkMode ? '#CBD5E1' : '#475569' }]}>
                  • Review sprint velocity chart and microservice decoupling.{'\n'}
                  • Sign off before Thursday.{'\n'}
                  • Candidate scorecard review for Senior Cloud Engineer.{'\n'}
                  • Cast vote for mandatory in-office collaboration schedule.
                </Text>
              </View>
            </ScrollView>
          ) : (
            <ScrollView contentContainerStyle={{ padding: 14, gap: 12 }}>
              {/* Calendar Action Header */}
              <View
                style={[
                  styles.calendarHeaderCard,
                  { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.calendarCardTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                    Microsoft Teams Calendar
                  </Text>
                  <Text style={styles.calendarCardSub}>
                    Today • Tuesday, September 15, 2026
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setScheduleModalOpen(true)}
                  style={styles.scheduleActionBtn}
                >
                  <Plus size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.scheduleActionBtnText}>Schedule</Text>
                </TouchableOpacity>
              </View>

              {/* Scheduled Meetings List */}
              {[
                {
                  id: 'meet-1',
                  title: 'General Standup & Architecture Sync',
                  time: 'Today • 11:30 AM - 12:15 PM',
                  platform: 'Microsoft Teams',
                  host: 'Amit Verma (Engineering Manager)',
                  status: 'Live Now',
                  isLive: true,
                },
                {
                  id: 'meet-2',
                  title: 'Sprint Backlog Grooming & Tech Debt',
                  time: 'Today • 03:00 PM - 04:00 PM',
                  platform: 'Microsoft Teams',
                  host: 'Elena Rostova',
                  status: 'Upcoming',
                  isLive: false,
                },
                {
                  id: 'meet-3',
                  title: 'Client Security Review & Cloud Architecture',
                  time: 'Tomorrow • 10:00 AM - 11:00 AM',
                  platform: 'Microsoft Teams',
                  host: 'David Kim',
                  status: 'Scheduled',
                  isLive: false,
                },
                {
                  id: 'meet-4',
                  title: '1-on-1 Sync with Engineering Manager',
                  time: 'Thursday • 02:00 PM - 02:30 PM',
                  platform: 'Microsoft Teams',
                  host: 'Amit Verma',
                  status: 'Scheduled',
                  isLive: false,
                },
              ].map((m) => (
                <View
                  key={m.id}
                  style={[
                    styles.meetingEventCard,
                    {
                      backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                      borderColor: m.isLive ? '#3B82F6' : isDarkMode ? '#334155' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={styles.meetingEventHeader}>
                    <View style={styles.platformBadge}>
                      <Video size={12} color="#2563EB" style={{ marginRight: 4 }} />
                      <Text style={styles.platformBadgeText}>{m.platform}</Text>
                    </View>
                    {m.isLive ? (
                      <View style={styles.livePill}>
                        <View style={styles.livePillDot} />
                        <Text style={styles.livePillText}>Live Now</Text>
                      </View>
                    ) : (
                      <Text style={styles.statusMutedText}>{m.status}</Text>
                    )}
                  </View>

                  <Text style={[styles.meetingEventTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                    {m.title}
                  </Text>

                  <View style={styles.meetingEventTimeRow}>
                    <Clock size={13} color="#64748B" style={{ marginRight: 6 }} />
                    <Text style={styles.meetingEventTimeText}>{m.time}</Text>
                  </View>

                  <Text style={styles.meetingHostText}>Organized by {m.host}</Text>

                  <View style={styles.meetingEventActions}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => setMeetingCallOpen(true)}
                      style={[
                        styles.joinMeetingButton,
                        m.isLive && { backgroundColor: '#2563EB' },
                      ]}
                    >
                      <Video size={13} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.joinMeetingButtonText}>
                        {m.isLive ? 'Join Meeting Now' : 'Open Video Room'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Bottom Chat Input Bar with Rich Toolbar */}
          <View
            style={[
              styles.chatInputBar,
              {
                backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
                borderTopColor: isDarkMode ? '#1E293B' : '#E2E8F0',
                paddingBottom: Math.max(insets.bottom, 8),
              },
            ]}
          >
            <View style={styles.inputInnerRow}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message in General Standup & Architecture..."
                placeholderTextColor="#94A3B8"
                style={[
                  styles.textMessageInput,
                  {
                    backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',
                    borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                    color: isDarkMode ? '#FFFFFF' : '#0F172A',
                  },
                ]}
              />
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSendMessage}
                style={styles.sendIconBtn}
              >
                <Send size={15} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            {/* Formatting & Media Toolbar Row (Matching Image bottom) */}
            <View style={styles.richToolbarRow}>
              <TouchableOpacity style={styles.toolBtn}>
                <Text style={styles.toolLetter}>A</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolBtn}>
                <AlertCircle size={15} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Alert.alert('Attach File', 'Select document or image')}
                style={styles.toolBtn}
              >
                <Paperclip size={15} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setInputText((prev) => prev + ' 😊')}
                style={styles.toolBtn}
              >
                <Smile size={15} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolBtn}>
                <Text style={styles.toolGif}>GIF</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolBtn}>
                <Award size={15} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Alert.alert('Teams Poll', 'Poll creation form')}
                style={styles.toolBtn}
              >
                <BarChart2 size={15} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setScheduleModalOpen(true)}
                style={styles.toolBtn}
              >
                <Calendar size={15} color="#2563EB" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Video Call Modal */}
      <Modal
        visible={meetingCallOpen}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setMeetingCallOpen(false)}
      >
        <View style={styles.videoRoomWrap}>
          <View style={styles.videoRoomHeader}>
            <View style={styles.recBadge}>
              <View style={styles.recDot} />
              <Text style={styles.recText}>REC 00:14:28</Text>
            </View>
            <Text style={styles.videoRoomTitle}>General Standup & Architecture</Text>
            <TouchableOpacity onPress={() => setMeetingCallOpen(false)}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.videoGridWrap}>
            <View style={styles.videoTileBox}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
                }}
                style={styles.videoTilePhoto}
              />
              <View style={styles.tileTag}>
                <Text style={styles.tileTagText}>Amit Verma (Speaking)</Text>
              </View>
            </View>

            <View style={styles.videoTileBox}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
                }}
                style={styles.videoTilePhoto}
              />
              <View style={styles.tileTag}>
                <Text style={styles.tileTagText}>Elena Rostova</Text>
              </View>
            </View>
          </View>

          <View style={styles.videoControls}>
            <TouchableOpacity
              onPress={() => setIsMuted(!isMuted)}
              style={[styles.callControlBtn, isMuted && styles.callControlBtnRed]}
            >
              {isMuted ? <MicOff size={20} color="#FFFFFF" /> : <Mic size={20} color="#FFFFFF" />}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsVideoOff(!isVideoOff)}
              style={[styles.callControlBtn, isVideoOff && styles.callControlBtnRed]}
            >
              {isVideoOff ? <VideoOff size={20} color="#FFFFFF" /> : <Video size={20} color="#FFFFFF" />}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Alert.alert('Share', 'Sharing screen on mobile')}
              style={styles.callControlBtn}
            >
              <Share2 size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMeetingCallOpen(false)}
              style={styles.endCallBtn}
            >
              <PhoneOff size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Schedule Meeting Modal */}
      <Modal
        visible={scheduleModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setScheduleModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View
            style={[
              styles.scheduleModalSheet,
              { backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF' },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.scheduleModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.modalCalIconWrap}>
                  <Calendar size={18} color="#2563EB" />
                </View>
                <View>
                  <Text
                    style={[
                      styles.scheduleModalTitle,
                      { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                    ]}
                  >
                    Schedule Meeting
                  </Text>
                  <Text style={styles.scheduleModalSub}>
                    Microsoft Teams & Channel Sync
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setScheduleModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              {/* Meeting Title Input */}
              <Text style={[styles.fieldLabel, { color: isDarkMode ? '#E2E8F0' : '#334155' }]}>
                Meeting Topic
              </Text>
              <TextInput
                value={meetingTitle}
                onChangeText={setMeetingTitle}
                placeholder="e.g. Sprint Backlog Grooming"
                placeholderTextColor="#94A3B8"
                style={[
                  styles.modalTextInput,
                  {
                    backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',
                    borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                    color: isDarkMode ? '#FFFFFF' : '#0F172A',
                  },
                ]}
              />

              {/* Platform Selector */}
              <Text style={[styles.fieldLabel, { color: isDarkMode ? '#E2E8F0' : '#334155', marginTop: 14 }]}>
                Platform
              </Text>
              <View style={styles.pillRow}>
                {['Microsoft Teams Meeting', 'Google Meet', 'In-Person Sync'].map((p) => {
                  const isSel = selectedPlatform === p;
                  return (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setSelectedPlatform(p)}
                      style={[
                        styles.chipPill,
                        isSel
                          ? { backgroundColor: '#2563EB', borderColor: '#2563EB' }
                          : {
                            backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9',
                            borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                          },
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipPillText,
                          { color: isSel ? '#FFFFFF' : isDarkMode ? '#CBD5E1' : '#475569' },
                        ]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Date Selector */}
              <Text style={[styles.fieldLabel, { color: isDarkMode ? '#E2E8F0' : '#334155', marginTop: 14 }]}>
                Date
              </Text>
              <View style={styles.pillRow}>
                {['Today', 'Tomorrow', 'Thursday', 'Friday'].map((d) => {
                  const isSel = selectedDate === d;
                  return (
                    <TouchableOpacity
                      key={d}
                      onPress={() => setSelectedDate(d)}
                      style={[
                        styles.chipPill,
                        isSel
                          ? { backgroundColor: '#2563EB', borderColor: '#2563EB' }
                          : {
                            backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9',
                            borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                          },
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipPillText,
                          { color: isSel ? '#FFFFFF' : isDarkMode ? '#CBD5E1' : '#475569' },
                        ]}
                      >
                        {d}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Time Slots */}
              <Text style={[styles.fieldLabel, { color: isDarkMode ? '#E2E8F0' : '#334155', marginTop: 14 }]}>
                Time Slot
              </Text>
              <View style={styles.pillRow}>
                {[
                  '11:30 AM - 12:15 PM',
                  '02:00 PM - 02:45 PM',
                  '03:30 PM - 04:15 PM',
                  '05:00 PM - 05:45 PM',
                ].map((t) => {
                  const isSel = selectedTime === t;
                  return (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setSelectedTime(t)}
                      style={[
                        styles.chipPill,
                        isSel
                          ? { backgroundColor: '#2563EB', borderColor: '#2563EB' }
                          : {
                            backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9',
                            borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                          },
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipPillText,
                          { color: isSel ? '#FFFFFF' : isDarkMode ? '#CBD5E1' : '#475569' },
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                onPress={() => setScheduleModalOpen(false)}
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
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleScheduleMeeting}
                style={styles.confirmScheduleBtn}
              >
                <Calendar size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.confirmScheduleBtnText}>Post to Channel</Text>
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
  mobileViewSegment: {
    flexDirection: 'row',
    padding: 6,
    marginHorizontal: 14,
    marginTop: 8,
    borderRadius: 14,
    gap: 6,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  segmentHash: {
    fontSize: 15,
    fontWeight: '900',
    color: '#64748B',
    marginRight: 4,
  },
  listContainer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 24,
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  listHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  listHeaderCount: {
    color: '#64748B',
    fontWeight: '600',
  },
  listHeaderIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerActionIcon: {
    padding: 4,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    padding: 0,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#F8FAFC',
  },
  catChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  catChipText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  catChipTextActive: {
    color: '#FFFFFF',
  },
  sectionToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginBottom: 4,
  },
  sectionToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitleText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 2,
  },
  channelRowActive: {
    borderLeftWidth: 3,
    borderLeftColor: '#4F46E5',
  },
  channelSquareIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelSquareHash: {
    fontSize: 16,
    fontWeight: '900',
    color: '#4F46E5',
  },
  avatarWrap: {
    position: 'relative',
  },
  directAvatarImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
  },
  greenOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  channelRowCenter: {
    flex: 1,
    marginLeft: 10,
  },
  channelTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  channelItemName: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: 6,
  },
  channelItemTime: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  channelSnippetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  channelSnippetText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  blueUnreadBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    marginLeft: 6,
  },
  blueUnreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  chatViewFlex: {
    flex: 1,
  },
  chatHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
    marginRight: 4,
  },
  activeHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  activeHeaderSub: {
    fontSize: 10.5,
    color: '#64748B',
  },
  onlineDotMini: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  headerCallActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callIconBtn: {
    padding: 6,
  },
  meetPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  meetPillText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  chatSubTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  subTabsGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  subTabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  subTabItemActive: {
    borderBottomColor: '#4F46E5',
  },
  subTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  subTabTextActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  encryptionRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  encryptionText: {
    fontSize: 9.5,
    color: '#10B981',
    fontWeight: '600',
  },
  messagesScrollView: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 20,
  },
  dateMarkerWrap: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateMarkerBox: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  dateMarkerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  msgBubbleRow: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  msgBubbleRowOther: {
    justifyContent: 'flex-start',
  },
  msgBubbleRowMe: {
    justifyContent: 'flex-end',
  },
  msgAvatarImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 2,
  },
  msgContentBlock: {
    maxWidth: '88%',
  },
  senderInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
    paddingLeft: 2,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '700',
  },
  senderRole: {
    fontSize: 10.5,
    color: '#64748B',
  },
  senderTimestamp: {
    fontSize: 9.5,
    color: '#94A3B8',
  },
  bubbleCard: {
    borderRadius: 14,
    padding: 10,
  },
  bubbleCardOther: {
    borderWidth: 1,
    borderTopLeftRadius: 4,
  },
  bubbleCardMe: {
    backgroundColor: '#3B82F6',
    borderTopRightRadius: 4,
  },
  bubbleText: {
    fontSize: 12.5,
    lineHeight: 17,
  },
  excelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    padding: 8,
    marginTop: 8,
  },
  excelSquare: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  excelTitle: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  excelMeta: {
    fontSize: 9.5,
    color: '#64748B',
  },
  teamsMeetingWidget: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
  },
  teamsMeetingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  teamsMeetingPlatform: {
    color: '#93C5FD',
    fontSize: 10.5,
    fontWeight: '600',
  },
  teamsMeetingTitle: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
    marginBottom: 3,
  },
  teamsMeetingTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  teamsMeetingTimeText: {
    color: '#BFDBFE',
    fontSize: 10.5,
  },
  joinCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 6,
    borderRadius: 8,
  },
  joinCallBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  pollWidgetCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    marginTop: 8,
  },
  pollTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pollBadgeTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#6366F1',
  },
  pollTotalVotesText: {
    fontSize: 10,
    color: '#64748B',
  },
  pollQuestionText: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  pollChoicesList: {
    gap: 5,
  },
  pollOptionRow: {
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  pollProgressFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  pollOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customRadio: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customRadioActive: {
    borderColor: '#4F46E5',
  },
  customRadioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4F46E5',
  },
  pollOptionTitle: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  pollPercent: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  msgReactionsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 3,
  },
  msgReactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 3,
  },
  msgReactionPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  msgReactionEmoji: {
    fontSize: 10,
  },
  msgReactionCount: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  chatInputBar: {
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  inputInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textMessageInput: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 12.5,
  },
  sendIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  richToolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 6,
    paddingHorizontal: 4,
  },
  toolBtn: {
    padding: 2,
  },
  toolLetter: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  toolGif: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
  },
  fileListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  fileNameText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  fileMetaText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  notesCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  notesHeader: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  notesDate: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 6,
  },
  notesBody: {
    fontSize: 12,
    lineHeight: 18,
  },
  videoRoomWrap: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 14,
  },
  videoRoomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  recBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 5,
  },
  recDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  recText: {
    color: '#EF4444',
    fontSize: 9.5,
    fontWeight: '700',
  },
  videoRoomTitle: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  videoGridWrap: {
    flex: 1,
    gap: 10,
  },
  videoTileBox: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E293B',
  },
  videoTilePhoto: {
    width: '100%',
    height: '100%',
  },
  tileTag: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tileTagText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '600',
  },
  videoControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    paddingTop: 14,
  },
  callControlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callControlBtnRed: {
    backgroundColor: '#EF4444',
  },
  endCallBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Calendar Tab Styles
  calendarHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  calendarCardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  calendarCardSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  scheduleActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  scheduleActionBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '600',
  },
  meetingEventCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  meetingEventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  platformBadgeText: {
    color: '#2563EB',
    fontSize: 10.5,
    fontWeight: '600',
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 4,
  },
  livePillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  livePillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  statusMutedText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  meetingEventTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  meetingEventTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  meetingEventTimeText: {
    fontSize: 12,
    color: '#64748B',
  },
  meetingHostText: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 12,
  },
  meetingEventActions: {
    flexDirection: 'row',
  },
  joinMeetingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinMeetingButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Schedule Meeting Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  scheduleModalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    width: '100%',
    maxHeight: '90%',
  },
  scheduleModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
    marginBottom: 12,
  },
  modalCalIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleModalTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  scheduleModalSub: {
    fontSize: 11,
    color: '#64748B',
  },
  modalCloseBtn: {
    padding: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  modalTextInput: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipPillText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
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
  confirmScheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  confirmScheduleBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '600',
  },
});
