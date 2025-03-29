export interface User {
  id: string;
  name: string;
  email: string;
  role: {
    id: Number;
    name: string;
    permissions: string[];
  };
}

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
