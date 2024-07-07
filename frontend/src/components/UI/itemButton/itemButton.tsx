import { Divider, ListItem, ListItemText, Typography } from '@mui/material'
import React from 'react'
import { FeaturesOfList } from '../../../typs/featuresType'

type IProps = {
    item: FeaturesOfList
    onAction: (index: number) => void
}

export default function ItemButton({ item, onAction }: IProps) {
    return (
        <React.Fragment key={item.id}>
            <ListItem button onClick={() => onAction(item.id - 1)} >
              
                <ListItemText
                    primary={
                        <Typography component="div" variant="body1">
                            {item.label}
                        </Typography>
                    }

                    secondary={
                        <React.Fragment>
                            <Typography component="div" variant="body2">
                                {item.label}
                            </Typography>
                            {item.date && (
                                <Typography component="div" variant="body2">
                                    {item.date}
                                </Typography>
                            )}
                        </React.Fragment>
                    }
                />
            </ListItem>
            <Divider component="li" />
        </React.Fragment>
    )
}
