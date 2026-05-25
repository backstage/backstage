import{j as t,W as d,a3 as u,a2 as h}from"./iframe-C0T-wj8W.js";import{r as g}from"./plugin-D7cp4cOJ.js";import{S as l,u as n,a as x}from"./useSearchModal-Dw-GN3HC.js";import{B as c}from"./Button-mcUBAQqA.js";import{D as S,a as f,b as M}from"./DialogTitle-BbqBgT-4.js";import{B as j}from"./Box-zHlL_yoj.js";import{S as r}from"./Grid-Kd3bNwE8.js";import{S as C}from"./SearchType-YqRU5RSi.js";import{L as y}from"./List-CHzHxHRI.js";import{H as I}from"./DefaultResultListItem-BXvQqpB3.js";import{w as R}from"./appWrappers-CriX5g6D.js";import{m as B}from"./makeStyles-DViRTVia.js";import{s as D,M as k}from"./api-DWyDta_6.js";import{S as v}from"./SearchContext-B-ITRdTG.js";import{SearchBar as T}from"./SearchBar-DAEf2ty-.js";import{S as b}from"./SearchResult-HhU3pbRH.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Csb278mP.js";import"./Plugin-uJj8IM1L.js";import"./componentData-Wenc7sxq.js";import"./useAnalytics-C8hlcdRX.js";import"./useApp-CHDrtVuY.js";import"./useRouteRef-CNNtqCdh.js";import"./ArrowForward-DUtmDIsW.js";import"./translation-DJ1M-I-d.js";import"./Page-BkVovo2a.js";import"./useMediaQuery-CtkHlqjl.js";import"./Divider-DV_cLnB1.js";import"./ArrowBackIos-CQq-AMQY.js";import"./ArrowForwardIos-C56JzC-1.js";import"./translation-WV0MJw8A.js";import"./Modal-u1aPM6tr.js";import"./Portal-ChEPYBl8.js";import"./Backdrop-ahEicb3u.js";import"./styled-DP6UPB8s.js";import"./ExpandMore-COx-v0R9.js";import"./useAsync-PxR9m19r.js";import"./useMountedState-CFrOHiDa.js";import"./AccordionDetails-DEQ_T6Yo.js";import"./index-B9sM2jn7.js";import"./Collapse-Jcz9uW_S.js";import"./ListItem-CnMPBa6o.js";import"./ListContext-C3ivO856.js";import"./ListItemIcon-Kd9X9YMV.js";import"./ListItemText-B20cMJ-q.js";import"./Tabs-B49tu5P7.js";import"./KeyboardArrowRight-DdzN3myO.js";import"./FormLabel-DN3onA73.js";import"./formControlState-CIdYd_6k.js";import"./InputLabel-DqoSrof4.js";import"./Select-DA_1oRmP.js";import"./Popover-CvJzuGky.js";import"./MenuItem-Djzp-hkL.js";import"./Checkbox-BuJglZbE.js";import"./SwitchBase-DEQiIJWS.js";import"./Chip-hQOleSUD.js";import"./Link-Dh9Tk7z5.js";import"./index-DiT9MzNM.js";import"./lodash-ByAGuY73.js";import"./WebStorage-wXFQu-Oc.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CwTrF2-_.js";import"./useIsomorphicLayoutEffect-DUd4iW2_.js";import"./BUIProvider-BysIBW5M.js";import"./openLink-LrDtNDVV.js";import"./useResolvedHref-Dgg1vi6i.js";import"./Search-Cj_ZqAof.js";import"./useDebounce-Beb9Iqng.js";import"./InputAdornment-CbMpCGhp.js";import"./TextField-BRszISwK.js";import"./useElementFilter-CIpwN7k7.js";import"./EmptyState-B6jRhb49.js";import"./Progress-edJIoLv8.js";import"./LinearProgress-DssGitzM.js";import"./ResponseErrorPanel-1JerxqWk.js";import"./ErrorPanel-BMMw8EFa.js";import"./WarningPanel-D9JgV2fG.js";import"./MarkdownContent-CuZ6yXyH.js";import"./CodeSnippet-BuSnneud.js";import"./CopyTextButton-BM9kYZOc.js";import"./useCopyToClipboard-CA2a2PSS.js";import"./Tooltip-Dvdk8_gO.js";import"./Popper-Vn_FLfwt.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
