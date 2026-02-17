import{j as t,W as u,K as p,X as g}from"./iframe-sMBKWU31.js";import{r as h}from"./plugin-KZw8wpyZ.js";import{S as l,u as c,a as x}from"./useSearchModal-cpDnWGPn.js";import{s as S,M}from"./api-8cgTU-Lw.js";import{S as C}from"./SearchContext-B1QHPIR_.js";import{B as m}from"./Button-Cli-rbFr.js";import{m as f}from"./makeStyles-CxRaH0Ei.js";import{D as j,a as y,b as B}from"./DialogTitle-BVUnBRNe.js";import{B as D}from"./Box-DEmnSa5V.js";import{S as n}from"./Grid-DA2cDQ0c.js";import{S as I}from"./SearchType-C6g9JDXV.js";import{L as G}from"./List-BSQHhUkr.js";import{H as R}from"./DefaultResultListItem-62jqe5E9.js";import{w as k}from"./appWrappers-eZFc-QW7.js";import{SearchBar as v}from"./SearchBar-D29S7A1S.js";import{S as T}from"./SearchResult-DdxoD0l6.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DXelLq2z.js";import"./Plugin-CxICLDOB.js";import"./componentData-Dcj5yW_1.js";import"./useAnalytics-BN4IS_dq.js";import"./useApp-CzP7aWaG.js";import"./useRouteRef-B7L3dwPh.js";import"./index-DWl5mw-m.js";import"./ArrowForward-RdIbXTxo.js";import"./translation-CrgNo2tr.js";import"./Page-9gcu0GYD.js";import"./useMediaQuery-_e-NLKrj.js";import"./Divider-C88GTaaA.js";import"./ArrowBackIos-BWnnc_QM.js";import"./ArrowForwardIos-jq5c6rg3.js";import"./translation-DcP7Sucj.js";import"./lodash-xPEtg8gK.js";import"./useAsync-P2r1t-93.js";import"./useMountedState-BITwFL3c.js";import"./Modal-rmCQ-9KS.js";import"./Portal-B2DdDtMB.js";import"./Backdrop-BV2xfeC6.js";import"./styled-BMPMz7-8.js";import"./ExpandMore-DdjmPDN-.js";import"./AccordionDetails-kAZ0QxZ7.js";import"./index-B9sM2jn7.js";import"./Collapse-ClyK8pbD.js";import"./ListItem-DGmFFyTj.js";import"./ListContext-Bwj2wYBb.js";import"./ListItemIcon-CCniGYGo.js";import"./ListItemText-s_hEoLMP.js";import"./Tabs-CjvtQ0yh.js";import"./KeyboardArrowRight-CvAEKAJQ.js";import"./FormLabel-Cu4f3wkt.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DcWrHk7R.js";import"./InputLabel-_W0Qi16i.js";import"./Select-D9t4JlsY.js";import"./Popover-DiUPx_CD.js";import"./MenuItem-0DLEqo0Z.js";import"./Checkbox-DeL9rYNo.js";import"./SwitchBase-DOM2qKMD.js";import"./Chip-BOVvs6PE.js";import"./Link-DV5C9zz1.js";import"./index-Da0ZMUP-.js";import"./useObservable-DuCy-2Pl.js";import"./useIsomorphicLayoutEffect-rumP-uWZ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-LmxoL121.js";import"./useDebounce-CsWfj4Ku.js";import"./InputAdornment-BgR982YI.js";import"./TextField-DI00CgtA.js";import"./useElementFilter-DzHosq_Q.js";import"./EmptyState-BqoyzBdW.js";import"./Progress-CrhzjlRP.js";import"./LinearProgress-dwpM5ujd.js";import"./ResponseErrorPanel-UcndcnA6.js";import"./ErrorPanel-CfbretFH.js";import"./WarningPanel-oB0_mUGM.js";import"./MarkdownContent-B1YYWAz8.js";import"./CodeSnippet-DkraU1EJ.js";import"./CopyTextButton-BudiSnyu.js";import"./useCopyToClipboard-zlEu4_iu.js";import"./Tooltip-OhwkXjyi.js";import"./Popper-B2qoKkm9.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
