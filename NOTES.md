# Refactor Bookshelf application with Redux

## Requirements

Applying Redux to your application

- [x] Fork this repository https://github.com/kentcdodds/bookshelf.
- [x] Create a new branch from exercise/14-e2e-testing in the forked repository.
- [x] Use Redux to store list-items, authentication information instead of
      context provider.
- [x] Retrieve data being stored in redux reducer to render the application.
- [x] Use action creators to make requests ( fetch list items, add list item,
      update list item, remove list item, query book list).
- [x] Write a middleware to log all the actions that are being called to the
      console.

## Note and Progress

### Some issues

- Rating component testing

  - Rating component testing: When rendering isolated Rating component, user is
    not authenticated
  - This may be related to how I fetch user data for auto-login feature? I don't
    have same issue with tests for Book Screen.
  - fetchUser is at AppProviders component. Component tests are using
    AppProviders component as wrapper

- Actions naming convention: createSlice has different naming convention than
  normal handwritten action objects (uppercase vs lowercase for creatSlice)

## Completed

- All assigned items
- Automation test passed, except for one case
- Main functionalities remain the same and are tested
- Manual tested loading and error states for all components in case API failed
- Some optimizations along the way

## Some improvements I'd like to make but not sure what the best way is

- Manage data fetching state with createAsyncThunk. Right now I need to write
  extra reducers for each state: pending, rejected, fulfilled if I want to keep
  track of the fetching state in the store. If I have a lot of createAsyncThunk
  functions, it would be a lot of duplicate code.
- Managing fetching state inside components also produces duplicate code. For
  example, updating list item when rating, writing note, mark as read/unread
  require their own state inside each components. Those are additional codes
  comparing to when using React query.
- Book state, at the moment, is not very useful. It just fetches the data, saves
  to the store and components can select its data.
