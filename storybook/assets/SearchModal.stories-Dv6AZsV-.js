import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-DbI6eD9d.js";import{r as x}from"./plugin-DDarW-d_.js";import{S as l,u as c,a as S}from"./useSearchModal-BQ0SEdAb.js";import{s as M,M as C}from"./api-6E7uRubi.js";import{S as f}from"./SearchContext-CyGnXWb0.js";import{B as m}from"./Button-BcRwA9XB.js";import{D as j,a as y,b as B}from"./DialogTitle-Bnldogbn.js";import{B as D}from"./Box-B_5N4RtH.js";import{S as n}from"./Grid-Bk30WVxK.js";import{S as I}from"./SearchType-Dy8zAoY-.js";import{L as G}from"./List-B28Z8F3S.js";import{H as R}from"./DefaultResultListItem-CpPvrFSi.js";import{w as k}from"./appWrappers-ysziI5ZA.js";import{SearchBar as v}from"./SearchBar-DLUw6U3I.js";import{S as T}from"./SearchResult-Co8sa4DF.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DiAi4R73.js";import"./Plugin-Bb9hU_OU.js";import"./componentData-BY8qZ-sE.js";import"./useAnalytics-DxBTGODq.js";import"./useApp-By-GP-XF.js";import"./useRouteRef-DM8Co2Wr.js";import"./index-BpirQtKL.js";import"./ArrowForward-0RbzQf1a.js";import"./translation-Cvlk36HP.js";import"./Page-DQpzUFaD.js";import"./useMediaQuery-CTY4Nnqc.js";import"./Divider-CO6unGqT.js";import"./ArrowBackIos-tpdx3Imw.js";import"./ArrowForwardIos-BQVhREf6.js";import"./translation-Dhp9zd5W.js";import"./lodash-Czox7iJy.js";import"./useAsync-CgxXauOf.js";import"./useMountedState-x9skCR0V.js";import"./Modal-DSfyr1-Y.js";import"./Portal-1epzlOBv.js";import"./Backdrop-lRnFqTe6.js";import"./styled-Ca3T9n7C.js";import"./ExpandMore-CGV1QMso.js";import"./AccordionDetails-BibEu-2M.js";import"./index-B9sM2jn7.js";import"./Collapse-DuLdQbrv.js";import"./ListItem-BiTyGeEf.js";import"./ListContext-D83WNTGA.js";import"./ListItemIcon-CsFAW-CF.js";import"./ListItemText-Cbx6sNjJ.js";import"./Tabs-BTd4sB_-.js";import"./KeyboardArrowRight-CbQGrC89.js";import"./FormLabel-CwbdYCqt.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C0fnUCwO.js";import"./InputLabel-CkcniXjG.js";import"./Select-Dy4sDYmj.js";import"./Popover-D25hhzHL.js";import"./MenuItem-RQAmCbgW.js";import"./Checkbox-D9R8p-RM.js";import"./SwitchBase-C7SyIN2D.js";import"./Chip-DcdlJnHg.js";import"./Link-BjQEuYrU.js";import"./useObservable-BAzjAwDp.js";import"./useIsomorphicLayoutEffect-BUXckimh.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CoqaUoNG.js";import"./useDebounce-Cokz6vSP.js";import"./InputAdornment-Da8zEuQb.js";import"./TextField-LN4dMYoN.js";import"./useElementFilter-CSWzxmpf.js";import"./EmptyState-DjQQQdXp.js";import"./Progress-SWgR2KVx.js";import"./LinearProgress-C5LwvWze.js";import"./ResponseErrorPanel-D8-NS-6t.js";import"./ErrorPanel-DlUDd-32.js";import"./WarningPanel-M9-9T0mj.js";import"./MarkdownContent-BnX0THa8.js";import"./CodeSnippet-Cbn7wM4l.js";import"./CopyTextButton-B5-s-8U_.js";import"./useCopyToClipboard-DYI1pKNQ.js";import"./Tooltip-Bq7wKed5.js";import"./Popper-9ImL6E1W.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
