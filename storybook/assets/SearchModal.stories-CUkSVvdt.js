import{bR as t,u as d,l as u,a5 as h}from"./iframe-t54gLFa0.js";import{r as g}from"./plugin-DDDsIgdb.js";import{S as m,u as n,b as x}from"./useSearchModal-B95yzvtE.js";import{B as c}from"./Button-Bw332Eet.js";import{c as S,b as f,a as M}from"./DialogTitle-CP43pVPl.js";import{B as j}from"./Box-CMT-4mK8.js";import{S as r}from"./Grid-BqPQ-ztq.js";import{S as C}from"./SearchType-D7QJAsCP.js";import{L as y}from"./List-QkFCm4Dm.js";import{H as R}from"./DefaultResultListItem-DGzJyoMi.js";import{O as I}from"./appWrappers-KVdv6_SJ.js";import{m as B}from"./makeStyles-DQwCtVrG.js";import{s as D,M as b}from"./api-gQrrg00B.js";import{S as k}from"./SearchContext-BQgh500J.js";import{SearchBar as v}from"./SearchBar-CgXRN3Kw.js";import{S as T}from"./SearchResult-BjaVFzDB.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DXRnY1Te.js";import"./Plugin-DuClqyT-.js";import"./componentData-DbVG9oi0.js";import"./useAnalytics-mvrvRrti.js";import"./useApp-Cd5JmEQB.js";import"./useRouteRef-Dy2yNsSs.js";import"./ArrowForward-Cs6vCUlm.js";import"./translation-B46NZLiL.js";import"./Page-CedjPrWT.js";import"./useMediaQuery-DzImWy2C.js";import"./Divider-BFQ3spsH.js";import"./ArrowBackIos-BKaAB4sn.js";import"./ArrowForwardIos-Dp8MJoBG.js";import"./translation-Cwk1_JGb.js";import"./Modal-CRDG0M6-.js";import"./Portal-Bh1zuHZS.js";import"./Backdrop-J-f9VYh2.js";import"./styled-CbrhIpjk.js";import"./ExpandMore-sn3c1e-H.js";import"./useAsync-pI-uXDbo.js";import"./useMountedState-54CMczLh.js";import"./AccordionDetails-BJ9ncWuA.js";import"./index-B9sM2jn7.js";import"./Collapse-Ch3l8ZAc.js";import"./ListItem-d__Oj8We.js";import"./ListContext-DqTTJq5i.js";import"./ListItemIcon-Bn9SqECf.js";import"./ListItemText-bolOwYFk.js";import"./Tabs-CM6m1ggO.js";import"./KeyboardArrowRight-DPRvoNvB.js";import"./FormLabel-CYHkXHEh.js";import"./formControlState-BQNSn0WM.js";import"./InputLabel-RUnmkCKL.js";import"./Select-DGI4Iqen.js";import"./Popover-DXW8u5CQ.js";import"./MenuItem-CevNkzb8.js";import"./Checkbox-N80kBqy5.js";import"./SwitchBase-CIQCcDnK.js";import"./Chip-zvf6YxRS.js";import"./Link-D4UteyGO.js";import"./index-DX7uUS-A.js";import"./lodash-D9iXkaqZ.js";import"./WebStorage-BgUyJoGs.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Ex2JxqA6.js";import"./useIsomorphicLayoutEffect-LMBwNyjZ.js";import"./BUIProvider-Dtk8jSjz.js";import"./openLink-BrZmZSwy.js";import"./useResolvedHref-CzJrygR1.js";import"./Search-C-HkZ4YC.js";import"./useDebounce-B9Pg9gkh.js";import"./InputAdornment-CKzkvKmW.js";import"./TextField-DBplHQhS.js";import"./useElementFilter-_nN43Zzb.js";import"./EmptyState-Bm5-a9pe.js";import"./Progress-BrU201r2.js";import"./LinearProgress-PIc8TX3S.js";import"./ResponseErrorPanel-CJariC7k.js";import"./ErrorPanel-CIG-uEdq.js";import"./WarningPanel-RwP7igJQ.js";import"./MarkdownContent-CMu20KNq.js";import"./CodeSnippet-BgQ5VAqv.js";import"./CopyTextButton-C3ylSF4d.js";import"./useCopyToClipboard-CHiTKuc0.js";import"./Tooltip-CbljDWBy.js";import"./Popper-C582Ee7M.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
