import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-BdfNw3Ub.js";import{r as x}from"./plugin-CeY8iE9J.js";import{S as l,u as c,a as S}from"./useSearchModal-DggooQ5o.js";import{s as M,M as C}from"./api-C8OK6Quv.js";import{S as f}from"./SearchContext-3E3qajeX.js";import{B as m}from"./Button-B1NvJhKb.js";import{D as j,a as y,b as B}from"./DialogTitle-DI-aEKjw.js";import{B as D}from"./Box-Ck7a0B2s.js";import{S as n}from"./Grid-ClCC6X0d.js";import{S as I}from"./SearchType-DGlBw257.js";import{L as G}from"./List-Be-141Yt.js";import{H as R}from"./DefaultResultListItem-C6TxEj0R.js";import{w as k}from"./appWrappers-DY8qCh6j.js";import{SearchBar as v}from"./SearchBar-u4I_wzZg.js";import{S as T}from"./SearchResult-BUIuPIX8.js";import"./preload-helper-PPVm8Dsz.js";import"./index-tTppuequ.js";import"./Plugin-CIPiPeTO.js";import"./componentData-Bbvl56dJ.js";import"./useAnalytics-CIau1Q_f.js";import"./useApp-CClJ7qR8.js";import"./useRouteRef-alWxSySK.js";import"./index-DGTjwYkT.js";import"./ArrowForward-C7IoLyo6.js";import"./translation-BjXFKems.js";import"./Page-yyZsxk-d.js";import"./useMediaQuery-D9fRC3z6.js";import"./Divider--Mq8jTWg.js";import"./ArrowBackIos-Ct7tmHC1.js";import"./ArrowForwardIos-HNMxm6Zl.js";import"./translation-Ct1cdr3-.js";import"./lodash-Czox7iJy.js";import"./useAsync-DF3--aFh.js";import"./useMountedState-B5cOerk8.js";import"./Modal-DSvl6f6m.js";import"./Portal-CuRfOwRS.js";import"./Backdrop-NgNpouL3.js";import"./styled-BblI00As.js";import"./ExpandMore-dcQwlkUA.js";import"./AccordionDetails-CPLXq-Rf.js";import"./index-B9sM2jn7.js";import"./Collapse-DwRSSlvv.js";import"./ListItem-eROPvDGl.js";import"./ListContext-C0BE_woo.js";import"./ListItemIcon-BOFtPmK_.js";import"./ListItemText-Cap62zTH.js";import"./Tabs-ngKIyvZc.js";import"./KeyboardArrowRight-Bnbwx8Sn.js";import"./FormLabel-DWdluDaY.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BxSTtT_2.js";import"./InputLabel-r-PNBXDp.js";import"./Select-ZcZhQIkV.js";import"./Popover-CGynt5_q.js";import"./MenuItem-DPImcXmX.js";import"./Checkbox-BIcWHa0H.js";import"./SwitchBase-BNjamnql.js";import"./Chip-Cr55Mtk4.js";import"./Link-CYv59bNI.js";import"./useObservable-CIl4-77m.js";import"./useIsomorphicLayoutEffect-C0bErC-3.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-xSMKwM_v.js";import"./useDebounce-CQ0cQALR.js";import"./InputAdornment-D63p0THy.js";import"./TextField-6dc2YLo_.js";import"./useElementFilter-CeK7-6nc.js";import"./EmptyState-DmgrcMl-.js";import"./Progress-BnUoeBZv.js";import"./LinearProgress-VUGJBiud.js";import"./ResponseErrorPanel-Mp9n3s9I.js";import"./ErrorPanel-NKrLmxAy.js";import"./WarningPanel-Bslmfj1Q.js";import"./MarkdownContent-B84ymYDA.js";import"./CodeSnippet-DtZ5NGdI.js";import"./CopyTextButton-DDSW1go4.js";import"./useCopyToClipboard-CQmr7kQ1.js";import"./Tooltip-LFPLy9FS.js";import"./Popper-CW4DzWu0.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
