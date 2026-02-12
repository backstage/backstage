import{j as t,W as u,K as p,X as g}from"./iframe-B4O_Vvag.js";import{r as h}from"./plugin-yOcaCtyl.js";import{S as l,u as c,a as x}from"./useSearchModal-DrlJfjqT.js";import{s as S,M}from"./api-39IC06m9.js";import{S as C}from"./SearchContext-BZ3QNB0W.js";import{B as m}from"./Button-D99UU6hr.js";import{m as f}from"./makeStyles-cJwDV4Qm.js";import{D as j,a as y,b as B}from"./DialogTitle-XtcUGhv-.js";import{B as D}from"./Box-C04O_gsk.js";import{S as n}from"./Grid-_k0ZCqMG.js";import{S as I}from"./SearchType-vGWJm8qa.js";import{L as G}from"./List-DFytLOeW.js";import{H as R}from"./DefaultResultListItem-BjFgHIg9.js";import{w as k}from"./appWrappers-hsxwoQMk.js";import{SearchBar as v}from"./SearchBar-Bg1_33Bl.js";import{S as T}from"./SearchResult-JttrJBKN.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CgYQqgHT.js";import"./Plugin-D-I4Xvy6.js";import"./componentData-D04eIWUu.js";import"./useAnalytics-Bg8WP0fn.js";import"./useApp-5p1flZ5M.js";import"./useRouteRef-DMc3p7_R.js";import"./index-Cy_WZBfJ.js";import"./ArrowForward-yYh1d9MB.js";import"./translation-wcgtGuaX.js";import"./Page-DxJMHP-u.js";import"./useMediaQuery-DQEcvruJ.js";import"./Divider-DqNecIse.js";import"./ArrowBackIos-KSGJspwR.js";import"./ArrowForwardIos-BGSC8SFJ.js";import"./translation-FAiAKNlb.js";import"./lodash-Dnd4eAD2.js";import"./useAsync-FBcmdOwE.js";import"./useMountedState-DZGFeKc4.js";import"./Modal-Dd9cCrfG.js";import"./Portal-xwYCxZwo.js";import"./Backdrop-DZWxVAOM.js";import"./styled-PYdNBIQ3.js";import"./ExpandMore-DONQ1lY5.js";import"./AccordionDetails-DQBgwQHT.js";import"./index-B9sM2jn7.js";import"./Collapse-Uq2x7IVK.js";import"./ListItem-5COuZZ3k.js";import"./ListContext-sIVQTiWf.js";import"./ListItemIcon-SjPIWyeP.js";import"./ListItemText-Vzx2Fo7K.js";import"./Tabs-CqsHt6IJ.js";import"./KeyboardArrowRight-De_w9KNs.js";import"./FormLabel-BdAGCpWD.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DumXPNet.js";import"./InputLabel-BRN3NihA.js";import"./Select-B7TJh83a.js";import"./Popover-DYirk5y4.js";import"./MenuItem-BeRl3Tp-.js";import"./Checkbox-B9939oIo.js";import"./SwitchBase-CvRyzDF7.js";import"./Chip-F96H2XY-.js";import"./Link-BOAEMJKF.js";import"./index-BAgXqP9X.js";import"./useObservable-B6bbceA7.js";import"./useIsomorphicLayoutEffect-DhfDWy2h.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CZ0HALoI.js";import"./useDebounce-GiTPq1aI.js";import"./InputAdornment-DZfD2lCC.js";import"./TextField-Iaa0mjB7.js";import"./useElementFilter-eQ_Zn3PZ.js";import"./EmptyState-ESBzggHx.js";import"./Progress-B4Cxhdbv.js";import"./LinearProgress-D1Ip6axn.js";import"./ResponseErrorPanel-BEtieaAP.js";import"./ErrorPanel-BPDybmbI.js";import"./WarningPanel-Dbz6BQRg.js";import"./MarkdownContent-D60dqvO7.js";import"./CodeSnippet-0JgoJIED.js";import"./CopyTextButton-Cy5Qxtwa.js";import"./useCopyToClipboard-CAw7bZaa.js";import"./Tooltip-DIKSL5Jf.js";import"./Popper-BBytZYgc.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
