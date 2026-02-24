import{j as t,W as u,K as p,X as g}from"./iframe-BzU7-g6W.js";import{r as h}from"./plugin-CuOXFwuH.js";import{S as l,u as c,a as x}from"./useSearchModal-D7PHCVEW.js";import{s as S,M}from"./api-EALBsGVP.js";import{S as C}from"./SearchContext-CbfufNhX.js";import{B as m}from"./Button-CrpaRf-H.js";import{m as f}from"./makeStyles-S8VF_kfg.js";import{D as j,a as y,b as B}from"./DialogTitle-HMdj6FuL.js";import{B as D}from"./Box-Buols8Z9.js";import{S as n}from"./Grid-B3qBpLSb.js";import{S as I}from"./SearchType-Brx2gcUG.js";import{L as G}from"./List-_WnCGckP.js";import{H as R}from"./DefaultResultListItem-qI5NvxOO.js";import{w as k}from"./appWrappers-CdgMqFjM.js";import{SearchBar as v}from"./SearchBar-DLqcxLl0.js";import{S as T}from"./SearchResult-Cgo6kBaJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D8DW0KAr.js";import"./Plugin-CBt7R1Nb.js";import"./componentData-3DuZtJh2.js";import"./useAnalytics-CzoS-In4.js";import"./useApp-CYpMgEga.js";import"./useRouteRef-BCQvC7nL.js";import"./index-CgRTFS8p.js";import"./ArrowForward-BisrQ3q9.js";import"./translation-Ckb5Ko84.js";import"./Page-BMC0DIpM.js";import"./useMediaQuery-CFwYGRum.js";import"./Divider-eSNn4IOg.js";import"./ArrowBackIos-CAVytJB8.js";import"./ArrowForwardIos-Cu3kZ4gy.js";import"./translation-TFSwDWEj.js";import"./lodash-CgiI-b7o.js";import"./useAsync-CuQ5cV9M.js";import"./useMountedState-kh3LYvIW.js";import"./Modal-CBIhH-ZN.js";import"./Portal-CgRRNkEQ.js";import"./Backdrop-Bu53pH1k.js";import"./styled-CKk5njoZ.js";import"./ExpandMore-B07BKBmU.js";import"./AccordionDetails-s3m5U6U0.js";import"./index-B9sM2jn7.js";import"./Collapse-ByHAuMFu.js";import"./ListItem-Cdpwxzx8.js";import"./ListContext-BaISySc_.js";import"./ListItemIcon-YXzgYqAm.js";import"./ListItemText-joEMPdaR.js";import"./Tabs-CfX9Hd9d.js";import"./KeyboardArrowRight-D-flldRH.js";import"./FormLabel-DnrPLeAV.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CCSUUg6C.js";import"./InputLabel-BTZCDr4e.js";import"./Select-C3BmRJP_.js";import"./Popover-DWFOE5cT.js";import"./MenuItem-C5wiJzzA.js";import"./Checkbox-BOHm3DKz.js";import"./SwitchBase-CkYcqQ1v.js";import"./Chip-BZqhero0.js";import"./Link-CKRvx-Sg.js";import"./index-tkVjLpcC.js";import"./useObservable-DIEjJtdc.js";import"./useIsomorphicLayoutEffect-BFR8qrRv.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-B40039-q.js";import"./useDebounce-CyUemRTp.js";import"./InputAdornment-BNXtgqg7.js";import"./TextField-DFnH9uN2.js";import"./useElementFilter-CbMjVubn.js";import"./EmptyState-CThUHRBZ.js";import"./Progress-DoWtgHsB.js";import"./LinearProgress-Bwgh_mlC.js";import"./ResponseErrorPanel-D3bQAOFR.js";import"./ErrorPanel-Dgo-TBes.js";import"./WarningPanel-Ci7xOnSb.js";import"./MarkdownContent-CV-HF-XS.js";import"./CodeSnippet-Bew-W-M8.js";import"./CopyTextButton-Cuecx-v0.js";import"./useCopyToClipboard-CrqNhbgM.js";import"./Tooltip-DkbrsvZ9.js";import"./Popper-DYEx6Kul.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
