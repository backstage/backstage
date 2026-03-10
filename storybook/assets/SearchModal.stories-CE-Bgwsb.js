import{j as t,W as u,K as p,X as g}from"./iframe-ByBrTvma.js";import{r as h}from"./plugin-CwF9-oP3.js";import{S as l,u as c,a as x}from"./useSearchModal-CbMRqg_u.js";import{s as S,M}from"./api-UBCebQ5l.js";import{S as C}from"./SearchContext-xgph2lm8.js";import{B as m}from"./Button-CEeloNNz.js";import{m as f}from"./makeStyles-DbNf7az6.js";import{D as j,a as y,b as B}from"./DialogTitle-DtfPaZef.js";import{B as D}from"./Box-BTaWTKK7.js";import{S as n}from"./Grid-CVJ59jxc.js";import{S as I}from"./SearchType-BohH6r4-.js";import{L as G}from"./List-COw7E98o.js";import{H as R}from"./DefaultResultListItem-BuWarAnT.js";import{w as k}from"./appWrappers-DEhvokBS.js";import{SearchBar as v}from"./SearchBar-CpYoW64p.js";import{S as T}from"./SearchResult-BddYTd_Y.js";import"./preload-helper-PPVm8Dsz.js";import"./index-OjFV48uN.js";import"./Plugin-DZyQaL-e.js";import"./componentData-CUWvUlYo.js";import"./useAnalytics-BFlIYKys.js";import"./useApp-BryTheKO.js";import"./useRouteRef-5-P7pYbC.js";import"./index-gUHaPa4H.js";import"./ArrowForward-CSe53tDL.js";import"./translation-R6pCRZtH.js";import"./Page-SvpAEZhG.js";import"./useMediaQuery-Hcix2Tyu.js";import"./Divider-BW-RA_wr.js";import"./ArrowBackIos-CGbgmSRE.js";import"./ArrowForwardIos-BAW_xBwV.js";import"./translation-DJxPYsGq.js";import"./lodash-C3FwuLPO.js";import"./useAsync-Coek-nsh.js";import"./useMountedState-ClRjsrJA.js";import"./Modal-CuM9MEfQ.js";import"./Portal-UHK3xnYf.js";import"./Backdrop-CecYDOxJ.js";import"./styled-D_mu6x9U.js";import"./ExpandMore-DKDbIoE-.js";import"./AccordionDetails-Cf7eRlhQ.js";import"./index-B9sM2jn7.js";import"./Collapse-ZuDko566.js";import"./ListItem-DP4h3WVe.js";import"./ListContext-BWIL9NnA.js";import"./ListItemIcon-C7DzTh9T.js";import"./ListItemText-CUqA2Zhn.js";import"./Tabs-eCTPdPkN.js";import"./KeyboardArrowRight-DeYWZjFB.js";import"./FormLabel-C3XfY-xg.js";import"./formControlState-BgLzN1_W.js";import"./InputLabel-CNhKa_L9.js";import"./Select-t9g7PN1b.js";import"./Popover-PY7eTZ56.js";import"./MenuItem-C3sEJ41p.js";import"./Checkbox-C59F0B98.js";import"./SwitchBase-FUXJ7j10.js";import"./Chip-CrLK_KJL.js";import"./Link-1Uz9xKdo.js";import"./index-D6Jq2HRw.js";import"./useObservable-Ceq4tTAb.js";import"./useIsomorphicLayoutEffect--FgWIbd6.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BJGPNYlc.js";import"./useDebounce-B5v0qqA0.js";import"./InputAdornment-B_X04Sdi.js";import"./TextField-DwgOCjmq.js";import"./useElementFilter-CnNvZgq2.js";import"./EmptyState-B9CcLkHj.js";import"./Progress-BtDqvgNo.js";import"./LinearProgress-CkXc8EHC.js";import"./ResponseErrorPanel-CSdR3VFn.js";import"./ErrorPanel-C4zrIH-w.js";import"./WarningPanel-HKNPeiOU.js";import"./MarkdownContent-DAycQpu1.js";import"./CodeSnippet-B_m9Zbl6.js";import"./CopyTextButton-B0WUg9Mo.js";import"./useCopyToClipboard-CowksdiF.js";import"./Tooltip-Bj3ZS_EF.js";import"./Popper-batIr5mA.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},io={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
