# Refactor Bookshelf application with Redux

## Requirements

Applying Redux to your application

- [x] Fork this repository https://github.com/kentcdodds/bookshelf.
- [x] Create a new branch from exercise/14-e2d-testing in the forked repository.
- [ ] Use Redux to store list-items, authentication information instead of context
  provider.
- [ ] Retrieve data being stored in redux reducer to render the application.
- [ ] Use action creators to make requests ( fetch list items, add list item, update
  list item, remove list item, query book list).
- [ ] Write a middleware to log all the actions that are being called to the
  console.

## Note and Progress

### 05 Jul

#### Planning
- Change project structures
- Create redux store
- Slice
    - user 
        - reducer
            - login
            - logout
            - register
        - state {user, status, error}
    - listItems
    - books: just save book to the cache
- TODO: bootstrapAppData

#### Completed
