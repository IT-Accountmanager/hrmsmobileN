import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ModalSheet } from '../../components/ui/ModalSheet';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { SelectPicker } from '../../components/ui/SelectPicker';
import { leaveService } from '../../services/leaveService';
import { Calendar, FileText } from 'lucide-react-native';

interface ApplyLeaveModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('2025-05-27');
  const [endDate, setEndDate] = useState('2025-05-28');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const leaveTypeOptions = [
    { label: 'Casual Leave (10 days left)', value: 'Casual Leave' },
    { label: 'Sick Leave (8 days left)', value: 'Sick Leave' },
    { label: 'Earned Leave (6 days left)', value: 'Earned Leave' },
    { label: 'Unpaid Leave', value: 'Unpaid Leave' },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await leaveService.applyLeave({
        type: leaveType,
        startDate,
        endDate,
        days: 2,
        reason: reason || 'Personal family matter',
      });
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalSheet
      visible={visible}
      onClose={onClose}
      title="Apply for Leave"
      subtitle="Submit request for supervisor and HR review"
    >
      <View style={styles.form}>
        <SelectPicker
          label="Leave Type"
          value={leaveType}
          options={leaveTypeOptions}
          onSelect={setLeaveType}
        />

        <Input
          label="Start Date (YYYY-MM-DD)"
          value={startDate}
          onChangeText={setStartDate}
          placeholder="e.g. 2025-05-27"
          leftIcon={<Calendar size={16} color="#94A3B8" />}
        />

        <Input
          label="End Date (YYYY-MM-DD)"
          value={endDate}
          onChangeText={setEndDate}
          placeholder="e.g. 2025-05-28"
          leftIcon={<Calendar size={16} color="#94A3B8" />}
        />

        <Input
          label="Reason for Leave"
          value={reason}
          onChangeText={setReason}
          placeholder="Enter explanation for absence..."
          multiline
          numberOfLines={3}
          leftIcon={<FileText size={16} color="#94A3B8" />}
        />

        <Button
          title="Submit Leave Application"
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitBtn}
        />
      </View>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  form: {
    paddingBottom: 16,
  },
  submitBtn: {
    marginTop: 10,
  },
});
