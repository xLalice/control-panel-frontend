export interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UserFormProps {
  defaultValues?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
}
