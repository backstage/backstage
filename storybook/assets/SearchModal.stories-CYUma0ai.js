import{j as t,W as u,m as p,K as g,X as h}from"./iframe-BJyhMgZx.js";import{r as x}from"./plugin-BcDaS9ca.js";import{S as l,u as c,a as S}from"./useSearchModal-CmEMykzK.js";import{s as M,M as C}from"./api-Cdm69iM_.js";import{S as f}from"./SearchContext-C7gGdmvg.js";import{B as m}from"./Button-DRlQNqFD.js";import{D as j,a as y,b as B}from"./DialogTitle-DXh621uZ.js";import{B as D}from"./Box-DvCgVOwJ.js";import{S as n}from"./Grid-Ce4w6y7_.js";import{S as I}from"./SearchType-C3meS9wk.js";import{L as G}from"./List-BFZ4Qrp4.js";import{H as R}from"./DefaultResultListItem-DZ5WpyVE.js";import{w as k}from"./appWrappers-DIW0xdlj.js";import{SearchBar as v}from"./SearchBar-H24HmxwQ.js";import{S as T}from"./SearchResult-DywdKCOu.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DdQtTxBX.js";import"./Plugin-DKb68enx.js";import"./componentData-qacj-XNq.js";import"./useAnalytics-D5KbbwDD.js";import"./useApp-7IUhkz1i.js";import"./useRouteRef-BR6iF573.js";import"./index-CgpX80zE.js";import"./ArrowForward-Crbw7f1j.js";import"./translation-OUfAJ4m-.js";import"./Page-E7zGOKiR.js";import"./useMediaQuery-8PsIEoQg.js";import"./Divider-CW714Rq9.js";import"./ArrowBackIos-WG2_Q739.js";import"./ArrowForwardIos-CbYSBCRG.js";import"./translation-DakUQ2Gq.js";import"./lodash-Owt1XfFv.js";import"./useAsync-Bw-fkNAq.js";import"./useMountedState-Cu_WIlx5.js";import"./Modal-CpRiOHte.js";import"./Portal-Bs15JVl2.js";import"./Backdrop-BnxEcLRD.js";import"./styled-LNNxiV8P.js";import"./ExpandMore-CZtZ9lCo.js";import"./AccordionDetails-BPpQ2yq1.js";import"./index-B9sM2jn7.js";import"./Collapse-Dk3gxg1y.js";import"./ListItem-C9MlxCoa.js";import"./ListContext-wap519Wf.js";import"./ListItemIcon-CQMXs9iI.js";import"./ListItemText-BGmwo6yn.js";import"./Tabs-oRS404vA.js";import"./KeyboardArrowRight-dg1ZX07j.js";import"./FormLabel-B_ZS34Ie.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Dkq16rYo.js";import"./InputLabel-UOElIK4s.js";import"./Select-C14uzBLV.js";import"./Popover-BMSZCUIK.js";import"./MenuItem-D3sl4950.js";import"./Checkbox-CECHhbtb.js";import"./SwitchBase-BpEsOeP-.js";import"./Chip-CoinGNY9.js";import"./Link-Bj1eQkNP.js";import"./useObservable-D9KjtyYv.js";import"./useIsomorphicLayoutEffect-Bd7MsJ0s.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DsGvQKCM.js";import"./useDebounce-BxkxbYKH.js";import"./InputAdornment-Blox4nKH.js";import"./TextField-SHaQth9T.js";import"./useElementFilter-BOYTuEoC.js";import"./EmptyState-roCY2VcX.js";import"./Progress-j2P1nYbf.js";import"./LinearProgress-Dng6Dsx1.js";import"./ResponseErrorPanel-BhMf7Bij.js";import"./ErrorPanel-m2J_rcv9.js";import"./WarningPanel-DZJY6lkJ.js";import"./MarkdownContent-B5xSYRKQ.js";import"./CodeSnippet-CYEA3v3M.js";import"./CopyTextButton-df7laSYD.js";import"./useCopyToClipboard-B8mFz-kX.js";import"./Tooltip-BYcvPGbC.js";import"./Popper-CFXrn5Hd.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
