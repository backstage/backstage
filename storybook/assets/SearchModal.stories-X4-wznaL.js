import{bR as t,u as d,l as u,a5 as h}from"./iframe-A5q7KvPV.js";import{r as g}from"./plugin-D2MaFFBH.js";import{S as m,u as n,b as x}from"./useSearchModal-DgVKkggp.js";import{B as c}from"./Button-C6s0yYXo.js";import{c as S,b as f,a as M}from"./DialogTitle-Dw7EXRkE.js";import{B as j}from"./Box-Do1kLFaD.js";import{S as r}from"./Grid-B2YGGSgc.js";import{S as C}from"./SearchType-DQQbwN3c.js";import{L as y}from"./List-BHb0DGH0.js";import{H as R}from"./DefaultResultListItem-CI-5FSPD.js";import{O as I}from"./appWrappers-BjWfYF9M.js";import{m as B}from"./makeStyles-BSDvNkE_.js";import{s as D,M as b}from"./api-DY5NJNHK.js";import{S as k}from"./SearchContext-BGFENsFy.js";import{SearchBar as v}from"./SearchBar-ByrlXWgB.js";import{S as T}from"./SearchResult-CKuNu2H_.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CK16TDpQ.js";import"./Plugin-DAJ_YWFd.js";import"./componentData-DiVyrxHk.js";import"./useAnalytics-Ds2gUWuY.js";import"./useApp-Rwr12CC0.js";import"./useRouteRef-Veftxdeu.js";import"./ArrowForward-DqYLsbrK.js";import"./translation-Da90xQy8.js";import"./Page-JrUQwGra.js";import"./useMediaQuery-Cc_uExhe.js";import"./Divider-yQcNjI7O.js";import"./ArrowBackIos-CsYR6775.js";import"./ArrowForwardIos-BCXjTW1F.js";import"./translation-CAGjbybP.js";import"./Modal-NqX8GTQ0.js";import"./Portal-CYnqZvqi.js";import"./Backdrop-_KLq1Fc1.js";import"./styled-CaiGGCTB.js";import"./ExpandMore-DZiXAgMM.js";import"./useAsync-D9Dadyr-.js";import"./useMountedState-D9Kraart.js";import"./AccordionDetails-CJeHfiZr.js";import"./index-B9sM2jn7.js";import"./Collapse-DNyQVL9b.js";import"./ListItem-CLjawmK4.js";import"./ListContext-BrmWluE9.js";import"./ListItemIcon-CrnEtBQ7.js";import"./ListItemText-BWLQ0n6h.js";import"./Tabs-BRRPEtCG.js";import"./KeyboardArrowRight-CjF1Birc.js";import"./FormLabel-D3cTAXYQ.js";import"./formControlState-BpLmWJLS.js";import"./InputLabel-D4puVLld.js";import"./Select-QB9tCMwo.js";import"./Popover-X-ryUqSd.js";import"./MenuItem-b-m50k9y.js";import"./Checkbox-C6P_SRzV.js";import"./SwitchBase-Bp8yDqBu.js";import"./Chip-BB37PRoF.js";import"./Link-BMgV47st.js";import"./index-CPIaraR9.js";import"./lodash-9IYu6p8I.js";import"./WebStorage-BCRoi_Wl.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-C3BGiy9r.js";import"./useIsomorphicLayoutEffect-mmhg8n2s.js";import"./BUIProvider-Dj-0esdq.js";import"./openLink-Cwj0uu6r.js";import"./useResolvedHref-mXGtO_J8.js";import"./Search-bKHJVDHN.js";import"./useDebounce-C2O4enLg.js";import"./InputAdornment-DfkYR228.js";import"./TextField-BkVdM4Wg.js";import"./useElementFilter-Bic431WH.js";import"./EmptyState-G6LAt4qO.js";import"./Progress-Dm888nDn.js";import"./LinearProgress-DE4YfTgd.js";import"./ResponseErrorPanel-C-j0SRAP.js";import"./ErrorPanel-BFFMrVVW.js";import"./WarningPanel-aF7tzwTa.js";import"./MarkdownContent-97mqW_uF.js";import"./CodeSnippet-DoTexFgi.js";import"./CopyTextButton-DvCyKSRO.js";import"./useCopyToClipboard-BHlmIXZx.js";import"./Tooltip-DV_BwGfD.js";import"./Popper-FC50uWcj.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
