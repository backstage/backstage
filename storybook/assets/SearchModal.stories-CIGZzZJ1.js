import{j as t,W as u,K as p,X as g}from"./iframe-oBxK6qra.js";import{r as h}from"./plugin-CuRh18Sy.js";import{S as l,u as c,a as x}from"./useSearchModal-i0W2lMfo.js";import{s as S,M}from"./api-D5Z0z2y7.js";import{S as C}from"./SearchContext-c1qtT5Iu.js";import{B as m}from"./Button-4CvN94R9.js";import{m as f}from"./makeStyles-B3IkJU93.js";import{D as j,a as y,b as B}from"./DialogTitle-BWrRPoNU.js";import{B as D}from"./Box-DfiY0lfn.js";import{S as n}from"./Grid-B7p-OhlU.js";import{S as I}from"./SearchType-CQTCGib_.js";import{L as G}from"./List-Sd8wYk3i.js";import{H as R}from"./DefaultResultListItem-DANzSivq.js";import{w as k}from"./appWrappers-09f_435q.js";import{SearchBar as v}from"./SearchBar-CYssRl72.js";import{S as T}from"./SearchResult-CyILYsTn.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CrKJvzkT.js";import"./Plugin-BuOA5knj.js";import"./componentData-DWKDT7YM.js";import"./useAnalytics-CBg6STS1.js";import"./useApp-JFSQIXad.js";import"./useRouteRef-CeRIyqm-.js";import"./index-DgkS_dxy.js";import"./ArrowForward-C8jPSAsp.js";import"./translation-DXMkaFtU.js";import"./Page-7DYfll8K.js";import"./useMediaQuery-DOYaIRFf.js";import"./Divider-B1caK0_E.js";import"./ArrowBackIos-nLddHNLq.js";import"./ArrowForwardIos-PtApY0cC.js";import"./translation-DRT5dwJP.js";import"./lodash-C4zl_2vh.js";import"./useAsync-DV-HLRDl.js";import"./useMountedState-ZHVNtiRb.js";import"./Modal-BNme6v5r.js";import"./Portal-inACr_9c.js";import"./Backdrop-BH-gYwJy.js";import"./styled-CUSqWafa.js";import"./ExpandMore-BeGNZDZU.js";import"./AccordionDetails-G0oRx4zU.js";import"./index-B9sM2jn7.js";import"./Collapse-BiFZcuZY.js";import"./ListItem-DtIi3ktM.js";import"./ListContext-BbbmxUrC.js";import"./ListItemIcon-DwdQkudk.js";import"./ListItemText-DoAWL9zZ.js";import"./Tabs-BCrSGySj.js";import"./KeyboardArrowRight-CGi8ztYq.js";import"./FormLabel-C6c2aTJj.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CfUVLvnu.js";import"./InputLabel-CPIhuNrb.js";import"./Select-CBxP4NWp.js";import"./Popover-rtX2qvNk.js";import"./MenuItem-CRyYoLvR.js";import"./Checkbox-D5HwbVlY.js";import"./SwitchBase-8IBhqUMg.js";import"./Chip-BMaaalUZ.js";import"./Link-DTE78IDp.js";import"./index-cGfInv2G.js";import"./useObservable-BUf7RNMJ.js";import"./useIsomorphicLayoutEffect-FzTA6wfg.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DuyiRC1W.js";import"./useDebounce-CnPeAlWC.js";import"./InputAdornment-DDtIZbcA.js";import"./TextField-BZ_KWgUQ.js";import"./useElementFilter-B1Qw3Njh.js";import"./EmptyState-xz7D_oWo.js";import"./Progress-Bj3b54AP.js";import"./LinearProgress-Bxq6QL4V.js";import"./ResponseErrorPanel-BVKnP1_R.js";import"./ErrorPanel-DMsqwtMW.js";import"./WarningPanel-GQJY0cnz.js";import"./MarkdownContent-7zu0eLmB.js";import"./CodeSnippet-3bHpw8wN.js";import"./CopyTextButton-CNo3Wt0d.js";import"./useCopyToClipboard-C-otOoL_.js";import"./Tooltip-BmsdhjHf.js";import"./Popper-CGGPeLTJ.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
