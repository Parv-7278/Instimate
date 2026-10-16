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

/**
 * Confines horizontal wheel scrolling to the target container when appropriate.
 * - If the user uses a trackpad horizontal swipe (deltaX), native behavior is preserved.
 * - If vertical wheel (deltaY) occurs over a container that has horizontal scroll room,
 *   it translates deltaY into horizontal scrollLeft.
 * - When the container reaches its boundary (cannot scroll left or right any further),
 *   it does NOT preventDefault, allowing normal vertical page scrolling to proceed naturally.
 */
export function handleHorizontalWheel(e: React.WheelEvent<HTMLElement>) {
  const container = e.currentTarget;
  // If native horizontal delta is prominent (e.g. trackpad 2-finger horizontal swipe), preserve native
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    return;
  }

  const maxScrollLeft = container.scrollWidth - container.clientWidth;
  // If content fits completely inside container, do not intercept
  if (maxScrollLeft <= 0) {
    return;
  }

  // Scrolling right (deltaY > 0)
  const canScrollRight = e.deltaY > 0 && container.scrollLeft < maxScrollLeft - 1;
  // Scrolling left (deltaY < 0)
  const canScrollLeft = e.deltaY < 0 && container.scrollLeft > 1;

  if (canScrollRight || canScrollLeft) {
    e.preventDefault();
    container.scrollLeft += e.deltaY;
  }
  // When at edges, event is NOT prevented, allowing normal vertical page scroll to continue naturally!
}

export const VERIFIED_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
];

export function getRandomAvatar(): string {
  const index = Math.floor(Math.random() * VERIFIED_AVATARS.length);
  return VERIFIED_AVATARS[index];
}

