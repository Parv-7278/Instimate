import { getSupabaseClient } from '../client';
import { getSupabaseAdmin } from '../admin';
import { FeeInvoice, PaymentTransaction } from '@/types';

export const financeService = {
  async getInvoices(institutionId: string): Promise<FeeInvoice[]> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('fee_invoices')
      .select('*')
      .eq('institution_id', institutionId)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching fee invoices from Supabase:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      invoiceNumber: row.invoice_number,
      studentId: row.student_id,
      studentName: row.student_name,
      rollNo: row.roll_no,
      classId: row.class_id,
      title: row.title,
      category: row.category,
      totalAmount: Number(row.total_amount),
      paidAmount: Number(row.paid_amount || 0),
      dueAmount: Number(row.due_amount),
      dueDate: row.due_date,
      status: row.status as any,
      paymentDate: row.payment_date || undefined,
      transactionId: row.transaction_id || undefined,
      paymentMethod: row.payment_method || undefined,
    }));
  },

  async recordPayment(
    invoiceId: string,
    paidAmount: number,
    paymentMethod: string,
    transactionId: string
  ): Promise<boolean> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) return false;

    // 1. Fetch invoice
    const { data: invoice } = await supabase
      .from('fee_invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (!invoice) return false;

    const currentPaid = Number(invoice.paid_amount || 0);
    const newPaid = currentPaid + paidAmount;
    const newDue = Math.max(0, Number(invoice.total_amount) - newPaid);
    const newStatus = newDue === 0 ? 'Paid' : 'Partially Paid';

    // 2. Update invoice
    const { error: invoiceError } = await supabase
      .from('fee_invoices')
      .update({
        paid_amount: newPaid,
        due_amount: newDue,
        status: newStatus,
        payment_date: new Date().toISOString().split('T')[0],
        transaction_id: transactionId,
        payment_method: paymentMethod,
      })
      .eq('id', invoiceId);

    if (invoiceError) {
      console.error('Error updating fee invoice in Supabase:', invoiceError);
      return false;
    }

    // 3. Log transaction
    const receiptNum = `RCPT-${Date.now().toString().slice(-6)}`;
    await supabase.from('payment_transactions').insert({
      invoice_id: invoiceId,
      student_id: invoice.student_id,
      amount: paidAmount,
      currency: 'INR',
      payment_method: paymentMethod,
      razorpay_payment_id: transactionId,
      status: 'Success',
      receipt_number: receiptNum,
    } as any);

    return true;
  },

  async createInvoice(
    invoice: Omit<FeeInvoice, 'id'> & { institutionId: string }
  ): Promise<FeeInvoice | null> {
    const supabase = getSupabaseAdmin() || getSupabaseClient();
    if (!supabase) return null;

    const payload: any = {
      institution_id: invoice.institutionId,
      invoice_number: invoice.invoiceNumber,
      student_id: invoice.studentId,
      student_name: invoice.studentName,
      roll_no: invoice.rollNo,
      class_id: invoice.classId,
      title: invoice.title,
      category: invoice.category,
      total_amount: invoice.totalAmount,
      paid_amount: invoice.paidAmount || 0,
      due_amount: invoice.dueAmount,
      due_date: invoice.dueDate,
      status: invoice.status || 'Pending',
    };

    const { data, error } = await supabase
      .from('fee_invoices')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error creating fee invoice in Supabase:', error);
      return null;
    }

    return {
      id: data.id,
      invoiceNumber: data.invoice_number,
      studentId: data.student_id,
      studentName: data.student_name,
      rollNo: data.roll_no,
      classId: data.class_id,
      title: data.title,
      category: data.category,
      totalAmount: Number(data.total_amount),
      paidAmount: Number(data.paid_amount || 0),
      dueAmount: Number(data.due_amount),
      dueDate: data.due_date,
      status: data.status as any,
    };
  },

  async getTransactions(institutionId: string): Promise<PaymentTransaction[]> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions from Supabase:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      invoiceId: row.invoice_id,
      studentId: row.student_id,
      studentName: row.student_name || 'Student',
      amount: Number(row.amount),
      currency: row.currency || 'INR',
      paymentMethod: row.payment_method || 'Online',
      razorpayOrderId: row.razorpay_order_id,
      razorpayPaymentId: row.razorpay_payment_id,
      status: (row.status as any) || 'Success',
      createdAt: row.created_at || new Date().toISOString(),
      receiptNumber: row.receipt_number,
    }));
  },
};
