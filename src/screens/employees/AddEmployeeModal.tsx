import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ModalSheet } from '../../components/ui/ModalSheet';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { SelectPicker } from '../../components/ui/SelectPicker';
import { employeeService } from '../../services/employeeService';
import { User, Mail, Phone, Building, Briefcase } from 'lucide-react-native';

interface AddEmployeeModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);

  const deptOptions = [
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Design & Engineering', value: 'Design & Engineering' },
    { label: 'Human Resources', value: 'Human Resources' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Finance', value: 'Finance' },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await employeeService.createEmployee({
        firstName: firstName || 'Jane',
        lastName: lastName || 'Doe',
        email: email || 'jane.doe@acmecorp.com',
        phone: phone || '+1 (555) 123-4567',
        department,
        designation: designation || 'Software Engineer',
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
      title="Onboard New Employee"
      subtitle="Enter workforce details to create employee profile"
    >
      <View style={styles.form}>
        <Input
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="e.g. John"
          leftIcon={<User size={16} color="#94A3B8" />}
        />

        <Input
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholder="e.g. Doe"
          leftIcon={<User size={16} color="#94A3B8" />}
        />

        <Input
          label="Work Email"
          value={email}
          onChangeText={setEmail}
          placeholder="e.g. john.doe@acmecorp.com"
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Mail size={16} color="#94A3B8" />}
        />

        <Input
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          placeholder="+1 (555) 000-0000"
          keyboardType="phone-pad"
          leftIcon={<Phone size={16} color="#94A3B8" />}
        />

        <SelectPicker
          label="Department"
          value={department}
          options={deptOptions}
          onSelect={setDepartment}
        />

        <Input
          label="Designation / Role Title"
          value={designation}
          onChangeText={setDesignation}
          placeholder="e.g. Senior Software Engineer"
          leftIcon={<Briefcase size={16} color="#94A3B8" />}
        />

        <Button
          title="Onboard Employee"
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
