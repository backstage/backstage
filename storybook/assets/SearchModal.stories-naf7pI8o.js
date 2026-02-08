import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-BVVWNhNF.js";import{r as x}from"./plugin-Bs5jvbog.js";import{S as l,u as c,a as S}from"./useSearchModal-CGyByTIc.js";import{s as M,M as C}from"./api-BgdT1u7W.js";import{S as f}from"./SearchContext-Dr2dYMQS.js";import{B as m}from"./Button-BmiFnTzM.js";import{D as j,a as y,b as B}from"./DialogTitle-Y7DgGyxp.js";import{B as D}from"./Box-I6qpNjup.js";import{S as n}from"./Grid-BhWDjvJh.js";import{S as I}from"./SearchType-Cu5UpmrD.js";import{L as G}from"./List-CeUn_h_G.js";import{H as R}from"./DefaultResultListItem-gz3oZSGo.js";import{w as k}from"./appWrappers-ChYKtzjD.js";import{SearchBar as v}from"./SearchBar-CDDFPFPf.js";import{S as T}from"./SearchResult-C_TRX4DZ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C7txEyER.js";import"./Plugin-CgTcVBUB.js";import"./componentData-CcSGmjOp.js";import"./useAnalytics-DOlQNDHl.js";import"./useApp-CDZ4N_T1.js";import"./useRouteRef-BBaiKSnw.js";import"./index-Cytn1js_.js";import"./ArrowForward-B0TORj3F.js";import"./translation-D0Xh7ORG.js";import"./Page-CG1H592S.js";import"./useMediaQuery--G-u91BY.js";import"./Divider-BEnyyVTc.js";import"./ArrowBackIos-BK1w3ZPk.js";import"./ArrowForwardIos-1QFgEfq1.js";import"./translation-BM2QIJ0G.js";import"./lodash-Czox7iJy.js";import"./useAsync-C3TxRl9Y.js";import"./useMountedState-Lmv_QRT4.js";import"./Modal-BSykfrg4.js";import"./Portal-DukR7Qds.js";import"./Backdrop-Dz78wVML.js";import"./styled-BXlk9tEQ.js";import"./ExpandMore-DowbklPi.js";import"./AccordionDetails-RAdNuemB.js";import"./index-B9sM2jn7.js";import"./Collapse-BYFMHxpC.js";import"./ListItem-896bCnNz.js";import"./ListContext-D6HHPv4d.js";import"./ListItemIcon-BiGNPOOS.js";import"./ListItemText-rQpXHQMd.js";import"./Tabs-DI9iw6_a.js";import"./KeyboardArrowRight-7omQ8tBW.js";import"./FormLabel-DGm40x93.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C0REJyRQ.js";import"./InputLabel-iFQrC6eB.js";import"./Select-DfAPcZ2_.js";import"./Popover-pnksybnm.js";import"./MenuItem-BqVP50yc.js";import"./Checkbox-_nRTxqzE.js";import"./SwitchBase-CeBSML66.js";import"./Chip-i5Eu3pXX.js";import"./Link-C8sZRddr.js";import"./useObservable-UOYoI0kL.js";import"./useIsomorphicLayoutEffect-C2UzxJwg.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DDHYanuF.js";import"./useDebounce-0cCcFGDN.js";import"./InputAdornment-Bpv_O3l5.js";import"./TextField-CzukziRB.js";import"./useElementFilter-CC1MBhtG.js";import"./EmptyState-B2Vwa899.js";import"./Progress-BJ9nCG4m.js";import"./LinearProgress-9vQCJz3x.js";import"./ResponseErrorPanel-CmFsIyOc.js";import"./ErrorPanel-CIBQJLIP.js";import"./WarningPanel-BKd-aVLN.js";import"./MarkdownContent-DIwENC3V.js";import"./CodeSnippet-DsEjqB14.js";import"./CopyTextButton-D4a_r689.js";import"./useCopyToClipboard-BPci2e7u.js";import"./Tooltip-B6-nubZA.js";import"./Popper-CpEGPy4_.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
