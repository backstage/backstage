import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-DLcIH_b-.js";import{r as x}from"./plugin-CcTrSY9C.js";import{S as l,u as c,a as S}from"./useSearchModal-CovTpNgy.js";import{s as M,M as C}from"./api-DkwNX4It.js";import{S as f}from"./SearchContext-zR3MpwzH.js";import{B as m}from"./Button-B2shhtfY.js";import{D as j,a as y,b as B}from"./DialogTitle--QOAyxVA.js";import{B as D}from"./Box-DaYdGGLQ.js";import{S as n}from"./Grid-CHWXErYD.js";import{S as I}from"./SearchType-Dlher0YZ.js";import{L as G}from"./List-DgCkyPF-.js";import{H as R}from"./DefaultResultListItem-CWwZzDUF.js";import{w as k}from"./appWrappers-c50PuD_P.js";import{SearchBar as v}from"./SearchBar-Bajp-v1s.js";import{S as T}from"./SearchResult-DpV4DHt1.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BuSYSsVm.js";import"./Plugin-BWXACEjV.js";import"./componentData-C1Rjz3DB.js";import"./useAnalytics-DDULU5MS.js";import"./useApp-DqnX_mGX.js";import"./useRouteRef-D96ygvpF.js";import"./index-DTUFdyDi.js";import"./ArrowForward-PHFQlPVc.js";import"./translation-D6Qs7K8B.js";import"./Page-CwG6jbxu.js";import"./useMediaQuery-Dfb_HH6S.js";import"./Divider-fjKwa6Mv.js";import"./ArrowBackIos-CLa3glac.js";import"./ArrowForwardIos-DdjGurRX.js";import"./translation-Z3ea3ATC.js";import"./lodash-rxUtCtQt.js";import"./useAsync-Dzs_Z8Sa.js";import"./useMountedState-CJM5rP6v.js";import"./Modal-DqSKD8Sk.js";import"./Portal-D2sb6xU7.js";import"./Backdrop-DbozdCou.js";import"./styled-CJB3T-Oh.js";import"./ExpandMore-C68SGr3c.js";import"./AccordionDetails-tL39bQia.js";import"./index-B9sM2jn7.js";import"./Collapse-BJd8DAV0.js";import"./ListItem-BtxOUJ8W.js";import"./ListContext-C-a3EO19.js";import"./ListItemIcon-BEyypNaA.js";import"./ListItemText-C61nqRKy.js";import"./Tabs-DSMbnArp.js";import"./KeyboardArrowRight-DUtyBy6Z.js";import"./FormLabel-lfFIv-fQ.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BpQOuyS3.js";import"./InputLabel-C3T0rSQI.js";import"./Select-pav2cxO6.js";import"./Popover-C_GbUgIX.js";import"./MenuItem-BUYUm_bi.js";import"./Checkbox-D9UkaZD3.js";import"./SwitchBase-C5WUqKwt.js";import"./Chip-DN67F2sn.js";import"./Link-Dc4YfHTT.js";import"./useObservable-DOAzawHV.js";import"./useIsomorphicLayoutEffect-5pUHGSZD.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CrjyF_6T.js";import"./useDebounce-CjJdQA69.js";import"./InputAdornment-B7x30SOs.js";import"./TextField-EdI8PNcf.js";import"./useElementFilter-BH3ZyGrQ.js";import"./EmptyState-r32sFuTA.js";import"./Progress-DJSWofhf.js";import"./LinearProgress-C6C4yS4C.js";import"./ResponseErrorPanel-DaAlpNEw.js";import"./ErrorPanel-DxXUdzmq.js";import"./WarningPanel-B3vPuQN4.js";import"./MarkdownContent-Cp_Yq8fi.js";import"./CodeSnippet-C1jqIUTN.js";import"./CopyTextButton-BGx5v8bI.js";import"./useCopyToClipboard-D3pZMe8I.js";import"./Tooltip-DOrjEsZ_.js";import"./Popper-BhVwcAhT.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
