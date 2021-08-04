/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import debounceFn from 'debounce-fn'
import {FaRegCalendarAlt} from 'react-icons/fa'
import Tooltip from '@reach/tooltip'
import {useParams} from 'react-router-dom'
import {formatDate} from 'utils/misc'
import * as mq from 'styles/media-queries'
import * as colors from 'styles/colors'
import {Spinner, Textarea, ErrorMessage} from 'components/lib'
import {Rating} from 'components/rating'
import {StatusButtons} from 'components/status-buttons'
import {useSelector, useDispatch} from 'react-redux'
import {fetchBookById, selectBookById, selectError} from 'reducers/booksSlice'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'
import {selectListItemByBookId, updateListItem} from 'reducers/listItemsSlice'
import {unwrapResult} from '@reduxjs/toolkit'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

function BookScreen() {
  const {bookId} = useParams()
  const dispatch = useDispatch()
  const book =
    useSelector(state => selectBookById(state, bookId)) ?? loadingBook
  const listItem = useSelector(state => selectListItemByBookId(state, bookId))
  const error = useSelector(selectError)

  const {title, author, coverImageUrl, publisher, synopsis} = book

  const getBookById = React.useCallback(async () => {
    await dispatch(fetchBookById(bookId))
  }, [bookId, dispatch])

  React.useEffect(() => {
    getBookById()
  }, [getBookById])

  if (error) {
    console.error(error);
    return (
      <ErrorMessage
        error={error}
        css={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    )
  }

  return (
      <div>
        <div
          css={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gridGap: '2em',
            marginBottom: '1em',
            [mq.small]: {
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <img
            src={coverImageUrl}
            alt={`${title} book cover`}
            css={{width: '100%', maxWidth: '14rem'}}
          />
          <div>
            <div css={{display: 'flex', position: 'relative'}}>
              <div css={{flex: 1, justifyContent: 'space-between'}}>
                <h1>{title}</h1>
                <div>
                  <i>{author}</i>
                  <span css={{marginRight: 6, marginLeft: 6}}>|</span>
                  <i>{publisher}</i>
                </div>
              </div>
              <div
                css={{
                  right: 0,
                  color: colors.gray80,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  minHeight: 100,
                }}
              >
                {book.isLoadingBook && error ? null : (
                  <StatusButtons book={book} />
                )}
              </div>
            </div>
            <div css={{marginTop: 10, minHeight: 46}}>
              {listItem?.finishDate ? <Rating listItem={listItem} /> : null}
              {listItem ? <ListItemTimeframe listItem={listItem} /> : null}
            </div>
            <br />
            <p css={{whiteSpace: 'break-spaces', display: 'block'}}>
              {synopsis}
            </p>
          </div>
        </div>
        {!book.isLoadingBook && listItem && !error ? (
          <NotesTextarea listItem={listItem} />
        ) : null}
      </div>
  )
}

function ListItemTimeframe({listItem}) {
  const timeframeLabel = listItem.finishDate
    ? 'Start and finish date'
    : 'Start date'

  return (
    <Tooltip label={timeframeLabel}>
      <div aria-label={timeframeLabel} css={{marginTop: 6}}>
        <FaRegCalendarAlt css={{marginTop: -2, marginRight: 5}} />
        <span>
          {formatDate(listItem.startDate)}{' '}
          {listItem.finishDate ? `— ${formatDate(listItem.finishDate)}` : null}
        </span>
      </div>
    </Tooltip>
  )
}

function NotesTextarea({listItem}) {
  const [updateNoteStatus, setUpdateNoteStatus] = React.useState('idle')
  const [error, setError] = React.useState()
  const dispatch = useDispatch()

  const handleUpdateListItem = React.useCallback(
    async updates => {
      try {
        setError(null)
        setUpdateNoteStatus('pending')
        const data = await dispatch(updateListItem(updates))
        unwrapResult(data)
      } catch (err) {
        setError(err)
      } finally {
        setUpdateNoteStatus('idle')
      }
    },
    [dispatch],
  )

  const debouncedUpdate = React.useMemo(
    () => debounceFn(handleUpdateListItem, {wait: 300}),
    [handleUpdateListItem],
  )

  function handleNotesChange(e) {
    debouncedUpdate({id: listItem.id, notes: e.target.value})
  }

  return (
    <React.Fragment>
      <div>
        <label
          htmlFor="notes"
          css={{
            display: 'inline-block',
            marginRight: 10,
            marginTop: '0',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
          }}
        >
          Notes
        </label>
        {error ? (
          <ErrorMessage
            variant="inline"
            error={error}
            css={{fontSize: '0.7em'}}
          />
        ) : null}
        {updateNoteStatus === 'pending' ? <Spinner /> : null}
      </div>
      <Textarea
        id="notes"
        defaultValue={listItem.notes}
        onChange={handleNotesChange}
        css={{width: '100%', minHeight: 300}}
      />
    </React.Fragment>
  )
}

export {BookScreen}
