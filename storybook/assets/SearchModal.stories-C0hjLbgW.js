import{j as t,W as u,K as p,X as g}from"./iframe-CMBqt-A6.js";import{r as h}from"./plugin-BEVbSnUt.js";import{S as l,u as c,a as x}from"./useSearchModal-lgiMyItv.js";import{s as S,M}from"./api-Bkf7rg30.js";import{S as C}from"./SearchContext-BgIxHfnh.js";import{B as m}from"./Button-BEhdSkqk.js";import{m as f}from"./makeStyles-OaxjZhE6.js";import{D as j,a as y,b as B}from"./DialogTitle-qcncgd7K.js";import{B as D}from"./Box-iylMMNr_.js";import{S as n}from"./Grid-DdcqWz44.js";import{S as I}from"./SearchType-BNWNR8v2.js";import{L as G}from"./List-B_Ga0lkw.js";import{H as R}from"./DefaultResultListItem-DB4jHDwM.js";import{w as k}from"./appWrappers-DKAv6bjR.js";import{SearchBar as v}from"./SearchBar-DGwtR-Rq.js";import{S as T}from"./SearchResult-ja6ahVje.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DlUB8tfM.js";import"./Plugin-v1Yw0vnv.js";import"./componentData-QXmkmtgk.js";import"./useAnalytics-C5YKKJWk.js";import"./useApp-C6w65p7O.js";import"./useRouteRef-Ba9Xt1-5.js";import"./index-9jpoN6B7.js";import"./ArrowForward-Db4C6Jbd.js";import"./translation-DfFMzO6Z.js";import"./Page-8OptEZu0.js";import"./useMediaQuery-BxggRSoP.js";import"./Divider-CbTnPJqO.js";import"./ArrowBackIos-DErPFIw2.js";import"./ArrowForwardIos-CcAIt-5S.js";import"./translation-CBWpgbBE.js";import"./lodash-CmQdFQ2M.js";import"./useAsync-DRWuITaH.js";import"./useMountedState-BbRSrrDa.js";import"./Modal-BA9N_ZP5.js";import"./Portal-CNrrtJUq.js";import"./Backdrop-BPesXYpY.js";import"./styled-B4IYquMA.js";import"./ExpandMore-B4086Chn.js";import"./AccordionDetails-Kjq35WDg.js";import"./index-B9sM2jn7.js";import"./Collapse-DtqZnYot.js";import"./ListItem-Cz-H-GSR.js";import"./ListContext-CNfMiW9V.js";import"./ListItemIcon-D5r-jF1k.js";import"./ListItemText-BrZaJgkP.js";import"./Tabs-Da4swPpr.js";import"./KeyboardArrowRight-jOY-Q1Ir.js";import"./FormLabel-Db9DyO0H.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C8MTM8Wf.js";import"./InputLabel-CBcI4Q2v.js";import"./Select-DGpp4YIU.js";import"./Popover-DfyanNUg.js";import"./MenuItem-B4uqlF5J.js";import"./Checkbox-4Hn0ANYu.js";import"./SwitchBase-BmPbgwYY.js";import"./Chip-C39h90as.js";import"./Link-ChThVH_b.js";import"./index-B6V69iLc.js";import"./useObservable-CfDW51ud.js";import"./useIsomorphicLayoutEffect-ClY7zHF9.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CiaRby3L.js";import"./useDebounce-DwyR4rgf.js";import"./InputAdornment-BsKQ_HJ1.js";import"./TextField-rJuVlplV.js";import"./useElementFilter-0mttQfmK.js";import"./EmptyState-DOvRyxMX.js";import"./Progress-Bhn9ff8s.js";import"./LinearProgress-BrXwdSXG.js";import"./ResponseErrorPanel-D2OKnIoT.js";import"./ErrorPanel-C5HXJk0K.js";import"./WarningPanel-CEui-57e.js";import"./MarkdownContent-DrWROi1h.js";import"./CodeSnippet-Bh6b92eX.js";import"./CopyTextButton-XVvMse43.js";import"./useCopyToClipboard-DY93RZDc.js";import"./Tooltip-B1ugzKqz.js";import"./Popper-BlEuC4wp.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
