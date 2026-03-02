import{j as t,W as u,K as p,X as g}from"./iframe-ONoB0Qo9.js";import{r as h}from"./plugin-sY7Lxg6C.js";import{S as l,u as c,a as x}from"./useSearchModal-D6gXtyN2.js";import{s as S,M}from"./api-C4l3NUen.js";import{S as C}from"./SearchContext-CR3I0-uI.js";import{B as m}from"./Button-BmqRVCQk.js";import{m as f}from"./makeStyles-dBjLM41z.js";import{D as j,a as y,b as B}from"./DialogTitle-CJtmirAm.js";import{B as D}from"./Box-CTTPvdx5.js";import{S as n}from"./Grid-Bsj_4SyV.js";import{S as I}from"./SearchType-Cj4tAQcm.js";import{L as G}from"./List-BrOrhSy2.js";import{H as R}from"./DefaultResultListItem-DWD0yJJm.js";import{w as k}from"./appWrappers-DtFB9wFA.js";import{SearchBar as v}from"./SearchBar-BIwiphER.js";import{S as T}from"./SearchResult-MVbyyvNO.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BaGvGwHN.js";import"./Plugin-CO-ZgTyg.js";import"./componentData-B5_0x5Xz.js";import"./useAnalytics-Dfpcn-Os.js";import"./useApp-Bpmtfts2.js";import"./useRouteRef-B2gW1OoW.js";import"./index-D2HI0Bg7.js";import"./ArrowForward-xUOZBCnm.js";import"./translation-BhuvNSom.js";import"./Page-DP2Z5WDv.js";import"./useMediaQuery-YLZmlUPy.js";import"./Divider-BK-egiUk.js";import"./ArrowBackIos-J66p6E4w.js";import"./ArrowForwardIos-ICBFVMXe.js";import"./translation-CdEyx7dS.js";import"./lodash-BHbbKwIp.js";import"./useAsync-Bxn3NH_j.js";import"./useMountedState-BkZqADEE.js";import"./Modal-DIHdFi4H.js";import"./Portal-B76g_OhK.js";import"./Backdrop-Cvtkce-E.js";import"./styled-CsufaxdX.js";import"./ExpandMore-CnBP7Bmd.js";import"./AccordionDetails-CWB1Mr1o.js";import"./index-B9sM2jn7.js";import"./Collapse-MLoitTWU.js";import"./ListItem-WR66Sxo3.js";import"./ListContext-DWK5PcRa.js";import"./ListItemIcon-kUsYvSDX.js";import"./ListItemText-DV1nrzVN.js";import"./Tabs-CkB_LI0-.js";import"./KeyboardArrowRight-B_ukzZ0r.js";import"./FormLabel-PnIKs-UG.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CcFIJveN.js";import"./InputLabel-CpGLk1P6.js";import"./Select-CvrGAMpQ.js";import"./Popover-BHOdxM3Q.js";import"./MenuItem-fiag3aAA.js";import"./Checkbox-CoySGgu2.js";import"./SwitchBase-SoVrSNH3.js";import"./Chip-I7eDLS9d.js";import"./Link-DOQzRVnU.js";import"./index-CJMbbZwi.js";import"./useObservable-BM0-m4YT.js";import"./useIsomorphicLayoutEffect-CLcJoxBM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CjuTdGtU.js";import"./useDebounce-3sWWTQ-t.js";import"./InputAdornment-Dip6gS-i.js";import"./TextField-puXQDIDz.js";import"./useElementFilter-CGGIYM_d.js";import"./EmptyState-BTv_SSIx.js";import"./Progress-Dsaa0Ef-.js";import"./LinearProgress-DS5jJDiv.js";import"./ResponseErrorPanel-D1qyg2Ow.js";import"./ErrorPanel-C8drJdDT.js";import"./WarningPanel-CDPPhuIe.js";import"./MarkdownContent-BPPu5ch5.js";import"./CodeSnippet-CmhUFGv_.js";import"./CopyTextButton-I7wVIits.js";import"./useCopyToClipboard-DhVkbUZU.js";import"./Tooltip-C7OHiPo1.js";import"./Popper-BX5EB3tO.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
