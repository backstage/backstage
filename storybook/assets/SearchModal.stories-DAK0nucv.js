import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-DA79yDb5.js";import{r as x}from"./plugin-Pizw1Yp2.js";import{S as l,u as c,a as S}from"./useSearchModal-mPhlcSLG.js";import{s as M,M as C}from"./api-Q_UaGI12.js";import{S as f}from"./SearchContext-DzLP-t5m.js";import{B as m}from"./Button-DhPtekNk.js";import{D as j,a as y,b as B}from"./DialogTitle-Cam7H8C2.js";import{B as D}from"./Box-BVQ5Vy1y.js";import{S as n}from"./Grid-BPnxYFEE.js";import{S as I}from"./SearchType-vXsVziWo.js";import{L as G}from"./List-nEGPw4NA.js";import{H as R}from"./DefaultResultListItem-A86S5rSW.js";import{w as k}from"./appWrappers-n6jVhqF6.js";import{SearchBar as v}from"./SearchBar-CYGF-wUN.js";import{S as T}from"./SearchResult-DriT6L6q.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C7jcciOT.js";import"./Plugin-CYrkOIGL.js";import"./componentData-Cd7zESh7.js";import"./useAnalytics-C702rZt-.js";import"./useApp-PXZC3w6P.js";import"./useRouteRef-Vppi1dhZ.js";import"./index-Yr_6lw0r.js";import"./ArrowForward-2Mv1uxa3.js";import"./translation-BJh2AmjI.js";import"./Page-BYqNdESC.js";import"./useMediaQuery-BBYo_eUR.js";import"./Divider-CFY8fi3w.js";import"./ArrowBackIos-9iIzTy8H.js";import"./ArrowForwardIos-DtVhsP-t.js";import"./translation-Bhch4Adt.js";import"./lodash-DGzVoyEp.js";import"./useAsync-DJl5sWtJ.js";import"./useMountedState-3oFHoVCv.js";import"./Modal-B60MXtNN.js";import"./Portal-C0jNS9Vb.js";import"./Backdrop-CHWN49VN.js";import"./styled-BjxYaA7M.js";import"./ExpandMore-DR_zyoTC.js";import"./AccordionDetails-BvhTDe-h.js";import"./index-B9sM2jn7.js";import"./Collapse-Cl5eVhLP.js";import"./ListItem-BvihMH8Z.js";import"./ListContext-kCBY5dMI.js";import"./ListItemIcon-CA-UzzCC.js";import"./ListItemText-DGxuZd8I.js";import"./Tabs-y6K5hm8e.js";import"./KeyboardArrowRight-BVhmsON9.js";import"./FormLabel-TjC9rInK.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BmLf1aih.js";import"./InputLabel-gd17kBpy.js";import"./Select-CFAK0J49.js";import"./Popover-BhwuORe9.js";import"./MenuItem-0_tH9IJJ.js";import"./Checkbox-UrIrF_Y5.js";import"./SwitchBase-CsTKuz5r.js";import"./Chip-CS31cqIP.js";import"./Link-QsBbL45G.js";import"./useObservable-C8gw3qun.js";import"./useIsomorphicLayoutEffect-Bv5BjMnP.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-B8F08t70.js";import"./useDebounce-DuhShDFv.js";import"./InputAdornment-BA7v7ih0.js";import"./TextField-BeDroJxR.js";import"./useElementFilter-CXQDWOpp.js";import"./EmptyState-CMgYxJcW.js";import"./Progress-B5b0WD3f.js";import"./LinearProgress-C0uoyjEV.js";import"./ResponseErrorPanel-D3YzK3kR.js";import"./ErrorPanel-Cep-pimB.js";import"./WarningPanel-BYActx0S.js";import"./MarkdownContent-GLKDok0W.js";import"./CodeSnippet-CVIRDvuJ.js";import"./CopyTextButton-BbvOylv0.js";import"./useCopyToClipboard-BnMS7Zdt.js";import"./Tooltip-DjxuUc5H.js";import"./Popper-Vz_SQ7W_.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
