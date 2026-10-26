# Design and UX notes

## Visual language

Little Lemon's green (#495e57) and yellow (#f4ce14) anchor a warm restaurant design. Cream surfaces separate content from the form, serif display headings give a hospitality feel, and a restrained sans-serif supports readable labels and errors. A two-column photographic hero leads to featured dishes, an introduction, and a reservation call to action. No original Figma file was supplied; this implementation provides its own consistent interpretation rather than claiming fidelity to an unseen design.

## Page layout and user flow

Home: navigation → restaurant introduction → featured dishes → story → reservation invitation.
Reservation: context → date and party size → available time → occasion → contact details → optional requests → submit → confirmation summary.

Desktop: a wide form with a narrower restaurant-information panel. Mobile: form first, information beneath it. The primary action is visible and consistently yellow. Labels persist above controls. Optional input is marked explicitly. The demo status appears in the form heading and alongside the confirmation information.

## Recovery

Invalid fields get specific linked messages. An invalid submit focuses the first invalid field. Date changes clear stale selections. No available time disables saving and directs the visitor to choose another day. Availability failures offer retry. Save failures preserve contact fields and refresh availability. Direct confirmation access and unknown routes both offer recovery links.

## Manual QA checklist

- [ ] At 1440px, verify the hero, three dish cards, and two-column booking layout.
- [ ] At 390px and 320px, verify readable fields, no horizontal overflow, and the mobile menu.
- [ ] Navigate all links with the keyboard; use the skip link and visible focus states.
- [ ] Select tomorrow and a time; fill valid contact details; confirm the receipt.
- [ ] Return to reservations and verify the saved slot is unavailable.
- [ ] Attempt invalid name/email/party size and inspect messages and first-error focus.
- [ ] Fill every slot on a date in the demo; verify the no-times state.
- [ ] Disable browser storage and inspect retry and save errors.
- [ ] Test with a screen reader, zoom at 200%, and reduced motion.
- [ ] Check image loading and system font fallbacks without third-party assets.

Automated checks cover validation and interaction behavior. This checklist records manual checks to perform, not a claim that every assistive-technology scenario has been tested.
