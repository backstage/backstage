import{j as t,m as d,I as u,b as h,T as g}from"./iframe-C8ExrwzU.js";import{r as x}from"./plugin-Bj8NWHpe.js";import{S as m,u as n,a as S}from"./useSearchModal-spGWaMpU.js";import{B as c}from"./Button-BirFLWZh.js";import{a as f,b as M,c as j}from"./DialogTitle-B89siiWU.js";import{B as C}from"./Box-DKI1NtYF.js";import{S as r}from"./Grid-DspeJWIy.js";import{S as y}from"./SearchType-CAMfiOqU.js";import{L as I}from"./List-D4oyelOm.js";import{H as R}from"./DefaultResultListItem-BbqwYJAd.js";import{s as B,M as D}from"./api-C-n-MJyU.js";import{S as T}from"./SearchContext-jRC61WGz.js";import{w as k}from"./appWrappers-BaMznTf3.js";import{SearchBar as v}from"./SearchBar-DrrYWXtw.js";import{a as b}from"./SearchResult-C73ls7J6.js";import"./preload-helper-D9Z9MdNV.js";import"./index-ldVdSwr-.js";import"./Plugin-B2v-vDzx.js";import"./componentData-Dj-cJqs3.js";import"./useAnalytics-BlYc1avD.js";import"./useApp-C7pfrKGm.js";import"./useRouteRef-C6pJYPst.js";import"./index-BgOC1FTX.js";import"./ArrowForward-Dcuc9hR9.js";import"./translation-KRTFKGVl.js";import"./Page-D4f1JNil.js";import"./useMediaQuery-DRkeK415.js";import"./Divider-4xHmk1Qy.js";import"./ArrowBackIos-DFj3Ia80.js";import"./ArrowForwardIos-D4GNga-r.js";import"./translation-DK8B_q1P.js";import"./Modal-DbOcvVvU.js";import"./Portal-BvPm8y4I.js";import"./Backdrop-86Drsiia.js";import"./styled-BZchgpfg.js";import"./ExpandMore-CE-AlmPZ.js";import"./useAsync-DwtigoPq.js";import"./useMountedState-UCRwgIDM.js";import"./AccordionDetails-CKE4MG-J.js";import"./index-DnL3XN75.js";import"./Collapse-DuUvJIAd.js";import"./ListItem-DGmfxxZu.js";import"./ListContext-D23aAr-N.js";import"./ListItemIcon-DOJ7JJRo.js";import"./ListItemText-CIKs-KSS.js";import"./Tabs-D42QgN4p.js";import"./KeyboardArrowRight-m85pOw5j.js";import"./FormLabel-BydTPjTE.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DDK_wWJv.js";import"./InputLabel-BIW6m-K0.js";import"./Select-BB1iku1A.js";import"./Popover-CXulOKja.js";import"./MenuItem-VkQJwqij.js";import"./Checkbox-CIaSHDW8.js";import"./SwitchBase-DU4fmETg.js";import"./Chip-DQhoywrC.js";import"./Link-D0uGQ-EQ.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-D53Q4Zoo.js";import"./useIsomorphicLayoutEffect-CxciEqLm.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-CRrCK_B3.js";import"./useDebounce-CobDe-Qo.js";import"./InputAdornment-BNBViktk.js";import"./TextField-Dl2S-w0i.js";import"./useElementFilter-CmH0_Gul.js";import"./EmptyState-h5VZAxpB.js";import"./Progress-DsNmWByX.js";import"./LinearProgress-rc3oEMhp.js";import"./ResponseErrorPanel-Cb0wwecN.js";import"./ErrorPanel-CDFCJhtV.js";import"./WarningPanel-CfgTJdNP.js";import"./MarkdownContent-CQVlpVaR.js";import"./CodeSnippet-BRYqmlwq.js";import"./CopyTextButton-CfcOHHdO.js";import"./useCopyToClipboard-CrQaQuzV.js";import"./Tooltip-rFR9MD6z.js";import"./Popper-BQ20DEXn.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
