import{j as t,m as u,I as p,b as g,T as h}from"./iframe-C0ztlCqi.js";import{r as x}from"./plugin-Cbjrlx_7.js";import{S as l,u as c,a as S}from"./useSearchModal-DkNLaOBr.js";import{B as m}from"./Button-CoF0Xodx.js";import{a as M,b as C,c as f}from"./DialogTitle-BqVBbkwh.js";import{B as j}from"./Box-CzQDPnzy.js";import{S as n}from"./Grid-BJIH9AcQ.js";import{S as y}from"./SearchType-BSAJ7yJ7.js";import{L as I}from"./List-dufFXco6.js";import{H as B}from"./DefaultResultListItem-Bfi3Hi_b.js";import{s as D,M as G}from"./api-DOJHDmg8.js";import{S as R}from"./SearchContext-xqdO8Zdw.js";import{w as T}from"./appWrappers-SwbnenOq.js";import{SearchBar as k}from"./SearchBar-DySu-e9W.js";import{a as v}from"./SearchResult-CsJd2DO5.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D52-Mxqs.js";import"./Plugin-C7koouQA.js";import"./componentData-CW45w-aT.js";import"./useAnalytics-BXjJbJ2d.js";import"./useApp-WkaDZJI-.js";import"./useRouteRef-B0OGFprJ.js";import"./index-BSDdaq1o.js";import"./ArrowForward-CZyq4r4K.js";import"./translation-m2tBFyi5.js";import"./Page-KkgaXOKX.js";import"./useMediaQuery-BccW8jYJ.js";import"./Divider-CQWOB-Qy.js";import"./ArrowBackIos-Ck0WuapL.js";import"./ArrowForwardIos-INOuuM08.js";import"./translation-6ziOrsAT.js";import"./Modal-iwdO8Psb.js";import"./Portal-DgY2uLlM.js";import"./Backdrop-B-rl279U.js";import"./styled-CWdZ-Z1U.js";import"./ExpandMore-DjatSCT2.js";import"./useAsync-BkXPEwdl.js";import"./useMountedState-CWuBAMfh.js";import"./AccordionDetails-Qdo8hGCI.js";import"./index-B9sM2jn7.js";import"./Collapse-BOuwDmTN.js";import"./ListItem-BjSKqJNR.js";import"./ListContext-CkQIvbtj.js";import"./ListItemIcon-kLINgbsv.js";import"./ListItemText-C6kGUtI_.js";import"./Tabs-BEdfcgWo.js";import"./KeyboardArrowRight-CzG-dOJx.js";import"./FormLabel-CP1joWhn.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Clp4zAh9.js";import"./InputLabel-DJEDl0v7.js";import"./Select-BKQ8YHYJ.js";import"./Popover-DUDe_MTy.js";import"./MenuItem-BD-9TNO4.js";import"./Checkbox-CPwBO1RF.js";import"./SwitchBase-DXYreGwj.js";import"./Chip-Denbudqc.js";import"./Link-BUMam9f4.js";import"./lodash-DLuUt6m8.js";import"./useObservable-bc9p5D-G.js";import"./useIsomorphicLayoutEffect-HC7ppjUM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BMWICuLH.js";import"./useDebounce-UrAMzlxd.js";import"./InputAdornment-D-FL2737.js";import"./TextField-Bc3CnCZ8.js";import"./useElementFilter-Dk2bLHzw.js";import"./EmptyState-BN9Osui9.js";import"./Progress-Deo3wqXp.js";import"./LinearProgress-2IcTqd_n.js";import"./ResponseErrorPanel-BlZHMxji.js";import"./ErrorPanel-BYV5vIqY.js";import"./WarningPanel-DIeTt0sm.js";import"./MarkdownContent-B6mn0xbm.js";import"./CodeSnippet-B5tPiRbT.js";import"./CopyTextButton-CR_eNMPC.js";import"./useCopyToClipboard-Cj1xpuKu.js";import"./Tooltip-BUzhfLp0.js";import"./Popper-BpDPZdlA.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
