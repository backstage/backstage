import{j as t,m as d,I as u,b as h,T as g}from"./iframe-BpYUhtQT.js";import{r as x}from"./plugin-BBIbsTCY.js";import{S as m,u as n,a as S}from"./useSearchModal-BXRVU_c7.js";import{B as c}from"./Button-BY1Og1vF.js";import{a as f,b as M,c as j}from"./DialogTitle-CB5Y5dHf.js";import{B as C}from"./Box-DFzIAW_k.js";import{S as r}from"./Grid-BSBIJVeD.js";import{S as y}from"./SearchType-BEzzdxKM.js";import{L as I}from"./List-CSZ53dK9.js";import{H as R}from"./DefaultResultListItem-CJpdqLm2.js";import{s as B,M as D}from"./api-CGdsmrDM.js";import{S as T}from"./SearchContext-Qa-NpMIX.js";import{w as k}from"./appWrappers-peGXwDQa.js";import{SearchBar as v}from"./SearchBar-J0LvtpRR.js";import{a as b}from"./SearchResult-CxKeFMwZ.js";import"./preload-helper-D9Z9MdNV.js";import"./index-Oo4mrAWG.js";import"./Plugin-DowXY3sc.js";import"./componentData-BaoDxexO.js";import"./useAnalytics-Bh2pk9PK.js";import"./useApp-DvIsmpbF.js";import"./useRouteRef-l3dtiGOV.js";import"./index-Ce36-Nje.js";import"./ArrowForward-BIypQajv.js";import"./translation-Bkv_J9ly.js";import"./Page-CvzAur2d.js";import"./useMediaQuery-uf84O-Sz.js";import"./Divider-C5hfIyuI.js";import"./ArrowBackIos-Bnl-FZfY.js";import"./ArrowForwardIos-DLq29f-1.js";import"./translation-_t7hmeEg.js";import"./Modal-0XcuTVfd.js";import"./Portal-OHyZAVgE.js";import"./Backdrop-RvGqs8Vm.js";import"./styled-CvmEiBn0.js";import"./ExpandMore-CeSJ010X.js";import"./useAsync-BpYeyvGz.js";import"./useMountedState-DBGgrpWA.js";import"./AccordionDetails-fjjprATf.js";import"./index-DnL3XN75.js";import"./Collapse-CmnpFYn4.js";import"./ListItem-DoWEcNrm.js";import"./ListContext-MOdDfATV.js";import"./ListItemIcon-LOr9dyWJ.js";import"./ListItemText-CJKnCLsZ.js";import"./Tabs-DRKcPHr7.js";import"./KeyboardArrowRight-Cy4ruyXZ.js";import"./FormLabel-CpvPMx-l.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-AOp6HVrP.js";import"./InputLabel-BMr4kJZH.js";import"./Select-Bll_j_Zk.js";import"./Popover-BGVNopjx.js";import"./MenuItem-DGez6lGh.js";import"./Checkbox-DFFHda2d.js";import"./SwitchBase-DHDHzWjp.js";import"./Chip-DmrAEOMg.js";import"./Link-CMqafiV1.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-3jB7UW4m.js";import"./useIsomorphicLayoutEffect-1EIRTIdR.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-CsRDj4OK.js";import"./useDebounce-CNrIE5Yj.js";import"./InputAdornment-DeJagCwp.js";import"./TextField-CISKLtrm.js";import"./useElementFilter-DvqkU95I.js";import"./EmptyState-FAbcyjGW.js";import"./Progress-BCP_Cj2v.js";import"./LinearProgress-BdfIs5bH.js";import"./ResponseErrorPanel-CV-P6yt3.js";import"./ErrorPanel-DX0kqAsP.js";import"./WarningPanel-8zkHCnj8.js";import"./MarkdownContent-BWS4BjxZ.js";import"./CodeSnippet-C2KdpqrO.js";import"./CopyTextButton-DC1eYg7O.js";import"./useCopyToClipboard-shAo73Yc.js";import"./Tooltip-CKt0VlQr.js";import"./Popper-mZ76pVB3.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
