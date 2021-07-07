/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaBook,
  FaTimesCircle,
} from 'react-icons/fa'
import Tooltip from '@reach/tooltip'
import * as colors from 'styles/colors'
import {CircleButton, Spinner} from './lib'
import {useSelector, useDispatch} from 'react-redux'
import {
  selectListItemByBookId,
  createListItem,
  removeListItem,
  updateListItem,
} from 'reducers/listItemsSlice'
import {unwrapResult} from '@reduxjs/toolkit'

function TooltipButton({label, highlight, onClick, icon, ...rest}) {
  const [isLoading, setIsLoading] = React.useState()
  const [error, setError] = React.useState()
  const isMounted = React.useRef(false)

  React.useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  })

  async function handleClick() {
    try {
      setError(null)
      setIsLoading(true)
      const data = await onClick()
      unwrapResult(data)
    } catch (err) {
      setIsLoading(false)
      setError(err)
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }
  }

  return (
    <Tooltip label={error ? error.message : label}>
      <CircleButton
        css={{
          backgroundColor: 'white',
          ':hover,:focus': {
            color: isLoading
              ? colors.gray80
              : error
              ? colors.danger
              : highlight,
          },
        }}
        disabled={isLoading}
        onClick={handleClick}
        aria-label={error ? error.message : label}
        {...rest}
      >
        {isLoading ? <Spinner /> : error ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  )
}

function StatusButtons({book}) {
  const dispatch = useDispatch()
  const listItem = useSelector(state => selectListItemByBookId(state, book.id))

  const handleUpdateClick = updates => dispatch(updateListItem(updates))
  const handleRemoveClick = id => dispatch(removeListItem(id))
  const handleAddClick = bookId => dispatch(createListItem(bookId))

  return (
    <React.Fragment>
      {listItem ? (
        Boolean(listItem.finishDate) ? (
          <TooltipButton
            label="Mark as unread"
            highlight={colors.yellow}
            onClick={() =>
              handleUpdateClick({id: listItem.id, finishDate: null})
            }
            icon={<FaBook />}
          />
        ) : (
          <TooltipButton
            label="Mark as read"
            highlight={colors.green}
            onClick={() =>
              handleUpdateClick({id: listItem.id, finishDate: Date.now()})
            }
            icon={<FaCheckCircle />}
          />
        )
      ) : null}
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          highlight={colors.danger}
          onClick={() => handleRemoveClick(listItem.id)}
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          label="Add to list"
          highlight={colors.indigo}
          onClick={() => handleAddClick(book.id)}
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  )
}

export {StatusButtons}
