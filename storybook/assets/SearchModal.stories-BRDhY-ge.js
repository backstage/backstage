import{j as t,W as d,a3 as u,a2 as h}from"./iframe-Dl5_TB80.js";import{r as g}from"./plugin-CdXR2yhU.js";import{S as l,u as n,a as x}from"./useSearchModal-CUQhAYJD.js";import{B as c}from"./Button-BUe760aN.js";import{D as S,a as f,b as M}from"./DialogTitle-QEAPmYBo.js";import{B as j}from"./Box-OWTqpTcU.js";import{S as r}from"./Grid-BMYKcvy9.js";import{S as C}from"./SearchType-CBCCbc2p.js";import{L as y}from"./List-C3tE9H9r.js";import{H as I}from"./DefaultResultListItem-CUIxS1zC.js";import{w as R}from"./appWrappers-C2CsmFBq.js";import{m as B}from"./makeStyles-DVCr62xB.js";import{s as D,M as k}from"./api-XU0AZr6w.js";import{S as v}from"./SearchContext-Dz9t0Dya.js";import{SearchBar as T}from"./SearchBar-BHQeQnhb.js";import{S as b}from"./SearchResult-Bw_yQ3bK.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CDywBNYd.js";import"./Plugin-BXUR2EE9.js";import"./componentData-DtE3vOgI.js";import"./useAnalytics-Co8FXgmH.js";import"./useApp-DpzLiM-Q.js";import"./useRouteRef-BJ_-dyPq.js";import"./ArrowForward-BgKhGbwG.js";import"./translation-Bu03xfn-.js";import"./Page-Uaow7Ble.js";import"./useMediaQuery-CgYtNtTv.js";import"./Divider-BMXypekn.js";import"./ArrowBackIos-Pv4z0bKO.js";import"./ArrowForwardIos-CGR72ee1.js";import"./translation-lCtEZowQ.js";import"./Modal-B2_6DlPv.js";import"./Portal-BqMy1omF.js";import"./Backdrop-CdpSYCjf.js";import"./styled-fbCpj-h3.js";import"./ExpandMore-DIlhH76V.js";import"./useAsync-CXdWiZfr.js";import"./useMountedState-EgIiw3wU.js";import"./AccordionDetails-BiykvKQ8.js";import"./index-B9sM2jn7.js";import"./Collapse-fj436sW1.js";import"./ListItem-BeH4jBX0.js";import"./ListContext-CchtOyLx.js";import"./ListItemIcon-jAg8xCQ2.js";import"./ListItemText-DyWL0Vxa.js";import"./Tabs-DtqJBHXf.js";import"./KeyboardArrowRight-_mm2-1nC.js";import"./FormLabel-BbBiEv5Y.js";import"./formControlState-M_nCniSy.js";import"./InputLabel-B9SfxFG2.js";import"./Select--XjuSv-m.js";import"./Popover-DeCGPguR.js";import"./MenuItem-BGDswtmG.js";import"./Checkbox-Cd9JzOte.js";import"./SwitchBase-CbSziPB5.js";import"./Chip-DGp0soLL.js";import"./Link-CT10y7Op.js";import"./index-DcwzAR-E.js";import"./lodash-CqCFQ6Ro.js";import"./WebStorage-CF39K5YO.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BZG0bVa_.js";import"./useIsomorphicLayoutEffect-B67PNbsd.js";import"./BUIProvider-sLDoZC3d.js";import"./openLink-k3Gx7yeJ.js";import"./useResolvedHref-DRZH4CNB.js";import"./Search-mM6ZvuP1.js";import"./useDebounce-D0hl7a9i.js";import"./InputAdornment-0jv1hc7k.js";import"./TextField-BBnxZoA9.js";import"./useElementFilter-BFMTj19v.js";import"./EmptyState-CVm1tJd9.js";import"./Progress--dxtjanz.js";import"./LinearProgress-Bu-gJ9Oc.js";import"./ResponseErrorPanel-Dse68s1C.js";import"./ErrorPanel-BPzLORH7.js";import"./WarningPanel-BSPokcp_.js";import"./MarkdownContent-BLGD7BNH.js";import"./CodeSnippet-CV86_haX.js";import"./CopyTextButton-B1Ogkd6W.js";import"./useCopyToClipboard-BHD8qfJk.js";import"./Tooltip-5QI_fZNO.js";import"./Popper-DQQ5NpOP.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
