/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { makeStyles, Theme } from '@material-ui/core/styles';

export const useArrowButtonStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '30%',
    transform: 'translateY(-50%)',
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    backgroundColor: '#333',
    zIndex: 10,
    '&:hover': { backgroundColor: theme.palette.grey[700] },
  },
  prev: { left: '1rem' },
  next: { right: 0 },
  icon: { color: '#fff', fontSize: '2.5rem' },
}));

export const useCarouselCardStyles = makeStyles(theme => ({
  wrapper: { display: 'flex', cursor: 'pointer' },
  card: { width: 300, margin: theme.spacing(1) },
  errorHeader: {
    backgroundColor: theme.palette.error.light,
  },
  buttonBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(1),
  },
  header: {
    background: 'linear-gradient(90deg, #187656 0%, #4BB8A5 100%)',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
  },
  loadingHeader: {
    background: 'linear-gradient(90deg, #187656 0%, #4BB8A5 100%)',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    padding: theme.spacing(1),
    paddingLeft: 4,
    paddingRight: 4,
  },
  noTemplateHeader: {
    background: theme.palette.action.hover,
  },
  titleBox: { display: 'flex', alignItems: 'center', gap: 8 },
  subheader: { color: '#fff' },
  divider: { margin: theme.spacing(1, 0) },
  linkBox: { display: 'flex', alignItems: 'center', marginTop: 8 },
  arrow: { marginTop: '50px', alignSelf: 'flex-start' },
  favoriteIcon: { marginLeft: 'auto' },
}));

export const useCarouselStyles = makeStyles(theme => ({
  root: { position: 'relative', overflow: 'hidden', width: '100%' },
  carousel: {
    display: 'flex',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    paddingTop: theme.spacing(6),
    height: 400,
    alignItems: 'flex-start',
  },
}));

export const useBubbleItemStyles = makeStyles((theme: Theme) => ({
  clickable: {
    display: 'flex',
    cursor: 'pointer',
  },
  disabled: {
    cursor: 'not-allowed',
    pointerEvents: 'none',
    opacity: 0.5,
  },
  firstOffset: {
    marginLeft: '5%',
  },
  lastOffset: {
    marginRight: '5%',
  },
  ballContainer: {
    minWidth: 150,
    margin: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
  },
  ball: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    backgroundColor: '#559bd1',
  },
  completedBall: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    backgroundColor: theme.palette.status.ok,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: '#fff',
    fontSize: '1.5rem',
  },
  disabledBall: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    backgroundColor: theme.palette.action.disabledBackground,
  },
  text: {
    marginTop: theme.spacing(1),
    textAlign: 'center',
  },
  disabledText: {
    color: theme.palette.text.disabled,
  },
}));
