import{j as t,m as u,I as p,b as g,T as h}from"./iframe-C1ohgxPY.js";import{r as x}from"./plugin-B4yYs9OM.js";import{S as l,u as c,a as S}from"./useSearchModal-DZLV5Bsg.js";import{B as m}from"./Button-aR7p6seP.js";import{a as M,b as C,c as f}from"./DialogTitle-DrsqXQow.js";import{B as j}from"./Box-B9XEklXr.js";import{S as n}from"./Grid-ClUEh4fm.js";import{S as y}from"./SearchType-C60JbG7l.js";import{L as I}from"./List-BRbAiMJU.js";import{H as B}from"./DefaultResultListItem-D1Kg-eTd.js";import{s as D,M as G}from"./api-CE51VUC6.js";import{S as R}from"./SearchContext-DOE6GqUZ.js";import{w as T}from"./appWrappers-53W6Z_Fl.js";import{SearchBar as k}from"./SearchBar-CaD3bLjm.js";import{a as v}from"./SearchResult-D5ydnGU-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Y7FEkxuw.js";import"./Plugin-cKXSvaFH.js";import"./componentData-CLq0rdgK.js";import"./useAnalytics-CjWTFi6W.js";import"./useApp-J6Z3sWBa.js";import"./useRouteRef-ayjdeWHT.js";import"./index-pzwzu_48.js";import"./ArrowForward-DrZLn-s7.js";import"./translation-B30UiL6V.js";import"./Page-DP0lLrKb.js";import"./useMediaQuery-D8awJejh.js";import"./Divider-D8U2y_Q5.js";import"./ArrowBackIos-BnfX3m2K.js";import"./ArrowForwardIos-DAg9Iz5y.js";import"./translation-C2L0dxi-.js";import"./Modal-EWqQvSRV.js";import"./Portal-CA7fRi5Y.js";import"./Backdrop-D03isVae.js";import"./styled-DiQntVKI.js";import"./ExpandMore-BahcoyIm.js";import"./useAsync-TxDBlLIm.js";import"./useMountedState-m4mlNTW7.js";import"./AccordionDetails-Ci8EIrXK.js";import"./index-B9sM2jn7.js";import"./Collapse-BVJkjsmV.js";import"./ListItem-Ck2-kEA7.js";import"./ListContext-Ds-TBdUQ.js";import"./ListItemIcon-aCYfAd64.js";import"./ListItemText-Bu4Q5VY7.js";import"./Tabs-Baw-VxcM.js";import"./KeyboardArrowRight-D5H-USV6.js";import"./FormLabel-ggneQAeG.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-B1t4u1fs.js";import"./InputLabel-DMGCvr47.js";import"./Select-BFRMPf_R.js";import"./Popover-dG1DuDKo.js";import"./MenuItem-ZRdlH76G.js";import"./Checkbox-C7mjLyTp.js";import"./SwitchBase-D3YfGPbY.js";import"./Chip-B9lhuMQ2.js";import"./Link-DLDptLAM.js";import"./lodash-Czox7iJy.js";import"./useObservable-CezIJmdx.js";import"./useIsomorphicLayoutEffect-C8m3vn51.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-C40WY1eS.js";import"./useDebounce-DpytPmea.js";import"./InputAdornment-CTXacEDr.js";import"./TextField-qusgp1qc.js";import"./useElementFilter-B8IOm0sy.js";import"./EmptyState-DIsEuUI3.js";import"./Progress-DbBnU1W6.js";import"./LinearProgress-BJyE22FH.js";import"./ResponseErrorPanel-CNlpb1Oh.js";import"./ErrorPanel-Cu206NQf.js";import"./WarningPanel-Cqk4HdYp.js";import"./MarkdownContent-CG5N0PWp.js";import"./CodeSnippet-CdNwSyzj.js";import"./CopyTextButton-Cqy0wuG-.js";import"./useCopyToClipboard-ByZDolH4.js";import"./Tooltip-Dpj1LhZh.js";import"./Popper-BcbGe3J0.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
