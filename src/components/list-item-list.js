/** @jsx jsx */
import {jsx} from '@emotion/core'

import {BookListUL} from './lib'
import {BookRow} from './book-row'
import {useSelector} from 'react-redux'
import {selectAllListItems} from 'reducers/listItemsSlice'

function ListItemList({filterListItems, noListItems, noFilteredListItems}) {
  const listItems = useSelector(selectAllListItems)

  const filteredListItems = listItems.filter(filterListItems)

  if (!listItems.length) {
    return <div css={{marginTop: '1em', fontSize: '1.2em'}}>{noListItems}</div>
  }
  if (!filteredListItems.length) {
    return (
      <div css={{marginTop: '1em', fontSize: '1.2em'}}>
        {noFilteredListItems}
      </div>
    )
  }

  return (
      <BookListUL>
        {filteredListItems.map(listItem => (
          <li key={listItem.id} aria-label={listItem.book.title}>
            <BookRow book={listItem.book} />
          </li>
        ))}
      </BookListUL>
  )
}

export {ListItemList}
