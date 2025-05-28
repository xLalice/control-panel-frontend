export interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: {
    id: number;
    name: string;
  };
}

export interface UserFormProps {
  defaultValues?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
}
