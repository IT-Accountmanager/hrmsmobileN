import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { INITIAL_ANNOUNCEMENTS } from '../../services/mockDb';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors, typography, colors, radii } from '../../theme';
import { Megaphone, User, Clock } from 'lucide-react-native';

export const AnnouncementsScreen: React.FC = () => {
  const { isDarkMode } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.titleSection}>
        <Text style={[styles.screenTitle, { color: theme.text }]}>
          Company Announcements
        </Text>
        <Text style={[styles.screenSubtitle, { color: theme.subtext }]}>
          Official organizational news, policy updates, and team broadcasts.
        </Text>
      </View>

      {INITIAL_ANNOUNCEMENTS.map((anc) => (
        <Card key={anc.id} style={styles.card} padding={16}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrap}>
              <Megaphone size={18} color={colors.accentBlue} />
            </View>
            <View style={styles.titleWrap}>
              <Text style={[styles.ancTitle, { color: theme.text }]}>
                {anc.title}
              </Text>
              <Text style={[styles.ancMeta, { color: theme.muted }]}>
                {anc.author} • {anc.time}
              </Text>
            </View>
            <Badge variant="info" size="sm">
              {anc.category || 'General'}
            </Badge>
          </View>

          <Text style={[styles.ancContent, { color: theme.subtext }]}>
            {anc.content}
          </Text>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
    paddingBottom: 24,
  },
  titleSection: {
    marginBottom: 14,
  },
  screenTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.black,
  },
  screenSubtitle: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleWrap: {
    flex: 1,
    paddingRight: 6,
  },
  ancTitle: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
  },
  ancMeta: {
    fontSize: 10.5,
    marginTop: 2,
  },
  ancContent: {
    fontSize: 11.5,
    lineHeight: 17,
  },
});
