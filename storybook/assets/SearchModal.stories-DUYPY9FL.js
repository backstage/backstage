import{bR as t,u as d,l as u,a5 as h}from"./iframe-DHsLdmE0.js";import{r as g}from"./plugin-62OrK9P8.js";import{S as m,u as n,b as x}from"./useSearchModal-CKqAGXig.js";import{B as c}from"./Button-7Jcw9qqA.js";import{c as S,b as f,a as M}from"./DialogTitle-D9l9qFJH.js";import{B as j}from"./Box-ynx69IFE.js";import{S as r}from"./Grid-DxJtb9e-.js";import{S as C}from"./SearchType-B-isUFj-.js";import{L as y}from"./List-DBJidFSb.js";import{H as R}from"./DefaultResultListItem-Dvj3JsGD.js";import{O as I}from"./appWrappers-BjobzVug.js";import{m as B}from"./makeStyles-Dzpfwqkv.js";import{s as D,M as b}from"./api-S0cSGl13.js";import{S as k}from"./SearchContext-CgKUH7xu.js";import{SearchBar as v}from"./SearchBar-C_RT17cA.js";import{S as T}from"./SearchResult-BZxdLlIi.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D3QsQnYV.js";import"./Plugin-BQsIiDPB.js";import"./componentData-0DtFj0hC.js";import"./useAnalytics-D5-Jfhzg.js";import"./useApp-CQ9I6Gkh.js";import"./useRouteRef-CwZqFaNd.js";import"./ArrowForward-DNCAhdwE.js";import"./translation-BITNy0fc.js";import"./Page-C_P_C4nB.js";import"./useMediaQuery-CI5gl9tu.js";import"./Divider-DR7epxNF.js";import"./ArrowBackIos-Cbgp0Zfd.js";import"./ArrowForwardIos-FQI6_GsQ.js";import"./translation-BofWFma9.js";import"./Modal-D__7YiCg.js";import"./Portal-DByf1mCb.js";import"./Backdrop-92vbAPpQ.js";import"./styled-CT8k9EBB.js";import"./ExpandMore-sKTXOyK1.js";import"./useAsync-wa-oGkOO.js";import"./useMountedState-BgzSvwJR.js";import"./AccordionDetails-TXK-pMhz.js";import"./index-B9sM2jn7.js";import"./Collapse-PCg3OWJV.js";import"./ListItem-DFCYyHsM.js";import"./ListContext-Hnsssjg3.js";import"./ListItemIcon-BG8aESDk.js";import"./ListItemText-gNBvMhel.js";import"./Tabs-M4XLMf-O.js";import"./KeyboardArrowRight-BBZo_QrC.js";import"./FormLabel-DJ8iSHkL.js";import"./formControlState-BMacTdNd.js";import"./InputLabel-DThj4VK7.js";import"./Select-BYsJ2L9R.js";import"./Popover-PivTigYr.js";import"./MenuItem-Bom17mD3.js";import"./Checkbox-jd8X83WS.js";import"./SwitchBase-BNB_r2BZ.js";import"./Chip-DdQBIJz_.js";import"./Link-KwMtLRIs.js";import"./index-BNHqqOoN.js";import"./lodash-C10OX6Vn.js";import"./WebStorage-CGCoVqcI.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DyjEGODe.js";import"./useIsomorphicLayoutEffect-CbODmN5F.js";import"./BUIProvider-DQtzj_JL.js";import"./openLink--DhT0IgB.js";import"./useResolvedHref-C7FALh6K.js";import"./Search-B6c6ES-8.js";import"./useDebounce-Bc2bVVRU.js";import"./InputAdornment-DJeEI4wy.js";import"./TextField-DHqje9HC.js";import"./useElementFilter-Cu-F3sw3.js";import"./EmptyState-BK1mT-dX.js";import"./Progress-BBfRrLwr.js";import"./LinearProgress-CUvUY60N.js";import"./ResponseErrorPanel-BhCoUrsz.js";import"./ErrorPanel-C2_EagHd.js";import"./WarningPanel-BBn2Uzyn.js";import"./MarkdownContent-6SmyqThE.js";import"./CodeSnippet-ePBAhbqp.js";import"./CopyTextButton-yQ2bxetq.js";import"./useCopyToClipboard-CfXsIPBL.js";import"./Tooltip-enjgkI7H.js";import"./Popper-C2XBrDYl.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const po=["Default","CustomModal"];export{s as CustomModal,i as Default,po as __namedExportsOrder,co as default};
