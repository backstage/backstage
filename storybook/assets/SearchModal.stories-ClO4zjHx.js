import{j as t,W as d,a3 as u,a2 as h}from"./iframe-Co8mkF6n.js";import{r as g}from"./plugin-CZLJ8Nba.js";import{S as l,u as n,a as x}from"./useSearchModal-BwfUCoi2.js";import{B as c}from"./Button-BfCaCzhB.js";import{D as S,a as f,b as M}from"./DialogTitle-BaEO7IXc.js";import{B as j}from"./Box-DA6OOHjA.js";import{S as r}from"./Grid-Bhd9sgun.js";import{S as C}from"./SearchType-DzOHsPlD.js";import{L as y}from"./List-BISM21Ia.js";import{H as I}from"./DefaultResultListItem-D1Q9wN9B.js";import{w as R}from"./appWrappers-prhJo4fv.js";import{m as B}from"./makeStyles-CFpzSHZa.js";import{s as D,M as k}from"./api-D6OaTB24.js";import{S as v}from"./SearchContext-qryi_SjS.js";import{SearchBar as T}from"./SearchBar-G5rvEGtW.js";import{S as b}from"./SearchResult-D_TIHUKg.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cs9gJRs3.js";import"./Plugin-CxLX3H-O.js";import"./componentData-BY-5yYJX.js";import"./useAnalytics-BZJh0YtL.js";import"./useApp-DuP2kRR6.js";import"./useRouteRef-C3nltafq.js";import"./ArrowForward-CacgvP_Y.js";import"./translation-BD83Kweb.js";import"./Page-IEykcW0S.js";import"./useMediaQuery-C5QdXrDi.js";import"./Divider-Do-RRSQA.js";import"./ArrowBackIos-BPVZhLIX.js";import"./ArrowForwardIos-BZf9afyW.js";import"./translation-iTQmkAeK.js";import"./Modal-dW7pa_0x.js";import"./Portal-Dx4WX7P_.js";import"./Backdrop-DB4Idz-L.js";import"./styled-JXjQDdCt.js";import"./ExpandMore-mAw3t7Lg.js";import"./useAsync-DFeXs0ct.js";import"./useMountedState-CQLsF9D-.js";import"./AccordionDetails-CcuO3Mzb.js";import"./index-B9sM2jn7.js";import"./Collapse-QUv5fteM.js";import"./ListItem-Bi_Q5yAP.js";import"./ListContext-DLNgH7rU.js";import"./ListItemIcon-CQVQ6Gwv.js";import"./ListItemText-BLNlDTGS.js";import"./Tabs-9ZKsk8nR.js";import"./KeyboardArrowRight-C__LxyMv.js";import"./FormLabel-D8j6HNER.js";import"./formControlState-DIiTTU1n.js";import"./InputLabel-DzeJGE2u.js";import"./Select-B6L9CWIE.js";import"./Popover-D2fhxQeu.js";import"./MenuItem-DIXoArHs.js";import"./Checkbox-C33FBc6v.js";import"./SwitchBase-BgqRqFrg.js";import"./Chip-DAz2_Iqd.js";import"./Link-C5p9O8kc.js";import"./index-Cw_DALCy.js";import"./lodash-PVyZah61.js";import"./WebStorage-lrngZZah.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-D9BWtWiy.js";import"./useIsomorphicLayoutEffect-DYeZl9y0.js";import"./BUIProvider-Bea2nV_W.js";import"./openLink-Dd3JFEWo.js";import"./useResolvedHref-BZJOZptD.js";import"./Search-Bwg25r-8.js";import"./useDebounce-BV2FDapi.js";import"./InputAdornment-Oa9ocjhP.js";import"./TextField-BqwHHqBJ.js";import"./useElementFilter-CSwtHlVh.js";import"./EmptyState-BSvE7Ouh.js";import"./Progress-DuPsLRvT.js";import"./LinearProgress-XPs7E_lL.js";import"./ResponseErrorPanel-DnbbcDCf.js";import"./ErrorPanel-DVo3pUGz.js";import"./WarningPanel-aG9DE5Tq.js";import"./MarkdownContent-F_TSR_3r.js";import"./CodeSnippet-DAxN1hXq.js";import"./CopyTextButton-DnLw8rkj.js";import"./useCopyToClipboard-9wtNivfI.js";import"./Tooltip-By13aFvS.js";import"./Popper-DLIxumuv.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
