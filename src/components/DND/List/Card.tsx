import { FC, useRef } from 'react'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { ItemTypes } from './ItemTypes'
import { XYCoord } from 'dnd-core'
import {
  Grid,
  IconButton,
  TextField,
  useTheme,
} from '@material-ui/core';
import {
  Close,
} from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';

const style = {
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

export interface CardProps {
  id: any;
  html: any;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onchange: (e: any) => void;
  removeAccompaniment: (e: any) => void;
  disabled: boolean;
  accompanimentOptions: any[];
  setUpdatePrice: (e: boolean) => void;
  setCurrentOption: (e: any) => void;
  setAccompagnement: (e: any) => void;
  updatePrice: (data: any) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const Card: FC<CardProps> = ({
  id,
  html,
  index,
  moveCard,
  onchange,
  removeAccompaniment,
  disabled,
  accompanimentOptions,
  setUpdatePrice,
  setCurrentOption,
  setAccompagnement,
  updatePrice
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const theme = useTheme();
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action


      moveCard(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const priority = (a: any[], b: any[]) => {

    const array = [];

    if (b.length > 0) {

      for (let i = 0; i < b.length; i++) {
        array.push(a.filter((items: any) => items._id === b[i])[0])
      }
      const priority = [...array].concat(a.filter((items: any) => !b.includes(items._id)));

      if (priority.filter((item: any) => item).length) {
        return priority;
      }

    }

    return a;

  }

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>

      <Grid container={true} key={index}  >
        <Grid item xs={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Titre"
            style={{ flexGrow: 1 }}
            //     value={html?.title || ""}
            value={html?.title || ""}
            name="title"
            onChange={(e: any) => {
              onchange({
                value: e.target.value,
                name: e.target.name,
                index: index
              })
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            name="maxOptions"
            //     value={html?.maxOptions || ""}
            value={html?.maxOptions || ""}
            type="number"
            fullWidth
            variant="outlined"
            placeholder="Choix maximum"
            style={{ flexGrow: 1 }}
            onChange={(e: any) => {
              onchange({
                value: e.target.value,
                name: e.target.name,
                index: index
              })
            }}
          />
        </Grid>

        <Grid item xs={6} style={{ display: 'flex' }}>

          <Autocomplete
            fullWidth
            multiple
            filterSelectedOptions
            style={{ flexGrow: 2 }}
            noOptionsText="Aucun choix disponible"
            loading={false}
            options={accompanimentOptions}
            disabled={true}
            getOptionLabel={(option: any) => option.name}
            value={priority(accompanimentOptions, html?.items.map((item: any) => item._id)).filter(({ _id }) =>
              html?.items.find((d: any) => d._id === _id),
            )}
            renderInput={(params: any) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Accompagnement"
              />
            )}
          />

          <div style={{ marginLeft: theme.spacing(1) }}>
            <IconButton key={index} onClick={(e: any) => {
              e.stopPropagation();
              removeAccompaniment(id)
            }}>
              <Close />
            </IconButton>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}
