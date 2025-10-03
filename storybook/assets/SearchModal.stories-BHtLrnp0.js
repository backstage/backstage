import{j as t,m as d,I as u,b as h,T as g}from"./iframe-Dl820wOI.js";import{r as x}from"./plugin-CJ55tAHj.js";import{S as m,u as n,a as S}from"./useSearchModal-DgHFSID8.js";import{B as c}from"./Button-BNshOWAl.js";import{a as f,b as M,c as j}from"./DialogTitle-CxtWIpkN.js";import{B as C}from"./Box-DfeHQWeE.js";import{S as r}from"./Grid-BlSwvCAu.js";import{S as y}from"./SearchType-CfYMHn2S.js";import{L as I}from"./List-CHKnkhL9.js";import{H as R}from"./DefaultResultListItem-hzyZ3rE1.js";import{s as B,M as D}from"./api-bX86jQEN.js";import{S as T}from"./SearchContext-Cv5wEdni.js";import{w as k}from"./appWrappers-BD3uh5nl.js";import{SearchBar as v}from"./SearchBar-nMF0Hbf6.js";import{a as b}from"./SearchResult-CWrMX-V3.js";import"./preload-helper-D9Z9MdNV.js";import"./index-D25X2y_G.js";import"./Plugin-3vtTV61V.js";import"./componentData-9E7-GlxJ.js";import"./useAnalytics-H66oe0oN.js";import"./useApp-B5QaOHzA.js";import"./useRouteRef-C9mydBcp.js";import"./index-Dc9OD8OQ.js";import"./ArrowForward-Bcalu6Is.js";import"./translation-DeiNAg8u.js";import"./Page-z61xkk9v.js";import"./useMediaQuery-BWcvjqKr.js";import"./Divider-BgKPwKXb.js";import"./ArrowBackIos-DXAtd1vz.js";import"./ArrowForwardIos-C5qwKP5D.js";import"./translation-COopHTDc.js";import"./Modal-DWfTsRMv.js";import"./Portal-jLwVh-5o.js";import"./Backdrop-BMrQTwpi.js";import"./styled-kfqHWboF.js";import"./ExpandMore-BlvUDGnA.js";import"./useAsync-BnrwJMnZ.js";import"./useMountedState-C0tKh2p0.js";import"./AccordionDetails-vMLxVx9E.js";import"./index-DnL3XN75.js";import"./Collapse-s2rcogEo.js";import"./ListItem-Bj_ICtqE.js";import"./ListContext-Cbtrueie.js";import"./ListItemIcon-DrGWVCyr.js";import"./ListItemText-D5ck7_4o.js";import"./Tabs-BIxMpqVJ.js";import"./KeyboardArrowRight-DNyRR6qg.js";import"./FormLabel-BDao_Jja.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C6yRTLvD.js";import"./InputLabel-BOxel5ik.js";import"./Select-CIc-d9z8.js";import"./Popover-DbocIA8t.js";import"./MenuItem-Blnz45KO.js";import"./Checkbox-BsNDRpdz.js";import"./SwitchBase-DSh0MH59.js";import"./Chip-D4u3tG0M.js";import"./Link-BTOOY6TC.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-C0M1HCkm.js";import"./useIsomorphicLayoutEffect-BfWFNjzn.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-BhLXxD9Y.js";import"./useDebounce-C56y64Om.js";import"./InputAdornment-CzG4FWCq.js";import"./TextField-C8dQAzK_.js";import"./useElementFilter-MLea2u1h.js";import"./EmptyState-DgTHzH1d.js";import"./Progress-t-nyfFOY.js";import"./LinearProgress-NJqlj10q.js";import"./ResponseErrorPanel-DWekh3jx.js";import"./ErrorPanel-Bkv9ZIFz.js";import"./WarningPanel-CQQpX2Kh.js";import"./MarkdownContent-Cgb47FM9.js";import"./CodeSnippet-C8tyMWnK.js";import"./CopyTextButton-Dfef_A-E.js";import"./useCopyToClipboard-y5aTqnvo.js";import"./Tooltip-DqMu2rNF.js";import"./Popper-CWjD6Kfi.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
