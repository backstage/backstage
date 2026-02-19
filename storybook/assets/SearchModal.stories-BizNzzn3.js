import{j as t,W as u,K as p,X as g}from"./iframe-BBTbmRF3.js";import{r as h}from"./plugin-B9iT4UnY.js";import{S as l,u as c,a as x}from"./useSearchModal-8pmXbCmA.js";import{s as S,M}from"./api-C9RhU7rI.js";import{S as C}from"./SearchContext-4Zx13U1Y.js";import{B as m}from"./Button-BFfF-HNl.js";import{m as f}from"./makeStyles-BPqnV28r.js";import{D as j,a as y,b as B}from"./DialogTitle-DFqDHqUA.js";import{B as D}from"./Box-DFn50L67.js";import{S as n}from"./Grid-CuXpcFIC.js";import{S as I}from"./SearchType-C6P_4_n5.js";import{L as G}from"./List-CUBDdxMb.js";import{H as R}from"./DefaultResultListItem-DXpWnbkz.js";import{w as k}from"./appWrappers-DY1G6n5o.js";import{SearchBar as v}from"./SearchBar-BMNKxaEQ.js";import{S as T}from"./SearchResult-BqHa7HXB.js";import"./preload-helper-PPVm8Dsz.js";import"./index-t4tyj_dW.js";import"./Plugin-4JbwX_Bb.js";import"./componentData-J5VyXkwg.js";import"./useAnalytics-Ba0Akb_8.js";import"./useApp-CesNqOwY.js";import"./useRouteRef-LLhVV4A-.js";import"./index-BcYwVfc2.js";import"./ArrowForward-fE77s0W5.js";import"./translation-DxCyRXHx.js";import"./Page-DiFQ7PXZ.js";import"./useMediaQuery-DT-4_5LT.js";import"./Divider-BYkXUStE.js";import"./ArrowBackIos-BfFbtQZx.js";import"./ArrowForwardIos-DIbvszmk.js";import"./translation-DuXh6I3g.js";import"./lodash-CcPJG2Jc.js";import"./useAsync-Bt0obmC4.js";import"./useMountedState-BCYhz7B5.js";import"./Modal-CVrOJJ1o.js";import"./Portal-2y-oZ47a.js";import"./Backdrop-CAuzhThc.js";import"./styled-Cxigd6bq.js";import"./ExpandMore-DN4woXWK.js";import"./AccordionDetails-CLOLleIs.js";import"./index-B9sM2jn7.js";import"./Collapse-DmTiXi65.js";import"./ListItem-gGS09kMG.js";import"./ListContext-B4Kfs7vL.js";import"./ListItemIcon-CYaCETxs.js";import"./ListItemText-DFAT17VC.js";import"./Tabs-eGeBShWB.js";import"./KeyboardArrowRight-ButmExsd.js";import"./FormLabel-C5ozhNdG.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Bh9Dgqmt.js";import"./InputLabel-DFsXxLad.js";import"./Select-B4V4bCGs.js";import"./Popover-Du-NqFAp.js";import"./MenuItem-B1UhN6Vp.js";import"./Checkbox-Dd-H0G2i.js";import"./SwitchBase-DuCFH31y.js";import"./Chip-BeXEoBTY.js";import"./Link-C6rUrHHj.js";import"./index-CaZzWUdT.js";import"./useObservable-CGFO3tZx.js";import"./useIsomorphicLayoutEffect-D7BqDLd3.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-rPgCK2Dy.js";import"./useDebounce-wKBUQVmF.js";import"./InputAdornment-CUX2PDJo.js";import"./TextField-BkB0Xn9E.js";import"./useElementFilter-CXq_KSNk.js";import"./EmptyState-DuGIJCAZ.js";import"./Progress-Cw_9XZKG.js";import"./LinearProgress-CONWFXxn.js";import"./ResponseErrorPanel-Dhn6RZp5.js";import"./ErrorPanel-C_yw0DMG.js";import"./WarningPanel-EUHTMGmd.js";import"./MarkdownContent-Cn2mK-dU.js";import"./CodeSnippet-DUB0oVp5.js";import"./CopyTextButton-CAs-B4cE.js";import"./useCopyToClipboard-BWVjd4W6.js";import"./Tooltip-CdzZ4H0f.js";import"./Popper-BgTVAObk.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
