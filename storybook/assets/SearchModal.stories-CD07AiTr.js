import{j as t,m as u,I as p,b as g,T as h}from"./iframe-CG856I7g.js";import{r as x}from"./plugin-BUxNYUaJ.js";import{S as l,u as c,a as S}from"./useSearchModal-DeWtgBOr.js";import{B as m}from"./Button-os8mT4aD.js";import{a as M,b as C,c as f}from"./DialogTitle-BYAFwPKR.js";import{B as j}from"./Box-DirFOCIJ.js";import{S as n}from"./Grid-CG84KQIV.js";import{S as y}from"./SearchType-CeYGfG0Q.js";import{L as I}from"./List-BTwiC7G-.js";import{H as B}from"./DefaultResultListItem-RYYyn9PW.js";import{s as D,M as G}from"./api-B_0Mfj8s.js";import{S as R}from"./SearchContext-CXmDn0R7.js";import{w as T}from"./appWrappers-DEP7SCZP.js";import{SearchBar as k}from"./SearchBar-B9nq_22l.js";import{a as v}from"./SearchResult-Cbx04KG_.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BbWamktc.js";import"./Plugin-D3BXoFcT.js";import"./componentData-aFf6ewzF.js";import"./useAnalytics-D5P-YjA8.js";import"./useApp-CtCgKAFa.js";import"./useRouteRef-B8PYaAAi.js";import"./index-PWNHdhKk.js";import"./ArrowForward-ClGRA-Ks.js";import"./translation-B1osuIsD.js";import"./Page-p6HQXNXi.js";import"./useMediaQuery-Dm2wfQ4r.js";import"./Divider-gH4LD_Ra.js";import"./ArrowBackIos-QBpELuKD.js";import"./ArrowForwardIos-CxbddfCA.js";import"./translation-CVLhtOF0.js";import"./Modal-odp3IgY3.js";import"./Portal-Bhu3uB1L.js";import"./Backdrop-DWQDC5UU.js";import"./styled-8AOit3ty.js";import"./ExpandMore-DTKTum2k.js";import"./useAsync-CdIFnDD6.js";import"./useMountedState-Bvsb1ptg.js";import"./AccordionDetails-CmfQvp7G.js";import"./index-B9sM2jn7.js";import"./Collapse-vpACe9Y2.js";import"./ListItem-BWUkcOJl.js";import"./ListContext-BzsI-cEV.js";import"./ListItemIcon-DzmrMaMP.js";import"./ListItemText-QtFV-4wl.js";import"./Tabs-CVC-uJPv.js";import"./KeyboardArrowRight-C_56xVhe.js";import"./FormLabel-9uCxckxd.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Ckxa1kyG.js";import"./InputLabel-DA4-TPnU.js";import"./Select-BumcGofS.js";import"./Popover-BVt04z7T.js";import"./MenuItem-DhNEnkRz.js";import"./Checkbox-lU_q1h3j.js";import"./SwitchBase-Dj8cS13X.js";import"./Chip-CvfL0To0.js";import"./Link-Cd9n886D.js";import"./lodash-Czox7iJy.js";import"./useObservable-CZ-R5m23.js";import"./useIsomorphicLayoutEffect-BmiTUf2k.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-S9ejjMwF.js";import"./useDebounce-D2Tc7L1z.js";import"./InputAdornment-Dh2x7GfQ.js";import"./TextField-Bp5eKkbH.js";import"./useElementFilter-BwvRComW.js";import"./EmptyState-kAPpeSTj.js";import"./Progress-DD_RLr2_.js";import"./LinearProgress-GD2gmRBp.js";import"./ResponseErrorPanel-CntGf4F_.js";import"./ErrorPanel-DZ1ApYdQ.js";import"./WarningPanel-CDDj3MLB.js";import"./MarkdownContent-BwSLPwTP.js";import"./CodeSnippet-CUezJ-Mg.js";import"./CopyTextButton-B_1HfWK0.js";import"./useCopyToClipboard-CUxcez1F.js";import"./Tooltip-DTkgI76M.js";import"./Popper-BTDu7j3q.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
