import{j as t,m as d,I as u,b as h,T as g}from"./iframe-DVllq_JJ.js";import{r as x}from"./plugin-B7hHNspn.js";import{S as m,u as n,a as S}from"./useSearchModal-Bft20Y1P.js";import{B as c}from"./Button-CqkFteVA.js";import{a as f,b as M,c as j}from"./DialogTitle-tzRl7hzM.js";import{B as C}from"./Box-DvszX2T2.js";import{S as r}from"./Grid-GLf92srY.js";import{S as y}from"./SearchType-Caq4h1ix.js";import{L as I}from"./List-B5MAQ6Y4.js";import{H as R}from"./DefaultResultListItem-BkWHsgTS.js";import{s as B,M as D}from"./api-CuPwg010.js";import{S as T}from"./SearchContext-CaUhcdO1.js";import{w as k}from"./appWrappers-C9euYDcG.js";import{SearchBar as v}from"./SearchBar-Cwd4VzCt.js";import{a as b}from"./SearchResult-6NSDeWcU.js";import"./preload-helper-D9Z9MdNV.js";import"./index-D1624cHW.js";import"./Plugin-DZCzK3PC.js";import"./componentData-ir7sX7tS.js";import"./useAnalytics-gDAqv4j8.js";import"./useApp-CkFK6AHh.js";import"./useRouteRef-Dq-yTMyo.js";import"./index-CuC9x3hw.js";import"./ArrowForward-_2sqR9gC.js";import"./translation-C0yGASJG.js";import"./Page-D3qs3YpX.js";import"./useMediaQuery-Co111MRs.js";import"./Divider-CjoboeOw.js";import"./ArrowBackIos-Dx54847C.js";import"./ArrowForwardIos-DSJ3lQUs.js";import"./translation-Cmglqo59.js";import"./Modal-Iqgu4vP7.js";import"./Portal-BdFeljN4.js";import"./Backdrop-bmyTmjrQ.js";import"./styled-DfELtcUs.js";import"./ExpandMore-DeLbxlk1.js";import"./useAsync-2B4YlYUd.js";import"./useMountedState-CAQUPkod.js";import"./AccordionDetails-Df6QxQno.js";import"./index-DnL3XN75.js";import"./Collapse-BPkQPj1V.js";import"./ListItem-DLfoHZ9h.js";import"./ListContext-DE_PmqSG.js";import"./ListItemIcon-YeiYafbr.js";import"./ListItemText-C9klhbSR.js";import"./Tabs-Cg_RZuRg.js";import"./KeyboardArrowRight-Bh86fb4U.js";import"./FormLabel-BUcwKNSV.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-FUAgoXnH.js";import"./InputLabel-Bw5HT09J.js";import"./Select-C2FbmBaB.js";import"./Popover-BN4BKHON.js";import"./MenuItem-Dt6qEJa5.js";import"./Checkbox-C4IbqV4-.js";import"./SwitchBase-Ch36SCvN.js";import"./Chip-DYiRYBoC.js";import"./Link-Dfj65VZ1.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-cKfOObA8.js";import"./useIsomorphicLayoutEffect-DMTlV3dY.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-BGKlumKz.js";import"./useDebounce-ycsXZ9mc.js";import"./InputAdornment-BWQFHw_l.js";import"./TextField-Dey_iDV3.js";import"./useElementFilter-T0HMKVXR.js";import"./EmptyState-Dxiok2Gr.js";import"./Progress-DB4UOi34.js";import"./LinearProgress-CF1c1hdt.js";import"./ResponseErrorPanel-HgW860PY.js";import"./ErrorPanel-Yv09NjH-.js";import"./WarningPanel-CTVbrDnl.js";import"./MarkdownContent-C4WJ4LoY.js";import"./CodeSnippet-pYWcNvfR.js";import"./CopyTextButton-DyV_pNjJ.js";import"./useCopyToClipboard-DQH_xRRB.js";import"./Tooltip-CArIk1uN.js";import"./Popper-Bc5fPVw6.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
