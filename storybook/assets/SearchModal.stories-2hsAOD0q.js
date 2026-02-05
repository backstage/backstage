import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-DVtcQ4_z.js";import{r as x}from"./plugin-DcX1mr0d.js";import{S as l,u as c,a as S}from"./useSearchModal-DvSAJGCI.js";import{s as M,M as C}from"./api-BrBgl4nj.js";import{S as f}from"./SearchContext-Ag9TnxPT.js";import{B as m}from"./Button-B6Zk0t0c.js";import{D as j,a as y,b as B}from"./DialogTitle-DWxUih24.js";import{B as D}from"./Box-D_1MPpAq.js";import{S as n}from"./Grid-CRH4wMFl.js";import{S as I}from"./SearchType-D_zIIhiy.js";import{L as G}from"./List-DxsGYjB2.js";import{H as R}from"./DefaultResultListItem-VPnoxH-3.js";import{w as k}from"./appWrappers-9shJdU2k.js";import{SearchBar as v}from"./SearchBar-CiSiKpBe.js";import{S as T}from"./SearchResult-DzTpyRpf.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CUu5uJIM.js";import"./Plugin-BFejrjRb.js";import"./componentData-DLUR4SEc.js";import"./useAnalytics-BDGM9FZv.js";import"./useApp-hPSWuSwz.js";import"./useRouteRef-CmZgmteL.js";import"./index-nBdCQRka.js";import"./ArrowForward-C8LFtIoy.js";import"./translation-Dz5ZvNXF.js";import"./Page-Cvj4mtCH.js";import"./useMediaQuery-B8Dla2oc.js";import"./Divider-BmAsVb_O.js";import"./ArrowBackIos-WGX9I2Qw.js";import"./ArrowForwardIos-Cj9aXg-f.js";import"./translation-DOCN-FES.js";import"./lodash-Czox7iJy.js";import"./useAsync-0ylosLEO.js";import"./useMountedState-rAyQYyeH.js";import"./Modal-C3aeePrL.js";import"./Portal-kTp41skA.js";import"./Backdrop-BrMkINGu.js";import"./styled-2Y3L2rTs.js";import"./ExpandMore-BZTl6lHp.js";import"./AccordionDetails-20s0m78U.js";import"./index-B9sM2jn7.js";import"./Collapse-BTPpLLfL.js";import"./ListItem-C0fXON46.js";import"./ListContext-Br6vO3Y2.js";import"./ListItemIcon-DnfXii_s.js";import"./ListItemText-CpGTJDVb.js";import"./Tabs-Dcroh4D-.js";import"./KeyboardArrowRight-CZ9mr0rv.js";import"./FormLabel-C80NDHZ4.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-D9PcdMmc.js";import"./InputLabel-CfcbeDCb.js";import"./Select-CGzhdVcr.js";import"./Popover-BXTxo9bK.js";import"./MenuItem-Bc4NWup7.js";import"./Checkbox-C3L6JU6t.js";import"./SwitchBase-DpQyZyZQ.js";import"./Chip-noWWr2Eg.js";import"./Link-t6CnRMqh.js";import"./useObservable-B_06OWLq.js";import"./useIsomorphicLayoutEffect-DivdhHMv.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-D5rdFP9l.js";import"./useDebounce-B7-0h8BB.js";import"./InputAdornment-aWjPbR8S.js";import"./TextField-B1Z1XzXu.js";import"./useElementFilter-BlpSm2cP.js";import"./EmptyState-B9qHU-hz.js";import"./Progress-jzXnpn5H.js";import"./LinearProgress-c8F2DfiF.js";import"./ResponseErrorPanel-CXSjn-d3.js";import"./ErrorPanel-BTyMCoIE.js";import"./WarningPanel-DWnW9ndp.js";import"./MarkdownContent-C-D6oakD.js";import"./CodeSnippet-CJietKeS.js";import"./CopyTextButton-DhwWsCh2.js";import"./useCopyToClipboard-ImQlBzLn.js";import"./Tooltip-dh41oCcd.js";import"./Popper-DhFFD-7P.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
