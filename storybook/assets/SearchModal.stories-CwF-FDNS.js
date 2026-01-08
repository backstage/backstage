import{j as t,m as u,I as p,b as g,T as h}from"./iframe-CIdfBUNc.js";import{r as x}from"./plugin-DYWiNART.js";import{S as l,u as c,a as S}from"./useSearchModal-BXNVT7mj.js";import{B as m}from"./Button-Ckh3f-JS.js";import{a as M,b as C,c as f}from"./DialogTitle-D9_Z1_7w.js";import{B as j}from"./Box-2FUA-1uv.js";import{S as n}from"./Grid-CNMGd53o.js";import{S as y}from"./SearchType-BlCxKZcc.js";import{L as I}from"./List-CWTfe060.js";import{H as B}from"./DefaultResultListItem-CE4o17rI.js";import{s as D,M as G}from"./api-DPo6etgd.js";import{S as R}from"./SearchContext-Chra9qDZ.js";import{w as T}from"./appWrappers-AgrnuiEj.js";import{SearchBar as k}from"./SearchBar-DD1lrWxW.js";import{a as v}from"./SearchResult-BC9fWI3W.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D6HVU49s.js";import"./Plugin-Cal27Rxh.js";import"./componentData-CJ11DeEU.js";import"./useAnalytics-DK0dZYSI.js";import"./useApp-DNuP2PYf.js";import"./useRouteRef-BtzOE2h6.js";import"./index-6Q4r393t.js";import"./ArrowForward-DWvoUq3l.js";import"./translation-DMMr_67B.js";import"./Page-BUoq3H8w.js";import"./useMediaQuery-DrOJ7HGG.js";import"./Divider-DSMvF0Rh.js";import"./ArrowBackIos-CZWU4zY5.js";import"./ArrowForwardIos-FQg-DG4k.js";import"./translation-DnjA1iFI.js";import"./Modal-BoVNQ_gf.js";import"./Portal-CzMBs-js.js";import"./Backdrop-CX0eMuCq.js";import"./styled-D6NhFGBl.js";import"./ExpandMore-CVq5yZzR.js";import"./useAsync-Cop8mLj-.js";import"./useMountedState-CxwBQu50.js";import"./AccordionDetails-Db8RrwKQ.js";import"./index-B9sM2jn7.js";import"./Collapse-C667vUQ9.js";import"./ListItem-Dfr179My.js";import"./ListContext-BIMkaxMd.js";import"./ListItemIcon-ibuIbQe5.js";import"./ListItemText-CPW3cjiy.js";import"./Tabs-mOrJlJH4.js";import"./KeyboardArrowRight-gCL-vrdp.js";import"./FormLabel-D0_abTgZ.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DK88pbWk.js";import"./InputLabel-BDbJCZI4.js";import"./Select-CQPO1yO8.js";import"./Popover--nM83zpc.js";import"./MenuItem-C8xqJzBa.js";import"./Checkbox-DqQv84BN.js";import"./SwitchBase-By9uE2rk.js";import"./Chip-DlziYXVf.js";import"./Link-BiOJGlt4.js";import"./lodash-Y_-RFQgK.js";import"./useObservable-DS2HW8Ao.js";import"./useIsomorphicLayoutEffect-BNA5FOYt.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BbKxs25O.js";import"./useDebounce-B6kB6atJ.js";import"./InputAdornment-DwarmMsW.js";import"./TextField-D895QToS.js";import"./useElementFilter-DWkD4G57.js";import"./EmptyState-C3O2UO4o.js";import"./Progress-Dn06jhVt.js";import"./LinearProgress-CDSuPOQP.js";import"./ResponseErrorPanel-CUOdDLSC.js";import"./ErrorPanel-BxCVrdam.js";import"./WarningPanel-CssXi-zs.js";import"./MarkdownContent-DeGRTh9e.js";import"./CodeSnippet-yQ1UvqA7.js";import"./CopyTextButton-B2Os4u3r.js";import"./useCopyToClipboard-C5xquscJ.js";import"./Tooltip-CiUyWjSw.js";import"./Popper-zpN6QrBD.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
