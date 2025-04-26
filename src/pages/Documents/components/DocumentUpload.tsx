import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCategories, useUploadDocument } from "../hooks/useDocuments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { selectCurrentUser } from '@/store/slice/authSlice';
import { useAppSelector } from '@/store/store';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  categoryId: z.string().min(1, 'Please select a category'),
  file: z.instanceof(File, { message: 'Please select a file to upload' }),
});

type FormValues = z.infer<typeof formSchema>;

export const DocumentUpload: React.FC = () => {
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const user = useAppSelector((state) => selectCurrentUser(state));
  const uploadDocument = useUploadDocument();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      categoryId: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('categoryId', values.categoryId);
    formData.append('file', values.file);
    formData.append('userId', user!.id);

    uploadDocument.mutate(formData, {
      onSuccess: () => {
        form.reset({
          title: '',
          categoryId: '',
          file: undefined, 
        });
      },
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
        <CardDescription>
          Upload a new document to the system. Only upload files to categories you have access to.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter document title" {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear title that describes the document's purpose
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingCategories}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The category where this document will be stored
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      {...fieldProps}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Select the file you want to upload
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={uploadDocument.isPending}
              className="w-full"
            >
              {uploadDocument.isPending ? 'Uploading...' : 'Upload Document'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};