# Almanac

## Database Diagram

**Description:**

This simple model represents thoughtful planning for my app. It displays
the different tables that will be used and how they are all connected.
Here are some important factors:

-   Each **User** can have access to multiple **Calendars** (1 user → N
    calendars). Each user can create any number of personal or group
    calendars.\
-   Each **Calendar** has N **Events** linked to it --- there can be any
    number of events per calendar (1 calendar → N events).\
-   Each **Calendar** also has N **Members**, depending on whether it is
    a personal or group calendar (1 calendar → N members).\
-   Each **User** can have only one **Member** status per calendar (1
    user → 1 membership per calendar).

The main control mechanism for managing calendars is the member role:\
- **Owners** can manage members and calendars.\
- **Editors** can manage the calendar with the same permissions as the
owner.\
- **Viewers** can only observe calendar events.

**Diagram:**

![Database Diagram](https://imgur.com/15MjwNq)
