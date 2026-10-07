# Booking API Specification (Sample)

## `POST /api/reservations`

Creates an equipment booking.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `resource_id` | string | Yes | Equipment identifier |
| `starts_at` | ISO 8601 | Yes | Booking start time |
| `ends_at` | ISO 8601 | Yes | Booking end time |
| `purpose` | string | No | Reason for use |

## Errors

- `400`: Invalid time format, or the end time is not after the start time.
- `409`: The requested time slot is already booked.
- `404`: The equipment item was not found.

## Checks

- [ ] Simultaneous booking requests cannot create a double booking.
- [ ] Normalize times to UTC when saving.
- [ ] Exclude canceled bookings from availability.
