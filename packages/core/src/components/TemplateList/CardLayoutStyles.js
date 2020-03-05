import { makeStyles } from '@material-ui/core/styles';

// Shared MUI styles for a grid-based Card layout
export const CardLayoutStyles = theme => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 296px)',
    gridGap: theme.spacing(3),
    marginBottom: theme.spacing(6),
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardActions: {
    flexGrow: '1',
    alignItems: 'flex-end',
  },
});

export const useCardLayoutStyles = makeStyles(CardLayoutStyles);
