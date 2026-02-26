import{j as t,Z as u,N as p,$ as g}from"./iframe-r9k78NKI.js";import{r as h}from"./plugin-C0V7Jhb9.js";import{S as l,u as c,a as x}from"./useSearchModal-C9zQne1R.js";import{s as S,M}from"./api-BMm8aMaZ.js";import{S as C}from"./SearchContext-DQabDLMt.js";import{B as m}from"./Button-CciA6M2u.js";import{m as f}from"./makeStyles-CipF_TRV.js";import{D as j,a as y,b as B}from"./DialogTitle-DQL7pHPj.js";import{B as D}from"./Box-CPjilEka.js";import{S as n}from"./Grid-Bz9nGms7.js";import{S as I}from"./SearchType-BaHSz6PQ.js";import{L as G}from"./List-BDEgjW0i.js";import{H as R}from"./DefaultResultListItem-C-RML6yX.js";import{w as k}from"./appWrappers-ChsNZaIk.js";import{SearchBar as v}from"./SearchBar-CDftmO4h.js";import{S as T}from"./SearchResult-CdG2F2Y8.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BkH7_1of.js";import"./Plugin-BSOW8--5.js";import"./componentData-Cyx6du4q.js";import"./useAnalytics-wKKBdz0U.js";import"./useApp-Nm0FtJwT.js";import"./useRouteRef-qTApFP-W.js";import"./index-C1fYClSH.js";import"./ArrowForward-gQYaq-fA.js";import"./translation-Dgbth_yR.js";import"./Page-DM1NGGBl.js";import"./useMediaQuery-DYnfh06o.js";import"./Divider-IUkKH4dH.js";import"./ArrowBackIos-OMZ9Zu2Q.js";import"./ArrowForwardIos-Cu-Ecz4f.js";import"./translation-DHi4nQAo.js";import"./lodash-B26Sq6Yw.js";import"./useAsync-2R6wGkWw.js";import"./useMountedState-CrP_-pBR.js";import"./Modal-UJSdMD3k.js";import"./Portal-CW8an0o0.js";import"./Backdrop-K6FmHCt0.js";import"./styled-Cg4IVtII.js";import"./ExpandMore-B3MsvMOX.js";import"./AccordionDetails-Dq0J3I9r.js";import"./index-B9sM2jn7.js";import"./Collapse-EhUXEIAK.js";import"./ListItem-DD0_kxo4.js";import"./ListContext-BzmVZQwf.js";import"./ListItemIcon-BvYCR13w.js";import"./ListItemText-B4TkGekz.js";import"./Tabs-BcKjtUAV.js";import"./KeyboardArrowRight-C-VtPeFx.js";import"./FormLabel-h4jv2e1h.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Bog8vARk.js";import"./InputLabel-D8bN8Wve.js";import"./Select-NqQrwrps.js";import"./Popover-CvDqd1rk.js";import"./MenuItem-CXsfxYSH.js";import"./Checkbox-BWAz9IRG.js";import"./SwitchBase-BUTrD8Kc.js";import"./Chip-BjbimY6y.js";import"./Link-zcGWAEux.js";import"./index-s9MTga9j.js";import"./useObservable-yHFnGuS0.js";import"./useIsomorphicLayoutEffect-yB6xoTQw.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CXT53W12.js";import"./useDebounce-9VH1U3TO.js";import"./InputAdornment-Dh51apjw.js";import"./TextField-_Zq2sVTj.js";import"./useElementFilter-B_M5QYdN.js";import"./EmptyState-D73MShUT.js";import"./Progress-DJpM2CS3.js";import"./LinearProgress-CFy6Kkvo.js";import"./ResponseErrorPanel-DojgKDWp.js";import"./ErrorPanel-BoltPlz9.js";import"./WarningPanel-CP3Uvm3P.js";import"./MarkdownContent-BdHL4Rvi.js";import"./CodeSnippet-BnayZY1N.js";import"./CopyTextButton-0h5jNQNi.js";import"./useCopyToClipboard-DfNipbZK.js";import"./Tooltip-B1Vym-uO.js";import"./Popper-oo_sRFxI.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
