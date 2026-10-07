# Incident and Issue Notes

**Status:** In progress

**Impact:** The booking list can load slowly.

## Symptoms

Opening an equipment item with many bookings can take several seconds.

## Investigation notes

- Reproduction: select an item with many past bookings.
- Temporary workaround: limit the displayed period to the current month.
- Possible cause: all bookings for an item are loaded every time.

## Next steps

- [ ] Record the slow query and inspect its execution plan.
- [ ] Consider an index for the date filter.
- [ ] Compare response times with the same data volume after the fix.
