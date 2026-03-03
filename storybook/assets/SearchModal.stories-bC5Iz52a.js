import{j as t,W as u,K as p,X as g}from"./iframe-BmigQEv-.js";import{r as h}from"./plugin-B8IsZe9s.js";import{S as l,u as c,a as x}from"./useSearchModal-DXSXa-0l.js";import{s as S,M}from"./api-y-CS0LOC.js";import{S as C}from"./SearchContext-BXNtrlBt.js";import{B as m}from"./Button-lq2xJD9H.js";import{m as f}from"./makeStyles-0-n1Rujo.js";import{D as j,a as y,b as B}from"./DialogTitle-DXe04Ku5.js";import{B as D}from"./Box-YqGKr52F.js";import{S as n}from"./Grid-BZioZTwU.js";import{S as I}from"./SearchType-RMtyxTm4.js";import{L as G}from"./List-DPvCCYNu.js";import{H as R}from"./DefaultResultListItem-BW3bqk--.js";import{w as k}from"./appWrappers-mMtjOYp0.js";import{SearchBar as v}from"./SearchBar-CQzFr7BV.js";import{S as T}from"./SearchResult-Cl7OpF9B.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cntmq1y2.js";import"./Plugin-Dh5mGDR3.js";import"./componentData-DQLrmcS3.js";import"./useAnalytics-Cv3q-2FZ.js";import"./useApp-CTkrqPOE.js";import"./useRouteRef-3r76tHuN.js";import"./index-BfwtKwvN.js";import"./ArrowForward-D560BxTk.js";import"./translation-BIn4Lk-Z.js";import"./Page-CNQjK7NJ.js";import"./useMediaQuery-DXpfqfe1.js";import"./Divider-BJZcR2fB.js";import"./ArrowBackIos-2A_Ms0Un.js";import"./ArrowForwardIos-DB0SD6qP.js";import"./translation-DVFD9jnp.js";import"./lodash-BZheRUGK.js";import"./useAsync-kJRCmhqz.js";import"./useMountedState-DFB9Hb7L.js";import"./Modal-DG7NhvRI.js";import"./Portal-BhbQiPPq.js";import"./Backdrop-7sozrK1x.js";import"./styled-DHllcCHM.js";import"./ExpandMore-Cam5MjCc.js";import"./AccordionDetails-DJp48nbG.js";import"./index-B9sM2jn7.js";import"./Collapse-DCf58tzA.js";import"./ListItem-gIkgFmX0.js";import"./ListContext-DDrpeIYl.js";import"./ListItemIcon-Bpr1NGZM.js";import"./ListItemText-BWJ8GOpK.js";import"./Tabs-Bvv4jdyT.js";import"./KeyboardArrowRight-C3bExXtF.js";import"./FormLabel-DdUqLGGh.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DE4q5ARv.js";import"./InputLabel-DFtm2ncK.js";import"./Select-Ds8DNeOJ.js";import"./Popover-CBw5Z0ap.js";import"./MenuItem-xEHGHDNh.js";import"./Checkbox-B1Hh-7k0.js";import"./SwitchBase-C2LmXags.js";import"./Chip-h1xZTPbC.js";import"./Link-zeLLiKoz.js";import"./index-MgZwvacw.js";import"./useObservable-BQVD3ffY.js";import"./useIsomorphicLayoutEffect-BK5x3ypD.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DuocKKhp.js";import"./useDebounce-Fqcw51g_.js";import"./InputAdornment-bqHK7bE_.js";import"./TextField-Iy4_7lHj.js";import"./useElementFilter-DoIlwM0U.js";import"./EmptyState-DIJy8ckS.js";import"./Progress-BtQbv0tc.js";import"./LinearProgress-D5pwLlmQ.js";import"./ResponseErrorPanel-CrN6M0fP.js";import"./ErrorPanel-D87FdHM-.js";import"./WarningPanel-Cdm1EbTH.js";import"./MarkdownContent-DYnLORy4.js";import"./CodeSnippet-Cogd1Uem.js";import"./CopyTextButton-CLEZMcEc.js";import"./useCopyToClipboard-B4Ur9exv.js";import"./Tooltip-oWfERYB1.js";import"./Popper-B-YRGJsw.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
