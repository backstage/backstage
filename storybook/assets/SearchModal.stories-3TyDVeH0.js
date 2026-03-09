import{j as t,W as u,K as p,X as g}from"./iframe-DyesWYDr.js";import{r as h}from"./plugin-C3904xlt.js";import{S as l,u as c,a as x}from"./useSearchModal-CChJH5rW.js";import{s as S,M}from"./api-DFWKgIT5.js";import{S as C}from"./SearchContext-DsS7fprA.js";import{B as m}from"./Button-MW9EVgdX.js";import{m as f}from"./makeStyles-qFKHfDO-.js";import{D as j,a as y,b as B}from"./DialogTitle-D19xPA6i.js";import{B as D}from"./Box-km7zlvMw.js";import{S as n}from"./Grid-BVpgiwP1.js";import{S as I}from"./SearchType-Dbb1VT8n.js";import{L as G}from"./List-CxzFB0_1.js";import{H as R}from"./DefaultResultListItem-DMucJ1ce.js";import{w as k}from"./appWrappers-CIE-ACxq.js";import{SearchBar as v}from"./SearchBar-DE164LGI.js";import{S as T}from"./SearchResult-BWOvOykJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CReJcDE8.js";import"./Plugin-D3Zvlzkd.js";import"./componentData-CE6gDfDb.js";import"./useAnalytics-C5Z3C1Xs.js";import"./useApp-C7maoOfG.js";import"./useRouteRef-Dk-XA4qn.js";import"./index-Cs_UWgtM.js";import"./ArrowForward-DPzcsjLR.js";import"./translation-6BWyLM7H.js";import"./Page-Xww77KL5.js";import"./useMediaQuery-DwK3YrQh.js";import"./Divider-BJkEr-uk.js";import"./ArrowBackIos-DO5Kk4Mk.js";import"./ArrowForwardIos-DOauLqng.js";import"./translation-8DLg5rHQ.js";import"./lodash-CU-eNkSq.js";import"./useAsync-BEXsu5H_.js";import"./useMountedState-BVo_ywvs.js";import"./Modal-EBxf97A6.js";import"./Portal-rWyDgme_.js";import"./Backdrop-O1ORZMPk.js";import"./styled-Dfa_ap0s.js";import"./ExpandMore-CDUPlP8M.js";import"./AccordionDetails-Cmbt_HLo.js";import"./index-B9sM2jn7.js";import"./Collapse-WPBzMyoM.js";import"./ListItem-CPW55C5k.js";import"./ListContext-f5RS08Ml.js";import"./ListItemIcon-CWQB-FmG.js";import"./ListItemText-3YzUEJeB.js";import"./Tabs-DhAzL90Q.js";import"./KeyboardArrowRight-BtY-fzeY.js";import"./FormLabel-e3vZSwDJ.js";import"./formControlState-D9w6LCG7.js";import"./InputLabel-B-liUlkL.js";import"./Select-CBpbyfVI.js";import"./Popover-Dcp5jBjk.js";import"./MenuItem-kQl_Zi2j.js";import"./Checkbox-VZm6ji9q.js";import"./SwitchBase-B1f76LbS.js";import"./Chip-DjIITCcI.js";import"./Link-hxVkChoh.js";import"./index-FhOPq4Td.js";import"./useObservable-QDmBsl3H.js";import"./useIsomorphicLayoutEffect-BU3mBuq6.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BgID89m8.js";import"./useDebounce-BWARWYow.js";import"./InputAdornment-DqrPBz0C.js";import"./TextField-DuVfz1FR.js";import"./useElementFilter-DEIAWNG9.js";import"./EmptyState-TS7SPgHB.js";import"./Progress-CpSjr0Qn.js";import"./LinearProgress-B9wilz5s.js";import"./ResponseErrorPanel-DXIYAJf8.js";import"./ErrorPanel-D7sxCFFv.js";import"./WarningPanel-KvN-Mhwi.js";import"./MarkdownContent-BrwT6_1g.js";import"./CodeSnippet-BjY6zTEj.js";import"./CopyTextButton-BVgCDtuW.js";import"./useCopyToClipboard-DEw17vii.js";import"./Tooltip-BTxoZZD7.js";import"./Popper-CEy5HCpt.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},io={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{r as CustomModal,e as Default,lo as __namedExportsOrder,io as default};
