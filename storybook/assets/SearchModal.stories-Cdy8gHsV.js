import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-CNJ8DcrC.js";import{r as x}from"./plugin-Dst3d3Mj.js";import{S as l,u as c,a as S}from"./useSearchModal-CMJEyF_m.js";import{s as M,M as C}from"./api-BKCYVh3y.js";import{S as f}from"./SearchContext-C3uN_ZQ6.js";import{B as m}from"./Button-BezvKFLQ.js";import{D as j,a as y,b as B}from"./DialogTitle-BtCIznAI.js";import{B as D}from"./Box-CtI-kND1.js";import{S as n}from"./Grid-DnFVy6t2.js";import{S as I}from"./SearchType-CB8f1MML.js";import{L as G}from"./List-3BFbilF4.js";import{H as R}from"./DefaultResultListItem-CxHpLIoz.js";import{w as k}from"./appWrappers-E57FXAeC.js";import{SearchBar as v}from"./SearchBar-BrVGpHrB.js";import{S as T}from"./SearchResult-BgbrYbSx.js";import"./preload-helper-PPVm8Dsz.js";import"./index-S7vl_NFK.js";import"./Plugin-_567Mtia.js";import"./componentData-D59WTCiB.js";import"./useAnalytics-BIDW8Yu5.js";import"./useApp-ulf7OiyD.js";import"./useRouteRef-DK6B5L3X.js";import"./index-DkthXm2e.js";import"./ArrowForward-Xg3lDUK4.js";import"./translation-Cn-J12sJ.js";import"./Page-CWz75K8d.js";import"./useMediaQuery-BTaPP8B3.js";import"./Divider-BSUI1Y9r.js";import"./ArrowBackIos-8WDC9NwH.js";import"./ArrowForwardIos-4kts45kE.js";import"./translation-D0Kq0cLy.js";import"./lodash-Czox7iJy.js";import"./useAsync-02suuxa3.js";import"./useMountedState-C-7cl-bH.js";import"./Modal-RnbSc_sU.js";import"./Portal-C64Jz60P.js";import"./Backdrop-BXGq-7tC.js";import"./styled-CIO5_I8O.js";import"./ExpandMore-P7Ms8H_E.js";import"./AccordionDetails-DFFwOrZV.js";import"./index-B9sM2jn7.js";import"./Collapse-CrkD-6-R.js";import"./ListItem-31tIz_LL.js";import"./ListContext--5bBRzIF.js";import"./ListItemIcon-CGKCd94c.js";import"./ListItemText-BjTS0dlF.js";import"./Tabs-TEkgiSi2.js";import"./KeyboardArrowRight-BD66cm7V.js";import"./FormLabel-DOy6Mf3H.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Bw430Ems.js";import"./InputLabel-CTy5ghJ5.js";import"./Select-BpqNXXrH.js";import"./Popover-BJ4QSGHZ.js";import"./MenuItem-C30TP0NJ.js";import"./Checkbox-PUWZ8WnA.js";import"./SwitchBase-DGmFt4pR.js";import"./Chip-CqBCwPv_.js";import"./Link-UFLrOQPe.js";import"./useObservable-CaBGgD30.js";import"./useIsomorphicLayoutEffect-EkL8LNZ8.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-Cxo2sCh_.js";import"./useDebounce-D4fHK0dd.js";import"./InputAdornment-D3z0E4jt.js";import"./TextField-Br_7nK5i.js";import"./useElementFilter-CrAqpnws.js";import"./EmptyState-CwPazd28.js";import"./Progress-Dpeh2BaJ.js";import"./LinearProgress-Cq2WdnVV.js";import"./ResponseErrorPanel-B9WK2x1e.js";import"./ErrorPanel-Cfax6ZbZ.js";import"./WarningPanel-CAoaG3c4.js";import"./MarkdownContent-BzDAUZZf.js";import"./CodeSnippet-Cp3x4Ngz.js";import"./CopyTextButton-C1aJOmrW.js";import"./useCopyToClipboard-CMtB8QI9.js";import"./Tooltip-D6Gn2cGq.js";import"./Popper-DrUAX_Wn.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
