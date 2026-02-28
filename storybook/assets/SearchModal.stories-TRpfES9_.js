import{j as t,W as u,K as p,X as g}from"./iframe-BplO06yy.js";import{r as h}from"./plugin-DXxgpjto.js";import{S as l,u as c,a as x}from"./useSearchModal-CaGzJfhO.js";import{s as S,M}from"./api-4AnXlYUH.js";import{S as C}from"./SearchContext-DXl641gS.js";import{B as m}from"./Button-C6usRRIL.js";import{m as f}from"./makeStyles-hxoXH1CF.js";import{D as j,a as y,b as B}from"./DialogTitle-B5SG8TCp.js";import{B as D}from"./Box-NknjwhwY.js";import{S as n}from"./Grid-C0SXy4wX.js";import{S as I}from"./SearchType-ODXTnJ3P.js";import{L as G}from"./List-xC3JEtnt.js";import{H as R}from"./DefaultResultListItem-CxSijO8L.js";import{w as k}from"./appWrappers-D0VQpy1c.js";import{SearchBar as v}from"./SearchBar-C0YeD3Ik.js";import{S as T}from"./SearchResult-CVJiM0ss.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CfXq-Dh6.js";import"./Plugin-JYvMRdDp.js";import"./componentData-BW-CxUSe.js";import"./useAnalytics-yuQdOfMk.js";import"./useApp-Clg36dJH.js";import"./useRouteRef-ChpD-Skd.js";import"./index-BquTymTZ.js";import"./ArrowForward-Bgqks8mi.js";import"./translation-DU4kQpWS.js";import"./Page-RXbxvGt0.js";import"./useMediaQuery-XLy7WHO3.js";import"./Divider-DQ_NQG7A.js";import"./ArrowBackIos-CmFcXDf-.js";import"./ArrowForwardIos-D0OLO5bk.js";import"./translation-DaWHmguP.js";import"./lodash-Bx2jcK7O.js";import"./useAsync-B2kPvg_w.js";import"./useMountedState-CjXeUMpc.js";import"./Modal-yWMHuEv7.js";import"./Portal-Ax05yPmo.js";import"./Backdrop-C2WOSyoT.js";import"./styled-BRp8APBl.js";import"./ExpandMore-BcJaZxd5.js";import"./AccordionDetails-BKmhvlN_.js";import"./index-B9sM2jn7.js";import"./Collapse-DOaJRWW2.js";import"./ListItem-CjMmncm8.js";import"./ListContext-TNzuz18n.js";import"./ListItemIcon-CnoaSylj.js";import"./ListItemText-BsX_35MI.js";import"./Tabs-B-G-zakj.js";import"./KeyboardArrowRight-CfRiFTQR.js";import"./FormLabel-5rrfhw_c.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-jsgMoKVQ.js";import"./InputLabel-DQZBFyum.js";import"./Select-Bc5h4omz.js";import"./Popover-DtIB-P_b.js";import"./MenuItem-BDt_rrJV.js";import"./Checkbox-Dj-xYchK.js";import"./SwitchBase-CtZslR8R.js";import"./Chip-CrnKvv-H.js";import"./Link-nS41TX38.js";import"./index-BViUYk_j.js";import"./useObservable-5T-l01DK.js";import"./useIsomorphicLayoutEffect-DBuPTYzI.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-_jiWPxBN.js";import"./useDebounce-SHRO0n08.js";import"./InputAdornment-D22hYUiu.js";import"./TextField-eua7xgOF.js";import"./useElementFilter-CXkzR8M3.js";import"./EmptyState-C3FI9i6y.js";import"./Progress-D5J1WgyC.js";import"./LinearProgress-CkjrRrft.js";import"./ResponseErrorPanel-arbeCczV.js";import"./ErrorPanel-O0u1Wz4N.js";import"./WarningPanel-BwTtnGkf.js";import"./MarkdownContent-xJlcnECw.js";import"./CodeSnippet-8K-OWRcS.js";import"./CopyTextButton-BXdH_Mex.js";import"./useCopyToClipboard-DkMn04rE.js";import"./Tooltip-jADLXplJ.js";import"./Popper-Bzo90_V1.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
