# Keyfolio Firestore Security Specification

## Data Invariants
- Each user owns their own profile. Only the owner can edit their bio/name.
- Profiles are publicly readable (for QR scan results).
- Job applications belong strictly to the creating user; others cannot see or edit them.
- Scans are append-only logs created by anyone (when scanning) but can only be read by the owner of the user profile scanned.
- User IDs in data (`uid`, `userId`) must strictly match the `request.auth.uid`.

## The "Dirty Dozen" Payloads (Denial Tests)
1. **Profile Hijack**: Authenticated user trying to update someone else's profile.
2. **Profile Spoof**: Creating a profile where `uid` field doesn't match `request.auth.uid`.
3. **Ghost App**: Creating a job application for another user ID.
4. **App Leak**: Reading someone else's job application collection.
5. **Scan Snoop**: Reading scan history of another user's QR code.
6. **Scan Edit**: Trying to update or delete a scan record (logs should be immutable).
7. **Jumbo Profile**: Injecting a 1MB string into the `bio` field to inflate costs.
8. **Invalid Status**: Setting a job application status to 'Hacker' (not in enum).
9. **Fake Timestamp**: Providing a client-side timestamp for `updatedAt` instead of `request.time`.
10. **ID Poisoning**: Using a 500-character malicious string as a document ID.
11. **Shadow Field**: Adding `isAdmin: true` to a profile document.
12. **Anonymous Write**: Trying to create an application without being signed in.

## Test Strategy
The firestore rules must reject all the above payloads using:
- `request.auth.uid` comparisons.
- `affectedKeys().hasOnly()` gates.
- `isValidId()` helper for path variables.
- Server-side timestamp validation.
