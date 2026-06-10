import{bR as t,u as d,l as u,a5 as h}from"./iframe-BvJPDVBV.js";import{r as g}from"./plugin-DMpPfk0r.js";import{S as m,u as n,b as x}from"./useSearchModal-DtmxT2VV.js";import{B as c}from"./Button-7juq2ou4.js";import{c as S,b as f,a as M}from"./DialogTitle-gzSHfIL7.js";import{B as j}from"./Box-CglGxEOc.js";import{S as r}from"./Grid-DM4zpHaB.js";import{S as C}from"./SearchType-Cm1a-k-p.js";import{L as y}from"./List-BnAg8TSB.js";import{H as R}from"./DefaultResultListItem-BieQgBN8.js";import{O as I}from"./appWrappers-B8-CPyCb.js";import{m as B}from"./makeStyles-DyOUY6B2.js";import{s as D,M as b}from"./api-BoWDhJs9.js";import{S as k}from"./SearchContext-CrF6dZ40.js";import{SearchBar as v}from"./SearchBar-Dwps9f7l.js";import{S as T}from"./SearchResult-NJPamYIo.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D4tIWira.js";import"./Plugin-BTJOo81U.js";import"./componentData-D_x_08zV.js";import"./useAnalytics-D2-jQxwo.js";import"./useApp-Db4LI50H.js";import"./useRouteRef-C9sLq3oz.js";import"./ArrowForward-B4spZCXe.js";import"./translation-1nwRLIxO.js";import"./Page-OV7vCD5D.js";import"./useMediaQuery-OHj1UhHg.js";import"./Divider-BbDnV3K6.js";import"./ArrowBackIos-H1fDdPkw.js";import"./ArrowForwardIos--Yx4EGjV.js";import"./translation-CHoAzEne.js";import"./Modal-bN47me76.js";import"./Portal-SYvoszGN.js";import"./Backdrop-DAZd3BKm.js";import"./styled-DeJZjMKc.js";import"./ExpandMore-CpcuGUFx.js";import"./useAsync-CWULC4rA.js";import"./useMountedState-BBUEMOpo.js";import"./AccordionDetails-CqRqXsaw.js";import"./index-B9sM2jn7.js";import"./Collapse-CDxa-s3u.js";import"./ListItem-CDg2S178.js";import"./ListContext-DJFdpsTI.js";import"./ListItemIcon-NUvp-RGz.js";import"./ListItemText-BIQEiE57.js";import"./Tabs-DtVZIqEP.js";import"./KeyboardArrowRight-B76LNvhZ.js";import"./FormLabel-DZzCDIG1.js";import"./formControlState-BkFY2A6j.js";import"./InputLabel-DbA2e3AK.js";import"./Select-DF3EFlnA.js";import"./Popover-2GA4cIX_.js";import"./MenuItem-CfqrmAzf.js";import"./Checkbox-CepDi_jG.js";import"./SwitchBase-D83lN4hj.js";import"./Chip-BeMGEFRG.js";import"./Link-DnetWwwd.js";import"./index-D-x_07yS.js";import"./lodash-B7F9zazX.js";import"./WebStorage-BrbJiD65.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DIWYvfM1.js";import"./useIsomorphicLayoutEffect-DHPtKN1P.js";import"./BUIProvider-C0DBpot8.js";import"./openLink-C9f1t9oF.js";import"./useResolvedHref-BVOpLvQX.js";import"./Search-DmUFG69G.js";import"./useDebounce-CmbLmcEn.js";import"./InputAdornment-BPHOwyZK.js";import"./TextField-DeQoeR3i.js";import"./useElementFilter-Cn93mj8y.js";import"./EmptyState-uUvyY9hI.js";import"./Progress-r_Ge0AFX.js";import"./LinearProgress-DIK0TYEQ.js";import"./ResponseErrorPanel-1Rfrtzho.js";import"./ErrorPanel-CooBuwoO.js";import"./WarningPanel-BiANO9m0.js";import"./MarkdownContent-STzFOCRt.js";import"./CodeSnippet-B3MZVWv-.js";import"./CopyTextButton-PR9fM2ep.js";import"./useCopyToClipboard-CJLQiF8u.js";import"./Tooltip-bJ-Oj7_3.js";import"./Popper-DlDpjqC3.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
