import{j as t,W as d,a3 as u,a2 as h}from"./iframe-BCuiGO18.js";import{r as g}from"./plugin-DuqgMWaY.js";import{S as l,u as n,a as x}from"./useSearchModal-D8pXccS0.js";import{B as c}from"./Button-BPWtWLHv.js";import{D as S,a as f,b as M}from"./DialogTitle-B7_wTL-G.js";import{B as j}from"./Box-DF0subjV.js";import{S as r}from"./Grid-ks1F9Ab_.js";import{S as C}from"./SearchType-reynHjBa.js";import{L as y}from"./List-DYKyo639.js";import{H as I}from"./DefaultResultListItem-BpTzskn0.js";import{w as R}from"./appWrappers-FXjjnWoR.js";import{m as B}from"./makeStyles-BiC0-IRq.js";import{s as D,M as k}from"./api-0IOqnvCu.js";import{S as v}from"./SearchContext-Bi8yukTC.js";import{SearchBar as T}from"./SearchBar-0G2RxL8y.js";import{S as b}from"./SearchResult-DXNpMlgI.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B-Lu9oRi.js";import"./Plugin-tVce2jSJ.js";import"./componentData-BAI3xY0R.js";import"./useAnalytics-CLav7vMM.js";import"./useApp-57KoDWVG.js";import"./useRouteRef-BQyVyRKp.js";import"./ArrowForward-Tftkqjq7.js";import"./translation-B99ZNoCi.js";import"./Page-C6PLD35H.js";import"./useMediaQuery-Bm42w48N.js";import"./Divider-DQRcUmcz.js";import"./ArrowBackIos-B7OeA1zt.js";import"./ArrowForwardIos-apjp8Cvb.js";import"./translation-BmZcizJl.js";import"./Modal-BjSLJdmT.js";import"./Portal-Bdh2rISL.js";import"./Backdrop-xsVjhhYH.js";import"./styled-n3Xk8m2M.js";import"./ExpandMore-Yv_q-kXu.js";import"./useAsync-Cj0IJRXY.js";import"./useMountedState-HGb4mU5a.js";import"./AccordionDetails-kOY2jM_p.js";import"./index-B9sM2jn7.js";import"./Collapse-rzCTC0c6.js";import"./ListItem-D5tv8MX2.js";import"./ListContext-DefbUR_f.js";import"./ListItemIcon-DULFlkD5.js";import"./ListItemText-BF4AZnbO.js";import"./Tabs-sDawgit4.js";import"./KeyboardArrowRight-DtLulVwL.js";import"./FormLabel-C414RHUJ.js";import"./formControlState-D7uetKle.js";import"./InputLabel-CJxicx2h.js";import"./Select-CMVAeCz_.js";import"./Popover-CyM8W8X-.js";import"./MenuItem-D6_iPtny.js";import"./Checkbox-DG6zO0vu.js";import"./SwitchBase-mp3WW75C.js";import"./Chip-weePpAxC.js";import"./Link-D8nUG02y.js";import"./index-BOxQOO6X.js";import"./lodash-LxfdXjj1.js";import"./WebStorage-iwA75k21.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Blt0GDYI.js";import"./useIsomorphicLayoutEffect-DP-1EADe.js";import"./BUIProvider-DVdVOrKl.js";import"./openLink-qumaaci0.js";import"./useResolvedHref-BM9nXUlO.js";import"./Search-D7ZHIykm.js";import"./useDebounce-CFQGee2M.js";import"./InputAdornment--barAyK7.js";import"./TextField-T--sTskc.js";import"./useElementFilter-CNoJY1KP.js";import"./EmptyState-5WqB2kRY.js";import"./Progress-BIGOivZ4.js";import"./LinearProgress-DliUtTjE.js";import"./ResponseErrorPanel-Do-_bX9w.js";import"./ErrorPanel-BnBbbale.js";import"./WarningPanel-B696fEmr.js";import"./MarkdownContent-D8ld7Hxa.js";import"./CodeSnippet-BfJZpbWM.js";import"./CopyTextButton-Cw35R9dI.js";import"./useCopyToClipboard-CwAb5EaD.js";import"./Tooltip-C0suzQKt.js";import"./Popper-nJ1Os4sA.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
