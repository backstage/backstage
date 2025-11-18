import{j as t,m as d,I as u,b as h,T as g}from"./iframe-BJLAQiny.js";import{r as x}from"./plugin-DdYoI9xx.js";import{S as m,u as n,a as S}from"./useSearchModal-D3dUVdoQ.js";import{B as c}from"./Button-CtgRUIFg.js";import{a as f,b as M,c as j}from"./DialogTitle-BYsWp0dH.js";import{B as C}from"./Box-DBjVidWA.js";import{S as r}from"./Grid-85KaXqj6.js";import{S as y}from"./SearchType-COhAknJ3.js";import{L as I}from"./List-DMFoD1Fa.js";import{H as R}from"./DefaultResultListItem-D9tQ_DhV.js";import{s as B,M as D}from"./api-DTqee4sT.js";import{S as T}from"./SearchContext-BCvQx2VI.js";import{w as k}from"./appWrappers-Ch3ZwAuI.js";import{SearchBar as v}from"./SearchBar-BRa-BhbO.js";import{a as b}from"./SearchResult-wtYpkBfP.js";import"./preload-helper-D9Z9MdNV.js";import"./index-BSxJtKs0.js";import"./Plugin-CG7_4OWW.js";import"./componentData-Bg3JyZcy.js";import"./useAnalytics-W203HJ0-.js";import"./useApp-BTkCnRE2.js";import"./useRouteRef-CVo3EImE.js";import"./index-bnZRQeHC.js";import"./ArrowForward-Ds6zgypX.js";import"./translation-D2Z0aZJa.js";import"./Page-B4woTrdX.js";import"./useMediaQuery-CEtGkehQ.js";import"./Divider-DsKh9GaH.js";import"./ArrowBackIos-lTlPgSr3.js";import"./ArrowForwardIos-Dezcc8K6.js";import"./translation-BwxD82CN.js";import"./Modal-98ZwNGha.js";import"./Portal-B2YIacrT.js";import"./Backdrop-BKPXV1ri.js";import"./styled-Dbum34QX.js";import"./ExpandMore-C9SKMfwh.js";import"./useAsync-D_PwxK1T.js";import"./useMountedState-DW1n1H5-.js";import"./AccordionDetails-BeK8TLKU.js";import"./index-DnL3XN75.js";import"./Collapse-Dyo3yIeQ.js";import"./ListItem-Ccj_bLuX.js";import"./ListContext-HC4v7bkz.js";import"./ListItemIcon-Cxtfu6Dv.js";import"./ListItemText-B0trVnJh.js";import"./Tabs-CoWuzjHR.js";import"./KeyboardArrowRight-Cp0fypt_.js";import"./FormLabel-DPIvM0BG.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CYB0Xnn0.js";import"./InputLabel-Dtef0gRY.js";import"./Select-DPb2sQRT.js";import"./Popover-BTSzFMjF.js";import"./MenuItem-Ctu1yU60.js";import"./Checkbox-ByzZ54Zr.js";import"./SwitchBase-BgFmmPjR.js";import"./Chip-D92imzG-.js";import"./Link-BsQxZTCc.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-DxZEzPKu.js";import"./useIsomorphicLayoutEffect-YDmtHS5G.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-BPltMbRo.js";import"./useDebounce-Dg6czRPa.js";import"./InputAdornment-1qc7R8kf.js";import"./TextField-CgBMAxsv.js";import"./useElementFilter-CBL8LEF3.js";import"./EmptyState-DUoabrgB.js";import"./Progress-BmTF_qQn.js";import"./LinearProgress-CZhdSkeH.js";import"./ResponseErrorPanel-EEL3ECqX.js";import"./ErrorPanel-C7O53zca.js";import"./WarningPanel-Cx0u9N3G.js";import"./MarkdownContent-C9K6rk9j.js";import"./CodeSnippet-BCiMU4qs.js";import"./CopyTextButton-qCRVuup2.js";import"./useCopyToClipboard-WIY93EcD.js";import"./Tooltip-DWt_B2xO.js";import"./Popper-DQtSbLkc.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
