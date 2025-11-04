import{j as t,m as d,I as u,b as h,T as g}from"./iframe-BFEEYdl1.js";import{r as x}from"./plugin-COvH9GCz.js";import{S as m,u as n,a as S}from"./useSearchModal-DxYexkkr.js";import{B as c}from"./Button-Ci5q7ey2.js";import{a as f,b as M,c as j}from"./DialogTitle-C53FTZ8W.js";import{B as C}from"./Box-CcBhJ2N1.js";import{S as r}from"./Grid-_pxMEZfk.js";import{S as y}from"./SearchType-BQe9CElU.js";import{L as I}from"./List-Cp6nHQli.js";import{H as R}from"./DefaultResultListItem-Dg3Nz2L0.js";import{s as B,M as D}from"./api-DIzRtX_C.js";import{S as T}from"./SearchContext-DfMXAnHC.js";import{w as k}from"./appWrappers-Drr8kDaZ.js";import{SearchBar as v}from"./SearchBar-CTxUOaZg.js";import{a as b}from"./SearchResult-cao8Hj4s.js";import"./preload-helper-D9Z9MdNV.js";import"./index-DwWrsyLS.js";import"./Plugin-EFweYiy3.js";import"./componentData-fXGhNbVj.js";import"./useAnalytics-RL6zQB6E.js";import"./useApp-BQvOBI0y.js";import"./useRouteRef-Djz7qv6Y.js";import"./index-DFzOTOJF.js";import"./ArrowForward-CQW_bFSW.js";import"./translation-D49TaJz4.js";import"./Page-M-DceSpF.js";import"./useMediaQuery-BXDzmvky.js";import"./Divider-CYSzQ_1E.js";import"./ArrowBackIos-ChO6xTKH.js";import"./ArrowForwardIos-1FluDdAl.js";import"./translation-XW611SR5.js";import"./Modal-DNwlsaiG.js";import"./Portal-CS1cCsNf.js";import"./Backdrop-Cc0uQTMy.js";import"./styled-CQi9RfH7.js";import"./ExpandMore-Ctn3qfGH.js";import"./useAsync-CK6ps4Gs.js";import"./useMountedState-SzYJvnyY.js";import"./AccordionDetails-BWiYd2nY.js";import"./index-DnL3XN75.js";import"./Collapse-DQjjdB13.js";import"./ListItem-CoJRgtBh.js";import"./ListContext-aQ8EEV7a.js";import"./ListItemIcon-U0WBQXQ5.js";import"./ListItemText-B34yPKAV.js";import"./Tabs-DUepFwiD.js";import"./KeyboardArrowRight-BXXOvwRg.js";import"./FormLabel-Bhr5Y1VW.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-D7buIhaH.js";import"./InputLabel-Dw7t2-kZ.js";import"./Select-Djy5U4Y0.js";import"./Popover-D3pRgrSn.js";import"./MenuItem-C_MJVaC1.js";import"./Checkbox-C3PFc-vX.js";import"./SwitchBase-5_vTvZ2x.js";import"./Chip-Bkg_M_0R.js";import"./Link-BzkurKFl.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-Dslwl8zx.js";import"./useIsomorphicLayoutEffect-C3Jz8w3d.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-Dk5OJ5Kw.js";import"./useDebounce-BZNAwqTU.js";import"./InputAdornment-BfW1fKmb.js";import"./TextField-BAyv-RD7.js";import"./useElementFilter-DqBkgqgf.js";import"./EmptyState-KAE0n6P0.js";import"./Progress-Ca5iKXSZ.js";import"./LinearProgress-BCucwmQ2.js";import"./ResponseErrorPanel-Dkj679OV.js";import"./ErrorPanel-ByBjA_Oh.js";import"./WarningPanel-Ca_owezB.js";import"./MarkdownContent-BVMx6-i7.js";import"./CodeSnippet-DKeVSYKZ.js";import"./CopyTextButton-CPUbqQk2.js";import"./useCopyToClipboard-CNm0_dns.js";import"./Tooltip-C4KvLgJb.js";import"./Popper-CQXdAewh.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{i as CustomModal,s as Default,lo as __namedExportsOrder,ao as default};
