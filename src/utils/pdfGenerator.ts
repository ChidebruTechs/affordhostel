import jsPDF from 'jspdf';
import { ReceiptData } from '../types';

export const generatePDFReceipt = (receiptData: ReceiptData): void => {
  const doc = new jsPDF();
  
  // Set up colors
  const primaryColor = '#7C3AED'; // Purple
  const secondaryColor = '#14B8A6'; // Teal
  const textColor = '#374151'; // Gray-700
  const lightGray = '#F3F4F6'; // Gray-100
  
  // Header
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Logo and title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('AffordHostel', 20, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Booking Receipt', 20, 35);
  
  // Receipt number and date
  doc.setTextColor(textColor);
  doc.setFontSize(10);
  doc.text(`Receipt #: ${receiptData.transactionId}`, 140, 25);
  doc.text(`Date: ${receiptData.timestamp.toLocaleDateString()}`, 140, 35);
  
  // Customer Information Section
  let yPos = 60;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text('Customer Information', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor);
  doc.text(`Name: ${receiptData.customerName}`, 20, yPos);
  yPos += 7;
  doc.text(`Email: ${receiptData.customerEmail}`, 20, yPos);
  yPos += 7;
  doc.text(`Phone: ${receiptData.phoneNumber}`, 20, yPos);
  
  // Booking Details Section
  yPos += 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text('Booking Details', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor);
  doc.text(`Booking ID: ${receiptData.bookingId}`, 20, yPos);
  yPos += 7;
  doc.text(`Hostel: ${receiptData.hostelName}`, 20, yPos);
  yPos += 7;
  doc.text(`Room Type: ${receiptData.roomType}`, 20, yPos);
  yPos += 7;
  doc.text(`Check-in: ${receiptData.checkIn}`, 20, yPos);
  yPos += 7;
  doc.text(`Check-out: ${receiptData.checkOut}`, 20, yPos);
  yPos += 7;
  doc.text(`Duration: ${receiptData.duration} months`, 20, yPos);
  
  // Payment Summary Section
  yPos += 20;
  doc.setFillColor(lightGray);
  doc.rect(15, yPos - 5, 180, 40, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text('Payment Summary', 20, yPos + 5);
  
  yPos += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor);
  
  // Payment breakdown
  doc.text('Accommodation Fee:', 20, yPos);
  doc.text(`Ksh ${receiptData.amount.toLocaleString()}`, 150, yPos);
  yPos += 7;
  
  doc.text('Service Fee (2.5%):', 20, yPos);
  doc.text(`Ksh ${receiptData.serviceFee.toLocaleString()}`, 150, yPos);
  yPos += 7;
  
  // Total line
  doc.setFont('helvetica', 'bold');
  doc.text('Total Amount:', 20, yPos);
  doc.text(`Ksh ${receiptData.totalAmount.toLocaleString()}`, 150, yPos);
  
  // Payment Method
  yPos += 15;
  doc.setFont('helvetica', 'normal');
  doc.text(`Payment Method: ${receiptData.paymentMethod}`, 20, yPos);
  yPos += 7;
  doc.text(`Transaction ID: ${receiptData.transactionId}`, 20, yPos);
  
  // Footer
  yPos += 30;
  doc.setFillColor(secondaryColor);
  doc.rect(0, yPos, 210, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for choosing AffordHostel!', 20, yPos + 10);
  doc.text('For support, contact: support@affordhostel.com', 20, yPos + 20);
  doc.text('Visit us at: www.affordhostel.com', 120, yPos + 10);
  doc.text('Phone: +254 712 345 678', 120, yPos + 20);
  
  // Terms and conditions
  yPos += 40;
  doc.setTextColor(textColor);
  doc.setFontSize(8);
  doc.text('Terms & Conditions:', 20, yPos);
  yPos += 5;
  doc.text('• This receipt serves as proof of payment for your hostel booking.', 20, yPos);
  yPos += 4;
  doc.text('• Cancellation policy applies as per hostel terms.', 20, yPos);
  yPos += 4;
  doc.text('• For any disputes, please contact our support team within 7 days.', 20, yPos);
  
  // Save the PDF
  doc.save(`AffordHostel_Receipt_${receiptData.transactionId}.pdf`);
};