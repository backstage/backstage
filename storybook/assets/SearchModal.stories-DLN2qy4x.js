import{j as t,W as u,K as p,X as g}from"./iframe-B5eUq3Se.js";import{r as h}from"./plugin-CfDsj8uP.js";import{S as l,u as c,a as x}from"./useSearchModal-Iw4UNqg4.js";import{s as S,M}from"./api-B14kPR2y.js";import{S as C}from"./SearchContext-Cz_O2Ud4.js";import{B as m}from"./Button-Ch2ew7F2.js";import{m as f}from"./makeStyles-CutSd0r9.js";import{D as j,a as y,b as B}from"./DialogTitle-2711N3zz.js";import{B as D}from"./Box-Dc6HtbNm.js";import{S as n}from"./Grid-BE58qVmP.js";import{S as I}from"./SearchType-ymw5_mlB.js";import{L as G}from"./List-Cr_JFt2Y.js";import{H as R}from"./DefaultResultListItem-C_9qa7mH.js";import{w as k}from"./appWrappers-D_vYNmvE.js";import{SearchBar as v}from"./SearchBar-D0Cv3GiU.js";import{S as T}from"./SearchResult-qVjUyf3k.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CFc3IhPD.js";import"./Plugin-_WVtBBzV.js";import"./componentData-CPUvoYik.js";import"./useAnalytics-Bf6-Pwlo.js";import"./useApp-D6Xkw0OG.js";import"./useRouteRef-B5pqcXOc.js";import"./index-Cz1Ci6GP.js";import"./ArrowForward-B7vJ0teh.js";import"./translation-qZvp_T08.js";import"./Page-DOgAhImI.js";import"./useMediaQuery-CkM9pT3L.js";import"./Divider-_E91SnDF.js";import"./ArrowBackIos-CH-MXp_p.js";import"./ArrowForwardIos-CIzaDnlc.js";import"./translation-DKDegIeL.js";import"./lodash-D0fT-qTZ.js";import"./useAsync-DSFOvIAI.js";import"./useMountedState-ByxWK81W.js";import"./Modal-BjTDIRku.js";import"./Portal-DpJbamzY.js";import"./Backdrop-CBENJKbO.js";import"./styled-CctU0TIs.js";import"./ExpandMore-C0apesZO.js";import"./AccordionDetails-C18KfYNK.js";import"./index-B9sM2jn7.js";import"./Collapse-BH0sj3lj.js";import"./ListItem-Cf7Arzhs.js";import"./ListContext-BhsEYfmX.js";import"./ListItemIcon-_8ZbDfZV.js";import"./ListItemText-WVljPJU4.js";import"./Tabs-COBHJBkt.js";import"./KeyboardArrowRight-XjFm4ImS.js";import"./FormLabel--ORxnC5j.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CYFO1Jpf.js";import"./InputLabel-BKzBWkWH.js";import"./Select-Bp0k1kVp.js";import"./Popover-Bud6loLp.js";import"./MenuItem-gAwJBhQl.js";import"./Checkbox-CcX-g6yX.js";import"./SwitchBase-C4mbPAhx.js";import"./Chip-BdTMGwlk.js";import"./Link-D4HWsLnT.js";import"./index-CNwWdbfK.js";import"./useObservable-CyX3WU3z.js";import"./useIsomorphicLayoutEffect-gcdEgIho.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BDehEYi3.js";import"./useDebounce-Bn7JMTxl.js";import"./InputAdornment-Cs6EJLF-.js";import"./TextField-Bm6cHHZK.js";import"./useElementFilter-C-OsyMSQ.js";import"./EmptyState-BIvnGE8i.js";import"./Progress-Ct9o1gFe.js";import"./LinearProgress-BrBDKyJZ.js";import"./ResponseErrorPanel-org46fpQ.js";import"./ErrorPanel-4U_LahUX.js";import"./WarningPanel-DMjY7bER.js";import"./MarkdownContent-C-dh1sK0.js";import"./CodeSnippet-BmhEvva_.js";import"./CopyTextButton-DGFhLiSC.js";import"./useCopyToClipboard-DbbNH5jP.js";import"./Tooltip-D7_OCLcm.js";import"./Popper-DZlzY0sF.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
