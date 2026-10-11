import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = '₹') {
  return `${currency} ${amount.toLocaleString('en-IN')}`;
}

export function calculateGrade(marks: number, maxMarks: number = 100): { grade: string; gpa: number; status: 'Pass' | 'Fail' } {
  const percentage = (marks / maxMarks) * 100;
  if (percentage >= 90) return { grade: 'A+', gpa: 10, status: 'Pass' };
  if (percentage >= 80) return { grade: 'A', gpa: 9, status: 'Pass' };
  if (percentage >= 70) return { grade: 'B+', gpa: 8, status: 'Pass' };
  if (percentage >= 60) return { grade: 'B', gpa: 7, status: 'Pass' };
  if (percentage >= 50) return { grade: 'C', gpa: 6, status: 'Pass' };
  if (percentage >= 40) return { grade: 'D', gpa: 4, status: 'Pass' };
  return { grade: 'F', gpa: 0, status: 'Fail' };
}
