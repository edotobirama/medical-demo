# Hospital Waitlist System - Implementation Report

## 1. Core Architecture & Schema Changes
The foundation of the dynamic waitlist has been successfully implemented by uncoupling bookings from static slots:
-   **Upgraded the `Appointment` model** in `prisma/schema.prisma` to make `slotId` optional.
-   **Added Fields**: `bookingNumber`, `requestedTime`, `estimatedDuration`, `actualStartTime`, `actualEndTime`, `amountPaid`, `totalCost`, `rescheduleCount`, `issueDescription`, and `historyNotes`.
-   **State Management**: Expanded the default appointment status field to act as a robust state machine (`BOOKED`, `RESCHEDULED`, `TURN_ARRIVED`, `IN_PROGRESS`, `MISSED_BUT_REBOOKED`, `LOST`).

## 2. Dynamic "WaitMath" Simulation Data
-   **Endpoint**: `/api/booking/simulate/route.ts`
-   **Logic**: 
    -   When a patient requests a specific precision time (exact minute), the engine dynamically queries all pending and active appointments for the specified doctor.
    -   It accurately sorts patients waiting at that time by their First-Come-First-Serve chronological **Booking Number**.
    -   It computes an expected duration based dynamically on the provided patient's "medical issue".
    -   It returns their prospective `bookingNumber`, `estimatedDuration`, calculated `actualStartTime`, `estimatedWaitTime`, and exact `queuePosition` ahead of locking the booking.

## 3. Booking Engine & Secure Payment Flows
-   **Endpoint**: `/api/booking/create/route.ts`
-   **Execution**:
    -   Utilizes Prisma's `$transaction` to atomically allocate the absolute lowest valid sequential `bookingNumber`.
    -   Calculates a normalized minimal partial consultation fee (set to 20% by default).
    -   Ensures secure and exact queue tracking against duplicate timestamps.

## 4. Payment Simulation UI
-   **Widget Updates**: `DoctorBookingWidget.tsx` (Client Component).
-   **Implementation Phase**: As per senior instruction, complex 3rd party gateways are skipped for now.
-   **Flow**:
    -   User evaluates WaitMath statistics and hits "Pay & Secure".
    -   A new Modal checks for the simulated transaction showing the amount due.
    -   Upon "OK", the UI finalizes the transaction, triggers the backend booking, and presents a success view containing the receipt `paymentNumber` and the updated `Paid` status.

## 5. Doctor Live Schedules
-   **Endpoint**: `/api/booking/schedule/route.ts` & **Component**: `LiveSchedule.tsx`
-   **Data Vis**: Doctor profiles now expose their hourly queue traffic mapping. Users can see what hours are heavily loaded with priority appointments, the total Waitlist aggregation, and average delays per section.

## 6. Auto-rescheduling and Quota Triggers
-   **Endpoints**: `/api/appointments/reschedule` & `/api/appointments/miss`
-   **Rescheduling**: Allows patients to manually shift their priority but increments their quota (`rescheduleCount`).
-   **Missed Turns**: Automatically re-books patients failing to show up at a *lower queue priority* (generating a worse `bookingNumber`). Users hitting the limit of 2 reschedules are transitioned to state `LOST` gracefully without server panic.

---
**Status**: Ready for Code Review & Version Control Submission.
