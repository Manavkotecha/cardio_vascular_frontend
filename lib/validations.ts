// // src/lib/validations.ts

// import { z } from 'zod';


// export const predictionSchema = z.object({
//   age: z.coerce.number()
//     .min(18, 'Age must be at least 18')
//     .max(120, 'Age must be less than 120'),
//   // gender: z.enum(['male', 'female', 'other'], {
//   //   required_error: 'Please select a gender',
//   // }),
//   gender: z.enum(['male' , 'female' , 'other']),
//   cholesterol: z.coerce.number()
//     .min(100, 'Cholesterol must be at least 100 mg/dL')
//     .max(400, 'Cholesterol must be less than 400 mg/dL'),
//   bloodPressureSystolic: z.coerce.number()
//     .min(70, 'Systolic BP must be at least 70 mmHg')
//     .max(250, 'Systolic BP must be less than 250 mmHg'),
//   bloodPressureDiastolic: z.coerce.number()
//     .min(40, 'Diastolic BP must be at least 40 mmHg')
//     .max(150, 'Diastolic BP must be less than 150 mmHg'),
//   smoking: z.coerce.boolean().default(false),
//   diabetes: z.coerce.boolean().default(false),
//   bmi: z.coerce.number()
//     .min(10, 'BMI must be at least 10')
//     .max(60, 'BMI must be less than 60')
//     .optional(),
//   familyHistory: z.coerce.boolean().optional(),
// }).refine(
//   (data) => data.bloodPressureSystolic > data.bloodPressureDiastolic,
//   {
//     message: 'Systolic BP must be greater than diastolic BP',
//     path: ['bloodPressureSystolic'],
//   }
// );

// export const loginSchema = z.object({
//   email: z.string()
//     .email('Invalid email address')
//     .min(1, 'Email is required'),
//   password: z.string()
//     .min(6, 'Password must be at least 6 characters')
//     .min(1, 'Password is required'),
// });

// export type PredictionFormData = z.infer<typeof predictionSchema>;
// export type LoginFormData = z.infer<typeof loginSchema>;


import { z } from 'zod';

export const predictionSchema = z.object({
  age: z.number()
    .min(18, 'Age must be at least 18')
    .max(120, 'Age must be less than 120'),
  gender: z.enum(['male', 'female', 'other']),
  cholesterol: z.number()
    .min(100, 'Cholesterol must be at least 100 mg/dL')
    .max(400, 'Cholesterol must be less than 400 mg/dL'),
  bloodPressureSystolic: z.number()
    .min(70, 'Systolic BP must be at least 70 mmHg')
    .max(250, 'Systolic BP must be less than 250 mmHg'),
  bloodPressureDiastolic: z.number()
    .min(40, 'Diastolic BP must be at least 40 mmHg')
    .max(150, 'Diastolic BP must be less than 150 mmHg'),
  smoking: z.boolean(),
  diabetes: z.boolean(),
  bmi: z.number()
    .min(10, 'BMI must be at least 10')
    .max(60, 'BMI must be less than 60')
    .optional(),
  familyHistory: z.boolean().optional(),
}).refine(
  (data) => {
    return data.bloodPressureSystolic == null || data.bloodPressureDiastolic == null
      ? true
      : data.bloodPressureSystolic > data.bloodPressureDiastolic;
  },
  {
    message: 'Systolic BP must be greater than diastolic BP',
    path: ['bloodPressureSystolic'],
  }
);

export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
});

export type PredictionFormData = z.infer<typeof predictionSchema>;  // Output type (strict enum for API)
export type PredictionFormInputData = z.input<typeof predictionSchema>;  // Input type (string for select)
export type LoginFormData = z.infer<typeof loginSchema>;