import{j as t,Z as u,N as p,$ as g}from"./iframe-DEPu6gb6.js";import{r as h}from"./plugin-DlaGvYwn.js";import{S as l,u as c,a as x}from"./useSearchModal-IkTVpjdG.js";import{s as S,M}from"./api-B8NpRCgE.js";import{S as C}from"./SearchContext-C_VLWS4z.js";import{B as m}from"./Button-D9xqb4MD.js";import{m as f}from"./makeStyles-DmiRwbC-.js";import{D as j,a as y,b as B}from"./DialogTitle-CuHmZNaf.js";import{B as D}from"./Box-CRmT1Uep.js";import{S as n}from"./Grid-B4jZTMCZ.js";import{S as I}from"./SearchType-CPyzM2cZ.js";import{L as G}from"./List-6W-tA5Er.js";import{H as R}from"./DefaultResultListItem-D79XE049.js";import{w as k}from"./appWrappers-rKWuTpZr.js";import{SearchBar as v}from"./SearchBar-CQWq9Ws3.js";import{S as T}from"./SearchResult-BlDnWvcG.js";import"./preload-helper-PPVm8Dsz.js";import"./index-uxg9XexB.js";import"./Plugin-CFK_elVD.js";import"./componentData-D234a4EC.js";import"./useAnalytics-tiEgn8GG.js";import"./useApp-B3ERp2df.js";import"./useRouteRef-CsJkSokk.js";import"./index-Dne3y8qR.js";import"./ArrowForward-VoJXb-19.js";import"./translation-Dz_SqZI_.js";import"./Page-PH8oT19_.js";import"./useMediaQuery-C3_nB813.js";import"./Divider-Ce0hzK3j.js";import"./ArrowBackIos-D7OgX4Mo.js";import"./ArrowForwardIos-pYPI3939.js";import"./translation-Biwr44ib.js";import"./lodash-BpJ5SQhB.js";import"./useAsync-CXqm1YlW.js";import"./useMountedState-Bp82S8Hy.js";import"./Modal-CgWsFYOX.js";import"./Portal-CQdgPEoH.js";import"./Backdrop-WwjfJ83w.js";import"./styled-C8JkirxD.js";import"./ExpandMore-f018RETT.js";import"./AccordionDetails-nYq3MGOf.js";import"./index-B9sM2jn7.js";import"./Collapse-D43uTXl1.js";import"./ListItem-Bp_YBU-O.js";import"./ListContext-YZAoD3r_.js";import"./ListItemIcon-C1zFb_hB.js";import"./ListItemText-3-mp0clE.js";import"./Tabs-Drj02WKW.js";import"./KeyboardArrowRight-DDkx7YvC.js";import"./FormLabel-D6UJOp3T.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DAUaYgN1.js";import"./InputLabel-IUsVuxd9.js";import"./Select-vBtV_Tvu.js";import"./Popover-JW9C08Jz.js";import"./MenuItem-Cr_5oxMb.js";import"./Checkbox-TUTDokqR.js";import"./SwitchBase-pFpJccyV.js";import"./Chip-BrHrYCVI.js";import"./Link-BdV67OKF.js";import"./index-DYHA3-tG.js";import"./useObservable-BFSVE3K_.js";import"./useIsomorphicLayoutEffect-OCYqdIcN.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-7pQ6Ed1k.js";import"./useDebounce-BEz546lN.js";import"./InputAdornment-Cl2ZX2g5.js";import"./TextField-DFhkXCJJ.js";import"./useElementFilter-CSQMsaZE.js";import"./EmptyState-MvRvuBQk.js";import"./Progress-DvmhsKDu.js";import"./LinearProgress-Bv0y9HPs.js";import"./ResponseErrorPanel-DVTrHvst.js";import"./ErrorPanel-BO35ifSK.js";import"./WarningPanel-DjGA9j0N.js";import"./MarkdownContent-CfLmRDT4.js";import"./CodeSnippet-D5Rf0fbG.js";import"./CopyTextButton-vIn0FPCw.js";import"./useCopyToClipboard-CHGvdCFh.js";import"./Tooltip-Du9bg8BH.js";import"./Popper-V2uzkjHi.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
