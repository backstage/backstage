import{j as t,m as d,I as u,b as h,T as g}from"./iframe-hd6BgcQH.js";import{r as x}from"./plugin-B56SQr8t.js";import{S as m,u as n,a as S}from"./useSearchModal-BCSsvzSc.js";import{B as c}from"./Button-3MbgNa_D.js";import{a as f,b as M,c as j}from"./DialogTitle-BJGjv1lD.js";import{B as C}from"./Box-C4_Hx4tK.js";import{S as r}from"./Grid-C4Dm4yGa.js";import{S as y}from"./SearchType-BBQFSZoi.js";import{L as I}from"./List-Eydl9qQR.js";import{H as R}from"./DefaultResultListItem-Dl4l9QQO.js";import{s as B,M as D}from"./api-Bev5I2Sd.js";import{S as T}from"./SearchContext-BtDsvwkw.js";import{w as k}from"./appWrappers-Ci8V8MLf.js";import{SearchBar as v}from"./SearchBar-B7WbcFjn.js";import{a as b}from"./SearchResult-YnO1HejZ.js";import"./preload-helper-D9Z9MdNV.js";import"./index-B1O3cqUv.js";import"./Plugin-iM4X_t4D.js";import"./componentData-Cp5cye-b.js";import"./useAnalytics-BNw5WHP5.js";import"./useApp-D57mFECn.js";import"./useRouteRef-BFQKnc9G.js";import"./index-BvioCNb0.js";import"./ArrowForward-Bdq2LjKG.js";import"./translation-BeOxiZJ4.js";import"./Page-Mmd9AkpJ.js";import"./useMediaQuery-CQ8eWNdn.js";import"./Divider-BsrVsHFl.js";import"./ArrowBackIos-D4nIN2pN.js";import"./ArrowForwardIos-DFDD0R5M.js";import"./translation-CxgaUZcL.js";import"./Modal-DC-l3nZj.js";import"./Portal-QtjodaYU.js";import"./Backdrop-TGnaLO6W.js";import"./styled-Csv0DLFw.js";import"./ExpandMore-C7-67hd9.js";import"./useAsync-DlvFpJJJ.js";import"./useMountedState-BwuO-QSl.js";import"./AccordionDetails-DosuP5Ed.js";import"./index-DnL3XN75.js";import"./Collapse-D-UdipB4.js";import"./ListItem-BuICECdF.js";import"./ListContext-DMV1tqqG.js";import"./ListItemIcon-B1o-6Fru.js";import"./ListItemText-B0MXj_oA.js";import"./Tabs-DWz-YJuh.js";import"./KeyboardArrowRight-C8dCjVF1.js";import"./FormLabel-CeQe378n.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C7qHenqP.js";import"./InputLabel-CWkIs-bu.js";import"./Select-FOK1voHD.js";import"./Popover-w_sS1QxY.js";import"./MenuItem-3YpUlPNQ.js";import"./Checkbox-CoxSolwl.js";import"./SwitchBase-BJsD66a1.js";import"./Chip-DaEx1ypY.js";import"./Link-DIsoXdRS.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-C2Ift1hU.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-Cdi9T6Hv.js";import"./useDebounce-Dkemxyww.js";import"./InputAdornment-UecACIMI.js";import"./TextField-DzMopK_m.js";import"./useElementFilter-CN_R6oRp.js";import"./EmptyState-Bg66JSmg.js";import"./Progress-2Cr9pXgW.js";import"./LinearProgress-DPLa7KRD.js";import"./ResponseErrorPanel-DOyNkJ2o.js";import"./ErrorPanel-pwFCh6zc.js";import"./WarningPanel-Le2tKfrN.js";import"./MarkdownContent-aZlBpoZT.js";import"./CodeSnippet-BlQm8FHA.js";import"./CopyTextButton-C8AIAO8L.js";import"./useCopyToClipboard-ZIjVTeCY.js";import"./Tooltip-DHFXXWJ1.js";import"./Popper-BLI_ywQx.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},io={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const ao=["Default","CustomModal"];export{i as CustomModal,s as Default,ao as __namedExportsOrder,io as default};
