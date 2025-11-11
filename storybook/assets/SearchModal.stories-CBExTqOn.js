import{j as t,m as d,I as u,b as h,T as g}from"./iframe-D1GFiJZo.js";import{r as x}from"./plugin-c1vXF8SX.js";import{S as m,u as n,a as S}from"./useSearchModal-DVbClZQm.js";import{B as c}from"./Button-DZDIOJUc.js";import{a as f,b as M,c as j}from"./DialogTitle-BrPPzfXC.js";import{B as C}from"./Box-_YREnRyM.js";import{S as r}from"./Grid-C_DJ7CXy.js";import{S as y}from"./SearchType-ps_7ZSUQ.js";import{L as I}from"./List-kH2EmDt_.js";import{H as R}from"./DefaultResultListItem-DlJoZ8ZD.js";import{s as B,M as D}from"./api-De_PjT1Y.js";import{S as T}from"./SearchContext-BXchyST7.js";import{w as k}from"./appWrappers-DsMAuWKH.js";import{SearchBar as v}from"./SearchBar-BC9i5Cey.js";import{a as b}from"./SearchResult-CX4fs_JS.js";import"./preload-helper-D9Z9MdNV.js";import"./index-3az-8BBE.js";import"./Plugin-DzFxQMSf.js";import"./componentData-B3mVAfsp.js";import"./useAnalytics-CoSsSvYs.js";import"./useApp-DQ-5E_lb.js";import"./useRouteRef-DO_E-PIP.js";import"./index-DKQ8ROEi.js";import"./ArrowForward-DKYzAO2n.js";import"./translation-8amLVOWz.js";import"./Page-UaY3G67c.js";import"./useMediaQuery-4MbFXRzp.js";import"./Divider-CCA28OD_.js";import"./ArrowBackIos-COb63muf.js";import"./ArrowForwardIos-DvL0M93b.js";import"./translation-JpRDzlh1.js";import"./Modal-Cfmtm0OK.js";import"./Portal-B8zTs1MC.js";import"./Backdrop-ClAhZkYO.js";import"./styled-CDUeIV7m.js";import"./ExpandMore-C5Qt4VBZ.js";import"./useAsync-B9mAtbAn.js";import"./useMountedState-qz1JMqOw.js";import"./AccordionDetails-CHtH84ap.js";import"./index-DnL3XN75.js";import"./Collapse-DDq3EAkH.js";import"./ListItem-DWHRsh5J.js";import"./ListContext-BZJs2wbx.js";import"./ListItemIcon-XzV9ADgi.js";import"./ListItemText-ioovX8R3.js";import"./Tabs-CQoT5SmV.js";import"./KeyboardArrowRight-Bgdjg5Bn.js";import"./FormLabel-DiBKMpdQ.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-hVy1xBfJ.js";import"./InputLabel-m1nCNF1Y.js";import"./Select-ezLRWI68.js";import"./Popover-C7YRUsdO.js";import"./MenuItem-C8UFx-bg.js";import"./Checkbox-nNn2rS54.js";import"./SwitchBase-D7D59pbg.js";import"./Chip-Bg6WP-Te.js";import"./Link-B1KKwcLj.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-mQQsnksj.js";import"./useIsomorphicLayoutEffect-C1EkHGJN.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-C0B9yy1W.js";import"./useDebounce-PiRIE27H.js";import"./InputAdornment-ByHdPgm3.js";import"./TextField-CGlidW6B.js";import"./useElementFilter-D5sH091H.js";import"./EmptyState-BIcmsXk5.js";import"./Progress-C9FqV-YY.js";import"./LinearProgress-D5nKB5p1.js";import"./ResponseErrorPanel-DQMSRnRf.js";import"./ErrorPanel-DW_UBsf7.js";import"./WarningPanel-Cp7h97Xz.js";import"./MarkdownContent-B_nTIlyA.js";import"./CodeSnippet-C5RtD8fm.js";import"./CopyTextButton-p_Y8WBTg.js";import"./useCopyToClipboard-BYpPSSth.js";import"./Tooltip-hGuiE2Q3.js";import"./Popper-CVVnhvaK.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
