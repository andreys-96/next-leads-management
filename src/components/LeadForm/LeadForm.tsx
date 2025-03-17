'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const visaOptions = [
  'Student Visa',
  'Work Visa',
  'Business Visa',
  'Tourist Visa',
  'Permanent Residency',
];

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const leadFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  linkedinProfile: z.string().url('Invalid LinkedIn URL'),
  visasOfInterest: z.array(z.string()).min(1, 'Please select at least one visa'),
  resume: z
    .any()
    .refine((value) => value?.length > 0, {
      message: 'Resume is required',
    })
    .refine((value) => {
      if (!value?.[0]) return false;
      return ALLOWED_FILE_TYPES.includes(value[0].type);
    }, {
      message: 'File must be a PDF or Word document',
    })
    .refine((value) => {
      if (!value?.[0]) return false;
      return value[0].size <= MAX_FILE_SIZE;
    }, {
      message: 'File size must be less than 5MB',
    })
    .transform((value) => value[0]),
  additionalInfo: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

export default function LeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      visasOfInterest: [], // Initialize as empty array
    },
  });

  // Watch for file changes
  const resumeField = register('resume');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFileName(file ? file.name : '');
    resumeField.onChange(e); // Ensure react-hook-form gets the update
  };

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('linkedinProfile', data.linkedinProfile);
      formData.append('visasOfInterest', JSON.stringify(data.visasOfInterest));
      formData.append('resume', data.resume);
      if (data.additionalInfo) {
        formData.append('additionalInfo', data.additionalInfo);
      }

      const response = await fetch('/api/leads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {submitSuccess ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Thank you for your submission!</h2>
          <p className="text-gray-600">We will review your application and get back to you soon.</p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Another Lead
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                {...register('firstName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                {...register('lastName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="linkedinProfile" className="block text-sm font-medium text-gray-700">
              LinkedIn Profile *
            </label>
            <input
              type="url"
              id="linkedinProfile"
              {...register('linkedinProfile')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://linkedin.com/in/your-profile"
            />
            {errors.linkedinProfile && (
              <p className="mt-1 text-sm text-red-600">{errors.linkedinProfile.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Visas of Interest *
            </label>
            <div className="mt-2 space-y-2">
              {visaOptions.map((visa) => (
                <div key={visa} className="flex items-center">
                  <input
                    type="checkbox"
                    id={visa}
                    value={visa}
                    {...register('visasOfInterest')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={visa} className="ml-2 text-sm text-gray-700">
                    {visa}
                  </label>
                </div>
              ))}
            </div>
            {errors.visasOfInterest && (
              <p className="mt-1 text-sm text-red-600">{errors.visasOfInterest.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
              Resume/CV *
            </label>
            <div className="mt-1">
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                ref={resumeField.ref}
                name={resumeField.name}
                className="hidden"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => document.getElementById('resume')?.click()}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold"
                >
                  Choose File
                </button>
                <span className="text-sm text-gray-500">
                  {errors.resume ? (
                    <span className="text-red-600">{errors.resume.message?.toString()}</span>
                  ) : selectedFileName || 'No file chosen'}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Accepted formats: PDF, DOC, DOCX. Maximum size: 5MB
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
              Additional Information
            </label>
            <textarea
              id="additionalInfo"
              {...register('additionalInfo')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 